import json
import logging

import flask
import MySQLdb

from config import DBConfig

db = MySQLdb.connect(
    host=DBConfig.HOST,
    user=DBConfig.USER,
    passwd=DBConfig.PASSWORD,
    db=DBConfig.DB)

if not db:
    print('Unable to connect to DB. Abort.')
    exit(-1)

app = flask.Flask(__name__)

@app.route('/draft')
def draft():
    return flask.render_template('draft.html')

@app.route('/rest')
def rest():
    try:
        global db
        player_query = "SELECT id, playerName, playerTeamsPlayedFor FROM players"
        team_query = "SELECT id, teamFullName, teamAbbrev FROM teams"

        # Query for teams
        db.query(team_query)
        teams_result = db.store_result()
        teams = list(teams_result.fetch_row(maxrows=0))
        teams = map(list, teams)

        # Decode unicode strings
        for i in range(len(teams)):
            dic = {}
            dic[u'id'] = teams[i][0]
            dic[u'name'] = teams[i][1].decode('utf-8')
            dic[u'short'] = teams[i][2].decode('utf-8')
            teams[i] = dic

        # Query for players
        db.query(player_query)
        players_result = db.store_result()
        players = list(players_result.fetch_row(maxrows=0))
        players = map(list, players)

        # Decode unicode strings
        for i in range(len(players)):
            dic = {}
            dic[u'id'] = players[i][0]
            dic[u'name'] = players[i][1].decode('utf-8')
            dic[u'team'] = players[i][2].decode('utf-8')
            players[i] = dic

        # Encode the result in unicode
        result = json.dumps({u'teams': teams, u'players': players}, ensure_ascii=False)
        response = flask.make_response(result)
        return response
    except:
        logging.exception('Unable to fetch data from DB')
        flask.abort(500)
        return

@app.route('/')
def root():
    return "In progress"


if __name__ == '__main__':
    app.run()
