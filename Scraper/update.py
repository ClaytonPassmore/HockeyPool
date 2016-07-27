import logging
import time

import MySQLdb

from config import DBConfig
from StatsDigester import REGULAR_SEASON_ID, PLAYOFFS_ID, StatsDigester as SD


"""
Run this script periodically to update the database.
"""

# TODO:
# Add a log file to log errors.


def update_table(sql_con, URL, table_name):
    """Update the table by creating a list of queries that we can execute all at once (kind of)"""

    try:
        js = SD.fetchJSON(URL)
    except:
        logging.exception('Could not fetch JSON')
        return -1

    if not js or not js.get('data'):
        logging.error('JSON contained no data')
        return -1

    if table_name == 'teams':
        id_key = 'teamId'
    else:  # Players and goalies
        id_key = 'playerId'

    # If NHL changes their column names, we're SOL.
    keys = js['data'][0].keys()
    columns = list(set(keys) - set([id_key]))

    query = u'UPDATE {} SET {} WHERE id={}'
    query_list = []

    for item in js['data']:
        string = u''
        for k in range(len(columns)):
            # Have to put this in quotes
            if type(item[columns[k]]) is unicode:
                addition = u'"' + item[columns[k]] + u'"'
            else:
                addition = str(item[columns[k]])
            string += columns[k] + '=' + addition
            if k < (len(columns) - 1):
                string += ','
        # Add the query to the list of queries.
        query_list.append(query.format(table_name, string, item[id_key]))

    # Get a cursor from the database connection
    cursor = sql_con.cursor()
    if not cursor:
        logging.error('Could not create DB cursor')
        return -1

    # Run the transaction
    for query in query_list:
        # Have to encode the query in ascii first.
        try:
            cursor.execute(query.encode('utf-8'))
        except:
            sql_con.rollback()
            cursor.close()
            logging.exception('Could not update a row')
            return -1

    # Commit the changes
    try:
        sql_con.commit()
    except:
        sql_con.rollback()
        cursor.close()
        logging.exception('Could not perform the update transaction')
        return -1

    # Close the cursor
    cursor.close()

    # Success!
    return 0


def main():
   # Attempt to open the season config file
    fd = open('season.cfg', 'r')

    if not fd:
        logging.error('Could not open config file')
        return -1

    # Read the data from the config file.
    cfg_data = []
    for line in fd:
        cfg_data.append(line.strip())
    fd.close()

    try:
        season = (int(cfg_data[0]), int(cfg_data[1]))
        season_type = int(cfg_data[2])
        if season_type != REGULAR_SEASON_ID and season_type != PLAYOFFS_ID:
            raise Exception('Invalid season type')
    except:
        logging.error('Invalid contents in config file')
        return -1

    # Create the URLs to retrieve data from.
    teamURL = SD.getURL(season, 'team', season_type)
    playerURL = SD.getURL(season, 'player', season_type)
    goalieURL = SD.getURL(season, 'goalie', season_type)

    # Create a connection to the database.
    db = MySQLdb.connect(
        host=DBConfig.HOST,
        user=DBConfig.USER,
        passwd=DBConfig.PASSWORD,
        db=DBConfig.DB)

    if not db:
        logging.error('Unable to connect to DB')
        return -1

    db.autocommit(False)

    # Update the tables
    if (update_table(db, teamURL, 'teams') or
            update_table(db, playerURL, 'players') or
            update_table(db, goalieURL, 'goalies')):
        logging.error('Unable to update database')
        return -1

    # Close the connection to the database.
    db.close()

    # Write out the time that we updated at.
    fd = open('last_updated.cfg', 'w')
    if not fd:
        logging.warning('Could not write the update time')
        return -1
    fd.write(str(time.time()) + '\n')
    fd.close()

    return 0


if __name__ == '__main__':
    main()
