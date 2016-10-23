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


def fetch_summary(season, summary_type, game_type):
    if (not isinstance(season, (tuple, list)) or not isinstance(season[0], int) or
            not isinstance(season[1], int) or season[0] != (season[1] - 1)):
        raise ValueError('Invalid season')

    if summary_type not in ('team', 'player', 'goalie'):
        raise ValueError('Invalid summary type')

    if game_type not in (REGULAR_SEASON_ID, PLAYOFFS_ID):
        raise ValueError('Invalid game type')

    sum_str = None
    if(summary_type == 'team'):
        sum_str = TEAM_STATS
    elif(summary_type == 'player'):
        sum_str = PLAYER_STATS
    elif(summary_type == 'goalie'):
        sum_str = GOALIE_STATS

    cayenne_str = CAYENNE_EXP_FORMAT % (season[0], season[1], game_type)
    fd = urllib.urlopen(BASE_URL + sum_str + cayenne_str)
    return json.loads(fd.read())
