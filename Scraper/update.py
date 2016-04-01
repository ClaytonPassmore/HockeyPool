import time
import MySQLdb

from StatsDigester import StatsDigester as SD
from StatsDigester import REGULAR_SEASON_ID, PLAYOFFS_ID


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
        return -1

    if not js or len(js['data']) == 0:
        return -1

    # Determine the column names
    # Note if NHL changes their column names, we're SOL.
    keys = js['data'][0].keys()
    columns = ','.join(keys)

    # Determine the primary key for the table
    if table_name == 'teams':
        pkey = u'teamId'
    elif table_name == 'players':
        pkey = u'playerId'
    else:
        return -1

    query = u'UPDATE %s SET %s WHERE %s=%d'
    query_list = []

    for item in js['data']:
        string = u''
        for k in range(len(keys)):
            # Have to put this in quotes
            if type(item[keys[k]]) is unicode:
                addition = u'"' + item[keys[k]] + u'"'
            else:
                addition = str(item[keys[k]])
            string += keys[k] + '=' + addition
            if k < (len(keys) - 1):
                string += ','
        # Add the query to the list of queries.
        query_list.append(query % (table_name, string, pkey, item[pkey]))

    # Get a cursor from the database connection
    cursor = sql_con.cursor()
    if not cursor:
        return -1

    # Run the transaction
    for query in query_list:
        # Have to encode the query in ascii first.
        try:
            cursor.execute(query.encode('utf-8'))
        except:
            sql_con.rollback()
            cursor.close()
            return -1

    # Commit the changes
    try:
        sql_con.commit()
    except:
        sql_con.rollback()
        cursor.close()
        return -1

    # Close the cursor
    cursor.close()

    # Success!
    return 0


def main():
   # Attempt to open the season config file
    fd = open('season.cfg', 'r')

    if not fd:
        print('Could not open config file. Abort.')
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
        print('Invalid contents in config file. Abort.')
        return -1

    # Create the URLs to retrieve data from.
    teamURL = SD.getURL(season, 'team', season_type)
    playerURL = SD.getURL(season, 'player', season_type)

    # Create a connection to the database.
    db = MySQLdb.connect(host='localhost', user='root', passwd='root', db='HockeyPool')
    if not db:
        print('Unable to connect to DB. Abort.')
        return -1

    db.autocommit(False)

    # Update the tables
    if update_table(db, teamURL, 'teams') or update_table(db, playerURL, 'players'):
        print('Unable to update database. Abort.')
        return -1

    # Close the connection to the database.
    db.close()

    # Write out the time that we updated at.
    fd = open('last_updated.cfg', 'w')
    if not fd:
        print('Could not write the update time')
        return -1
    fd.write(str(time.time()) + '\n')
    fd.close()

    return 0


if __name__ == '__main__':
    main()
