import urllib
import json
import sys

BASE_URL = 'http://www.nhl.com/stats/rest/grouped/'
TEAM_STATS = 'teams/season/teamsummary'
PLAYER_STATS = 'skaters/season/skatersummary'
GOALIE_STATS = 'goalies/season/goaliesummary'
CAYENNE_EXP_FORMAT = '?cayenneExp=seasonId=%04d%04d%%20and%%20gameTypeId=%d'

REGULAR_SEASON_ID = 2
PLAYOFFS_ID = 3


class StatsDigester:
    """Retrieve NHL stats from nhl.com"""

    @staticmethod
    def getURL(season, summary_type='team', game_type=REGULAR_SEASON_ID):
        """Form the URL to retrieve stats from"""

        if(len(season) != 2):
            raise ValueError("Invalid Season Format")

        if(game_type != REGULAR_SEASON_ID and game_type != PLAYOFFS_ID):
            raise ValueError("Invalid Game Type")

        sum_str = None
        if(summary_type == 'team'):
            sum_str = TEAM_STATS
        elif(summary_type == 'player'):
            sum_str = PLAYER_STATS
        elif(summary_type == 'goalie'):
            sum_str = GOALIE_STATS
        else:
            raise ValueError("Invalid Summary Type")

        cayenne_str = CAYENNE_EXP_FORMAT % (season[0], season[1], game_type)
        return BASE_URL + sum_str + cayenne_str

    @staticmethod
    def fetchJSON(URL):
        """Fetch stats from URL and return JSON"""

        fd = urllib.urlopen(URL)
        ret = fd.read()
        return json.loads(ret)
