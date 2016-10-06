DROP DATABASE IF EXISTS HockeyPool;
CREATE DATABASE IF NOT EXISTS HockeyPool;
USE HockeyPool;

CREATE TABLE IF NOT EXISTS teams
(
    id INTEGER NOT NULL PRIMARY KEY,

    -- Team Logistics
    teamFullName VARCHAR(255) NOT NULL,
    teamAbbrev VARCHAR(255) NOT NULL,
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

CREATE TABLE IF NOT EXISTS players
(
    id INTEGER NOT NULL PRIMARY KEY,

    -- Player Logistics
    seasonId INTEGER NOT NULL DEFAULT 0,
    playerTeamsPlayedFor VARCHAR(255) NOT NULL,
    playerName VARCHAR(255) NOT NULL,
    playerFirstName VARCHAR(255),
    playerLastName VARCHAR(255),
    playerPositionCode VARCHAR(255),

    -- Points and Goals
    points INTEGER NOT NULL DEFAULT 0,
    goals INTEGER NOT NULL DEFAULT 0,
    assists INTEGER NOT NULL DEFAULT 0,
    ppGoals INTEGER NOT NULL DEFAULT 0,
    shGoals INTEGER NOT NULL DEFAULT 0,
    gameWinningGoals INTEGER NOT NULL DEFAULT 0,
    otGoals INTEGER NOT NULL DEFAULT 0,
    shPoints INTEGER NOT NULL DEFAULT 0,
    ppPoints INTEGER NOT NULL DEFAULT 0,
    plusMinus INTEGER NOT NULL DEFAULT 0,

    -- Stats
    timeOnIcePerGame FLOAT NOT NULL DEFAULT 0,
    shiftsPerGame FLOAT NOT NULL DEFAULT 0,
    pointsPerGame FLOAT NOT NULL DEFAULT 0,
    faceOffWinPctg FLOAT NOT NULL DEFAULT 0,
    shootingPctg FLOAT NOT NULL DEFAULT 0,
    penaltyMinutes INTEGER NOT NULL DEFAULT 0,
    gamesPlayed INTEGER NOT NULL DEFAULT 0,
    shots INTEGER NOT NULL DEFAULT 0
);

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
