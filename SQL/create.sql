CREATE DATABASE HockeyPool;
-- Switch to the newly created database
USE HockeyPool;

CREATE TABLE teams
(
    -- Team Logistics
    teamFullName VARCHAR(255) NOT NULL,
    teamAbbrev VARCHAR(255) NOT NULL,
    seasonId INTEGER NOT NULL,

    -- Wins/Losses, etc.
    wins INTEGER NOT NULL,
    losses INTEGER NOT NULL,
    ties INTEGER NOT NULL,
    regPlusOtWins INTEGER NOT NULL,
    otLosses INTEGER NOT NULL,
    gamesPlayed INTEGER NOT NULL,

    -- Points
    goalsFor INTEGER NOT NULL,
    goalsAgainst INTEGER NOT NULL,
    points INTEGER NOT NULL,

    -- Stats
    ppPctg FLOAT NOT NULL,
    pointPctg FLOAT NOT NULL,
    goalsAgainstPerGame FLOAT NOT NULL,
    faceOffWinPctg FLOAT NOT NULL,
    pkPctg FLOAT NOT NULL,
    shotsAgainstPerGame FLOAT NOT NULL,
    goalsForPerGame FLOAT NOT NULL,
    shotsForPerGame FLOAT NOT NULL,

    PRIMARY KEY (teamFullName)
);

CREATE TABLE players
(
    -- Player Logistics
    seasonId INTEGER NOT NULL DEFAULT 0,
    playerFirstName VARCHAR(255),
    playerLastName VARCHAR(255),
    playerName VARCHAR(255) NOT NULL,
    playerPositionCode VARCHAR(255),
    playerTeamsPlayedFor VARCHAR(255),
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
    shots INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (playerName)
);
