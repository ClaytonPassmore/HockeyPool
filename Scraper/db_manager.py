import logging
import sys
from argparse import ArgumentParser, ArgumentError

import MySQLdb

from config import DBConfig
from stats_digester import fetch_summary, REGULAR_SEASON_ID, PLAYOFFS_ID

logging.basicConfig(level=logging.INFO)
ERROR = 1
OK = 0


def operation_type(val):
    if val not in ('initialize', 'update'):
        raise ArgumentError('Invalid operation')
    return val


def main():
    parser = ArgumentParser()
    parser.add_argument('season', type=int, help='The year the season started in')
    parser.add_argument('operation', type=operation_type, help='initialize or update')
    args = parser.parse_args(sys.argv[1:])

    db = MySQLdb.connect(
        host=DBConfig.HOST,
        user=DBConfig.USER,
        passwd=DBConfig.PASSWORD)

    if not db:
        logging.error('Unable to connect to DB')
        return ERROR

    if args.operation == 'initialize':
        return initialize(db, args.season)
    else:
        return update(db, args.season)


def update(db, season_start):
    database = DBConfig.DB_FORMAT.format(season_start)
    season = (season_start, season_start + 1)
    db.select_db(database)
    logging.info('Updating database {}'.format(database))

    logging.info('Updating team table')
    try:
        update_table(db, season, 'team', DBConfig.TEAMS_TABLE, 'teamId')
    except:
        logging.error('Team update failed')
        return ERROR

    logging.info('Updating player table')
    try:
        update_table(db, season, 'player', DBConfig.PLAYERS_TABLE, 'playerId')
    except:
        logging.error('Player update failed')
        return ERROR

    logging.info('Updating goalie table')
    try:
        update_table(db, season, 'goalie', DBConfig.GOALIES_TABLE, 'playerId')
    except:
        logging.error('Goalie update failed')
        return ERROR


def update_table(connector, season, sum_type, table, id_map):
    data = fetch_summary(season, sum_type, PLAYOFFS_ID)
    if not data:
        raise ValueError('Could not retrieve JSON')

    query_list = []
    query = 'UPDATE {} SET {} WHERE id={}'
    for item in data['data']:
        vals = []
        for key, value in item.iteritems():
            if key == id_map:
                continue

            # This attribute lists all teams the player has played for.
            # We only care about the last (most recent) one.
            if key == 'playerTeamsPlayedFor':
                value = value.split(', ')[-1]

            if isinstance(value, (str, unicode)):
                value = '"' + value.encode('utf-8') + '"'
            vals.append('{}={}'.format(key, value))

        query_list.append(query.format(table, ','.join(vals), item[id_map]))

    sql_transaction(connector, query_list)


def initialize(db, season_start):
    database = DBConfig.DB_FORMAT.format(season_start)
    season = (season_start, season_start + 1)

    logging.info('Creating database {}'.format(database))
    sql_transaction(db, 'DROP DATABASE IF EXISTS {}'.format(database))
    sql_transaction(db, 'CREATE DATABASE IF NOT EXISTS {}'.format(database))
    db.select_db(database)

    logging.info('Constructing team table')
    with open(DBConfig.TEAMS_CREATE, 'r') as fd:
        sql_transaction(db, fd.read())

    logging.info('Populating team table')
    try:
        populate(db, season, 'team', DBConfig.TEAMS_TABLE, {
            'id': 'teamId',
            'teamFullName': 'teamFullName',
            'teamAbbrev': 'teamAbbrev'
        })
    except:
        logging.error('Team populate failed')
        return ERROR

    logging.info('Constructing player table')
    with open(DBConfig.PLAYERS_CREATE, 'r') as fd:
        sql_transaction(db, fd.read())

    logging.info('Populating player table')
    try:
        populate(db, season, 'player', DBConfig.PLAYERS_TABLE, {
            'id': 'playerId',
            'playerName': 'playerName',
            'playerTeamsPlayedFor': 'playerTeamsPlayedFor',
            'playerPositionCode': 'playerPositionCode'
        })
    except:
        logging.error('Player populate failed')
        return ERROR

    logging.info('Constructing goalie table')
    with open(DBConfig.GOALIES_CREATE, 'r') as fd:
        sql_transaction(db, fd.read())

    logging.info('Populating goalie table')
    try:
        populate(db, season, 'goalie', DBConfig.GOALIES_TABLE, {
            'id': 'playerId',
            'playerName': 'playerName',
            'playerTeamsPlayedFor': 'playerTeamsPlayedFor',
            'playerPositionCode': 'playerPositionCode'
        })
    except:
        logging.error('Goalie populate failed')
        return ERROR


def populate(connector, season, sum_type, table, col_map):
    data = fetch_summary(season, sum_type, REGULAR_SEASON_ID)
    if not data:
        raise ValueError('Could not retrieve JSON')

    columns = []
    keys = []
    for column, key in col_map.iteritems():
        columns.append(column)
        keys.append(key)

    query = 'INSERT INTO {} ({}) VALUES '.format(table, ','.join(columns))
    rows = []
    for item in data['data']:
        row_args = []
        for key in keys:
            val = item[key]

            # This attribute lists all teams the player has played for.
            # We only care about the last (most recent) one.
            if key == 'playerTeamsPlayedFor':
                val = val.split(', ')[-1]

            if isinstance(val, (str, unicode)):
                val = '"' + val.encode('utf-8') + '"'
            else:
                val = str(val)
            row_args.append(val)
        rows.append('(' + ','.join(row_args) + ')')
    query += ','.join(rows)

    sql_transaction(connector, query)


def sql_transaction(connector, query_list):
    if isinstance(query_list, str):
        query_list = [query_list]

    connector.autocommit(False)
    cursor = connector.cursor()
    if not cursor:
        logging.error('Could not create cursor')
        raise

    try:
        for query in query_list:
            cursor.execute(query)
        connector.commit()
    except:
        connector.rollback()
        cursor.close()
        logging.exception('Could not execute transaction')
        raise

    cursor.close()


if __name__ == '__main__':
    exit(main())
