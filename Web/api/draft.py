import json
import logging
import re

from config import DBConfig, DraftConfig
from utils.base_handler import BaseHandler
from utils.db import latest_season_db, jsonify_query_results
from utils.wrappers import require_params, db_conn, db_cursor


class DraftHandler(BaseHandler):
    def get(self):
        return self.render_template('draft.html');


class DraftNameHandler(BaseHandler):
    @require_params('name')
    @db_cursor(latest_season_db())
    def post(cursor, name, self):
        if re.match('^[0-9a-zA-Z \-_]+$', name) is None or len(name) > DraftConfig.MAX_TEAM_NAME_LENGTH:
            return self.make_response('Invalid name', status=415)

        cursor.execute('SELECT name FROM drafts WHERE name=%s', (name, ))
        for result in cursor:
            return self.make_response(DraftConfig.NAME_TAKEN_RESPONSE)

        return self.make_response(DraftConfig.NAME_AVAILABLE_RESPONSE)


class DraftTeamHandler(BaseHandler):
    @db_conn(latest_season_db())
    def get(db, self):
        player_query = ('SELECT id, playerName, playerPositionCode, t.teamAbbrev, t.teamFullName '
                        'FROM players JOIN (SELECT teamFullName, teamAbbrev FROM teams) as t '
                        'ON playerTeamsPlayedFor = t.teamAbbrev')
        goalie_query = ('SELECT id, (SELECT CONCAT(teamFullName, \' Goaltenders\')) AS playerName, '
                        '(SELECT \'G\') as playerPositionCode, teamAbbrev, teamFullName FROM teams')
        players = jsonify_query_results(db, player_query)
        goalies = jsonify_query_results(db, goalie_query)
        return json.dumps(players + goalies)


class DraftSubmitHandler(BaseHandler):
    def post(self):
        submit_data = None
        try:
            submit_data = json.loads(self.request.data)
        except:
            logging.warning('Submit data was malformed')
            self.abort(400)
        return self.make_response('OK')


routes = [
    ('/draft', DraftHandler),
    ('/draft/name', DraftNameHandler),
    ('/draft/players', DraftTeamHandler),
    ('/draft/submit', DraftSubmitHandler)
]
