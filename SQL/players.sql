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
    shots INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (playerTeamsPlayedFor) REFERENCES teams(teamAbbrev)
);
