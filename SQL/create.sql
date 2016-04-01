CREATE DATABASE HockeyPool;
-- Switch to the newly created database
USE HockeyPool;

CREATE TABLE teams
(
    -- Team Logistics
    teamId INTEGER NOT NULL,
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

    PRIMARY KEY (teamId)
);

CREATE TABLE players
(
    -- Player Logistics
    playerId INTEGER NOT NULL,
    seasonId INTEGER NOT NULL,
    playerFirstName VARCHAR(255) NOT NULL,
    playerLastName VARCHAR(255) NOT NULL,
    playerName VARCHAR(255) NOT NULL,
    playerPositionCode VARCHAR(255) NOT NULL,
    playerTeamsPlayedFor VARCHAR(255) NOT NULL,
    -- Points and Goals
    points INTEGER NOT NULL,
    goals INTEGER NOT NULL,
    assists INTEGER NOT NULL,
    ppGoals INTEGER NOT NULL,
    shGoals INTEGER NOT NULL,
    gameWinningGoals INTEGER NOT NULL,
    otGoals INTEGER NOT NULL,
    shPoints INTEGER NOT NULL,
    ppPoints INTEGER NOT NULL,
    plusMinus INTEGER NOT NULL,
    -- Stats
    timeOnIcePerGame FLOAT NOT NULL,
    shiftsPerGame FLOAT NOT NULL,
    pointsPerGame FLOAT NOT NULL,
    faceOffWinPctg FLOAT NOT NULL,
    shootingPctg FLOAT NOT NULL,
    penaltyMinutes INTEGER NOT NULL,
    gamesPlayed INTEGER NOT NULL,
    shots INTEGER NOT NULL,

    PRIMARY KEY (playerId)
);
