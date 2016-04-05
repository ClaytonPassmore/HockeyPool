import json
import flask
import MySQLdb

db = MySQLdb.connect(host='localhost', user='root', passwd='root', db='HockeyPool')
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
        player_query = "SELECT playerName, playerTeamsPlayedFor FROM players"
        team_query = "SELECT teamFullName, teamAbbrev FROM teams"

        # Query for teams
        db.query(team_query)
        teams_result = db.store_result()
        teams = list(teams_result.fetch_row(maxrows=0))
        teams = map(list, teams)

        # Decode unicode strings
        for i in range(len(teams)):
            for j in range(len(teams[i])):
                teams[i][j] = teams[i][j].decode('utf-8')

        # Query for players
        db.query(player_query)
        players_result = db.store_result()
        players = list(players_result.fetch_row(maxrows=0))
        players = map(list, players)

        # Decode unicode strings
        for i in range(len(players)):
            for j in range(len(players[i])):
                players[i][j] = players[i][j].decode('utf-8')

        # Encode the result in unicode
        result = json.dumps({u'teams': teams, u'players': players}, ensure_ascii=False)
        response = flask.make_response(result)
        return response
    except:
        return

@app.route('/')
def root():
    return "In progress"


if __name__ == '__main__':
    app.run()
