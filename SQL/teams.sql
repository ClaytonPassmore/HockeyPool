CREATE TABLE IF NOT EXISTS teams
(
    id INTEGER NOT NULL PRIMARY KEY,

    -- Team Logistics
    teamFullName VARCHAR(255) NOT NULL UNIQUE,
    teamAbbrev VARCHAR(255) NOT NULL UNIQUE,
    seasonId INTEGER NOT NULL DEFAULT 0,

    -- Wins/Losses, etc.
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    ties INTEGER NOT NULL DEFAULT 0,
    regPlusOtWins INTEGER NOT NULL DEFAULT 0,
    otLosses INTEGER NOT NULL DEFAULT 0,
    gamesPlayed INTEGER NOT NULL DEFAULT 0,

    -- Points
    goalsFor INTEGER NOT NULL DEFAULT 0,
    goalsAgainst INTEGER NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0,

    -- Stats
    ppPctg FLOAT NOT NULL DEFAULT 0,
    pointPctg FLOAT NOT NULL DEFAULT 0,
    goalsAgainstPerGame FLOAT NOT NULL DEFAULT 0,
    faceOffWinPctg FLOAT NOT NULL DEFAULT 0,
    pkPctg FLOAT NOT NULL DEFAULT 0,
    shotsAgainstPerGame FLOAT NOT NULL DEFAULT 0,
    goalsForPerGame FLOAT NOT NULL DEFAULT 0,
    shotsForPerGame FLOAT NOT NULL DEFAULT 0
);
