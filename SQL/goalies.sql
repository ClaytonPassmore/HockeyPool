CREATE TABLE IF NOT EXISTS goalies
(
    id INTEGER NOT NULL PRIMARY KEY,

    -- Player Logistics
    seasonId INTEGER NOT NULL DEFAULT 0,
    playerTeamsPlayedFor VARCHAR(255) NOT NULL,
    playerName VARCHAR(255) NOT NULL,
    playerFirstName VARCHAR(255),
    playerLastName VARCHAR(255),
    playerPositionCode VARCHAR(255),

    -- Points/Wins/Losses
    goals INTEGER NOT NULL DEFAULT 0,
    assists INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    ties INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    otLosses INTEGER NOT NULL DEFAULT 0,

    -- Stats
    gamesStarted INTEGER NOT NULL DEFAULT 0,
    gamesPlayed INTEGER NOT NULL DEFAULT 0,
    timeOnIce INTEGER NOT NULL DEFAULT 0,
    penaltyMinutes INTEGER NOT NULL DEFAULT 0,
    shotsAgainst INTEGER NOT NULL DEFAULT 0,
    savePctg FLOAT NOT NULL DEFAULT 0,
    saves INTEGER NOT NULL DEFAULT 0,
    shutouts INTEGER NOT NULL DEFAULT 0,
    goalsAgainstAverage FLOAT NOT NULL DEFAULT 0,
    goalsAgainst INTEGER NOT NULL DEFAULT 0
);
