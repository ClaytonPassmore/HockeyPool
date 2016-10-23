import json
import logging

import MySQLdb

from config import DBConfig
from utils.base_handler import BaseHandler
from utils.db import latest_season_db, jsonify_query_results


class DraftHandler(BaseHandler):
    def get(self):
        return self.render_template('draft.html');


class DraftTeamHandler(BaseHandler):
    def get(self):
        try:
            db = MySQLdb.connect(
                host=DBConfig.HOST,
                user=DBConfig.USER,
                passwd=DBConfig.PASSWORD,
                db=latest_season_db()
            )

            player_query = ('SELECT id, playerName, playerPositionCode, t.teamAbbrev, t.teamFullName '
                            'FROM players JOIN (SELECT teamFullName, teamAbbrev FROM teams) as t '
                            'ON playerTeamsPlayedFor = t.teamAbbrev')
            goalie_query = ('SELECT id, (SELECT CONCAT(teamFullName, \' Goaltenders\')) AS playerName, '
                            '(SELECT \'G\') as playerPositionCode, teamAbbrev, teamFullName FROM teams')
            players = jsonify_query_results(db, player_query)
            goalies = jsonify_query_results(db, goalie_query)
            return json.dumps(players + goalies)
        except:
            logging.exception('Unable to fetch data from DB')
            self.abort(500)


class DraftSubmitHandler(BaseHandler):
    def post(self):
        submit_data = None
        try:
            submit_data = json.loads(self.request.data)
        except:
            logging.warning('Submit data was malformed')
            self.abort(400)
        return 'OK'


routes = [
    ('/draft', DraftHandler),
    ('/draft/players', DraftTeamHandler),
    ('/draft/submit', DraftSubmitHandler)
]
