class DBConfig:
    USER = 'root'
    PASSWORD = 'root'
    HOST = 'localhost'

    DRAFTS_CREATE = 'SQL/drafts.sql'
    TEAMS_CREATE = 'SQL/teams.sql'
    PLAYERS_CREATE = 'SQL/players.sql'
    GOALIES_CREATE = 'SQL/goalies.sql'

    DB_FORMAT = 'hockey_pool_{}'
    TEAMS_TABLE = 'teams'
    PLAYERS_TABLE = 'players'
    GOALIES_TABLE = 'goalies'

class DraftConfig:
    MAX_TEAM_NAME_LENGTH = 255
    NAME_AVAILABLE_RESPONSE = 'available'
    NAME_TAKEN_RESPONSE = 'taken'
