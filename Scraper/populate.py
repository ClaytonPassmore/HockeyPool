import logging
import sys
import time

import MySQLdb

from config import DBConfig
from StatsDigester import REGULAR_SEASON_ID, PLAYOFFS_ID, StatsDigester as SD

"""
Populate the database with information for a given season.

Also write out a config file with the season information.
"""


def insert_data_in_db(sql_con, URL, table_name):
    """Fetch data from the given URL and insert it into table_name"""

    try:
        js = SD.fetchJSON(URL)
    except:
        return -1

    if not js or len(js['data']) == 0:
        return -1

    # Only populate entries with a small subset of keys
    if table_name == 'teams':
        keys = ['teamId', 'teamFullName', 'teamAbbrev']
        columns = ['id', 'teamFullName', 'teamAbbrev']
    else:  # Players and goalies
        keys = ['playerId', 'playerName', 'playerTeamsPlayedFor']
        columns = ['id', 'playerName', 'playerTeamsPlayedFor']

    # Start building the query
    query = u'INSERT INTO {} ({}) VALUES 'format(table_name, columns)

    # Add the data from each entry to the query
    for i in range(len(js['data'])):
        row = u'({},"{}","{}")'.format(js['data'][i][keys[0]],
                                       js['data'][i][keys[1]],
                                       js['data'][i][keys[2]])

        # Add this entry to the query
        query += row

        # Add a comma if we have more entries to go.
        if i < (len(js['data']) - 1):
            query += ','

    # Get a cursor from the database connection
    sql_con.autocommit(False)
    cursor = sql_con.cursor()
    if not cursor:
        return -1

    # Run the transaction
    # Have to encode the query first.
    try:
        cursor.execute(query.encode('utf-8'))
        sql_con.commit()
    except:
        sql_con.rollback()
        cursor.close()
        return -1

    cursor.close()

    # Success!
    return 0


def usage():
    """Print the usage of the script"""

    print("USAGE:")
    print(sys.argv[0] + ' <SEASON_START_YEAR> <SEASON_END_YEAR> <1 IF PLAYOFFS, 0 IF REGULAR SEASON>')


def main():
    if len(sys.argv) != 4:
        usage()
        return -1

    # Try to interpret the command line arguments
    try:
        season = (int(sys.argv[1]), int(sys.argv[2]))
        season_type = PLAYOFFS_ID
        if int(sys.argv[3]) != 1:
            season_type = REGULAR_SEASON_ID
    except:
        usage()
        return -1

    # Open the config file
    config = 'season.cfg'
    fd = open(config, 'w')
    if not fd:
        logging.error('Unable to write season config. Abort.')
        return -1

    # Write the season info to the config
    fd.write(str(season[0]) + '\n')
    fd.write(str(season[1]) + '\n')
    fd.write(str(season_type) + '\n')
    fd.close()

    # Start retrieving the data from nhl.com
    # Always populate with regular season data.
    teamURL = SD.getURL(season, 'team', REGULAR_SEASON_ID)
    playerURL = SD.getURL(season, 'player', REGULAR_SEASON_ID)
    goalieURL = SD.getURL(season, 'goalie', REGULAR_SEASON_ID)

    # Create a database connection.
    db = MySQLdb.connect(
        host=DBConfig.HOST,
        user=DBConfig.USER,
        passwd=DBConfig.PASSWORD,
        db=DBConfig.DB)

    if not db:
        logging.error('Unable to connect to DB. Abort.')
        return -1


    # Put the data in the database.
    if (insert_data_in_db(db, teamURL, 'teams') or
            insert_data_in_db(db, playerURL, 'players') or
            insert_data_in_db(db, goalieURL, 'goalies')):
        logging.error('Error inserting data into database. Abort.')
        return -1

    # Close the database connection.
    db.close()

    # Write out the time so we know when the DB was last updated.
    fd = open('last_updated.cfg', 'w')
    if not fd:
        logging.warning('Could not write update time')
    fd.write(str(time.time()) + '\n')
    fd.close()


if __name__ == '__main__':
    main()
