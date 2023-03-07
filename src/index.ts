import { v4 as uuidv4 } from "uuid";

export interface Team {
  title: string;
  score: number;
}

export interface Game {
  id: string;
  createDate: number;
  teamA: Team;
  teamB: Team;
}

export enum addGameResultCode {
  GAME_ADDED = 1,
  ERROR_TEAM_A_ALREADY_EXISTS = -1,
  ERROR_TEAM_B_ALREADY_EXISTS = -2,
}

export interface addGameResult {
  id?: string;
  resultCode: addGameResultCode;
}

export enum updateScoreResult {
  SCORE_UPDATED = 1,
  ERROR_SCORE_TEAM_A_LESS = -1,
  ERROR_SCORE_TEAM_B_LESS = -2,
  ERROR_GAME_ID_NOT_EXISTS = -3,
  ERROR_SCORE_IS_TOO_HIGH = -4,
}

export enum removeGameResult {
  GAME_REMOVED = 1,
  ERROR_GAME_ID_NOT_EXISTS = -1,
}

const Games: Game[] = [];
const maxScore = 100;

export function cleanGames(): boolean {
  Games.length = 0;
  return true;
}

export function addGame(TeamA: string, TeamB: string): addGameResult {
  const teamAExists = Games.findIndex(
    (game) => game.teamA.title === TeamA || game.teamB.title === TeamA
  );
  if (teamAExists !== -1) {
    return { resultCode: addGameResultCode.ERROR_TEAM_A_ALREADY_EXISTS };
  }

  const teamBExists = Games.findIndex(
    (game) => game.teamA.title === TeamB || game.teamB.title === TeamB
  );
  if (teamBExists !== -1) {
    return { resultCode: addGameResultCode.ERROR_TEAM_B_ALREADY_EXISTS };
  }

  const id = uuidv4();

  const game: Game = {
    id,
    createDate: Date.now(),
    teamA: { title: TeamA, score: 0 },
    teamB: { title: TeamB, score: 0 },
  };

  Games.push(game);
  return { id, resultCode: addGameResultCode.GAME_ADDED };
}

export function updateScore(
  id: string,
  TeamAScore: number,
  TeamBScore: number
): updateScoreResult {
  if (TeamAScore > maxScore || TeamBScore > maxScore) {
    return updateScoreResult.ERROR_SCORE_IS_TOO_HIGH;
  }

  const gameIndex = Games.findIndex((game) => game.id === id);
  if (gameIndex === -1) {
    return updateScoreResult.ERROR_GAME_ID_NOT_EXISTS;
  }

  if (Games[gameIndex].teamA.score > TeamAScore) {
    return updateScoreResult.ERROR_SCORE_TEAM_A_LESS;
  }

  if (Games[gameIndex].teamB.score > TeamBScore) {
    return updateScoreResult.ERROR_SCORE_TEAM_B_LESS;
  }

  Games.forEach((game) => {
    if (game.id === id) {
      game.teamA.score = TeamAScore;
      game.teamB.score = TeamBScore;
    }
  });
  return updateScoreResult.SCORE_UPDATED;
}

export function removeGame(id: string): removeGameResult {
  const gameIndex = Games.findIndex((game) => game.id === id);
  if (gameIndex === -1) {
    return removeGameResult.ERROR_GAME_ID_NOT_EXISTS;
  }

  Games.splice(gameIndex, 1);
  return removeGameResult.GAME_REMOVED;
}

export function listingGames(): Game[] {
  const games = Games.sort((first, second) => {
    const firstTotalScore = first.teamA.score + first.teamB.score;
    const secondTotalScore = second.teamA.score + second.teamB.score;

    if (firstTotalScore === secondTotalScore) {
      return second.createDate - first.createDate;
    } else {
      return secondTotalScore - firstTotalScore;
    }
  });

  return games;
}
