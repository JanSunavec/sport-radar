import {
  addGame,
  addGameResultCode,
  cleanGames,
  listingGames,
  removeGame,
  removeGameResult,
  updateScore,
  updateScoreResult,
} from "../src/index";

async function sleep(ms: number): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

describe("addGame", () => {
  beforeEach(() => {
    cleanGames();
  });

  it("should clean all games", () => {
    addGame("asd", "qwe");
    const games = listingGames();
    expect(games.length).toBe(1);
    cleanGames();
    const games1 = listingGames();
    expect(games1.length).toBe(0);
  });

  it("should return GAME_ADDED when add game", () => {
    const res1 = addGame("asd", "qwe");
    expect(res1.resultCode).toBe(addGameResultCode.GAME_ADDED);
    const games = listingGames();
    expect(games.length).toBe(1);
  });

  it("should return ERROR_TEAM_A_ALREADY_EXISTS when same team name present as param teamA", () => {
    addGame("asd", "qwe");
    const res2 = addGame("asd", "rty");
    expect(res2.resultCode).toBe(addGameResultCode.ERROR_TEAM_A_ALREADY_EXISTS);
    const games = listingGames();
    expect(games.length).toBe(1);
  });

  it("should return ERROR_TEAM_A_ALREADY_EXISTS when same team name present as param teamB", () => {
    addGame("asd", "qwe");
    const res2 = addGame("qwe", "rty");
    expect(res2.resultCode).toBe(addGameResultCode.ERROR_TEAM_A_ALREADY_EXISTS);
    const games = listingGames();
    expect(games.length).toBe(1);
  });

  it("should return ERROR_TEAM_B_ALREADY_EXISTS when same team name present as param teamA", () => {
    addGame("asd", "qwe");
    const res2 = addGame("rty", "asd");
    expect(res2.resultCode).toBe(addGameResultCode.ERROR_TEAM_B_ALREADY_EXISTS);
    const games = listingGames();
    expect(games.length).toBe(1);
  });

  it("should return ERROR_TEAM_B_ALREADY_EXISTS when same team name present as param teamB", () => {
    addGame("asd", "qwe");
    const res2 = addGame("rty", "qwe");
    expect(res2.resultCode).toBe(addGameResultCode.ERROR_TEAM_B_ALREADY_EXISTS);
    const games = listingGames();
    expect(games.length).toBe(1);
  });
});

describe("updateScore", () => {
  beforeEach(() => {
    cleanGames();
  });

  it("should update score properly", () => {
    const res = addGame("asd", "qwe");
    expect(res.id?.length).toBe(36);
    const res1 = updateScore(res.id as string, 1, 2);
    expect(res1).toBe(updateScoreResult.SCORE_UPDATED);
    const games = listingGames();
    expect(games[0].teamA.score).toBe(1);
    expect(games[0].teamB.score).toBe(2);
  });

  it("should failed update score for team A", () => {
    const res = addGame("asd", "qwe");
    updateScore(res.id as string, 3, 1);
    const res1 = updateScore(res.id as string, 2, 1);
    expect(res1).toBe(updateScoreResult.ERROR_SCORE_TEAM_A_LESS);
    const games = listingGames();
    expect(games[0].teamA.score).toBe(3);
    expect(games[0].teamB.score).toBe(1);
  });

  it("should failed update score for team B", () => {
    const res = addGame("asd", "qwe");
    updateScore(res.id as string, 1, 3);
    const res1 = updateScore(res.id as string, 1, 2);
    expect(res1).toBe(updateScoreResult.ERROR_SCORE_TEAM_B_LESS);
    const games = listingGames();
    expect(games[0].teamA.score).toBe(1);
    expect(games[0].teamB.score).toBe(3);
  });

  it("should failed because ID not exists", () => {
    addGame("asd", "qwe");
    const res1 = updateScore("123123", 1, 1);
    expect(res1).toBe(updateScoreResult.ERROR_GAME_ID_NOT_EXISTS);
    const games = listingGames();
    expect(games[0].teamA.score).toBe(0);
    expect(games[0].teamB.score).toBe(0);
  });

  it("should failed because score is too high", () => {
    const game = addGame("asd", "qwe");
    const res1 = updateScore(game.id as string, 99, 1);
    expect(res1).toBe(updateScoreResult.SCORE_UPDATED);
    const games = listingGames();
    expect(games[0].teamA.score).toBe(99);
    expect(games[0].teamB.score).toBe(1);

    const res2 = updateScore(game.id as string, 101, 1);
    expect(res2).toBe(updateScoreResult.ERROR_SCORE_IS_TOO_HIGH);
    const games1 = listingGames();
    expect(games1[0].teamA.score).toBe(99);
    expect(games1[0].teamB.score).toBe(1);

    const res3 = updateScore(game.id as string, 1, 101);
    expect(res3).toBe(updateScoreResult.ERROR_SCORE_IS_TOO_HIGH);
    const games2 = listingGames();
    expect(games2[0].teamA.score).toBe(99);
    expect(games2[0].teamB.score).toBe(1);
  });
});

describe("removeGame", () => {
  beforeEach(() => {
    cleanGames();
  });

  it("should remove game properly", () => {
    const res = addGame("asd", "qwe");
    const res1 = removeGame(res.id as string);
    expect(res1).toBe(removeGameResult.GAME_REMOVED);
    const games = listingGames();
    expect(games.length).toBe(0);
  });

  it("should failed remove because wrong game ID", () => {
    addGame("asd", "qwe");
    const res1 = removeGame("1000");
    expect(res1).toBe(removeGameResult.ERROR_GAME_ID_NOT_EXISTS);
    const games = listingGames();
    expect(games.length).toBe(1);
  });
});

describe("listingGames", () => {
  beforeEach(() => {
    cleanGames();
  });

  it("should list games in correct order by date ORDER DESC", async () => {
    const game1 = addGame("asd", "qwe");
    await sleep(10);
    const game2 = addGame("zxc", "vbn");
    await sleep(10);
    const game3 = addGame("rty", "uio");
    await sleep(10);
    const game4 = addGame("fgh", "jkl");
    const res = listingGames();
    expect(res.length).toBe(4);
    expect(res[0].id).toBe(game4.id);
    expect(res[1].id).toBe(game3.id);
    expect(res[2].id).toBe(game2.id);
    expect(res[3].id).toBe(game1.id);
  });

  it("should list games in correct order by score DESC, date DESC", async () => {
    const game1 = addGame("asd", "qwe");
    await sleep(10);
    const game2 = addGame("zxc", "vbn");
    await sleep(10);
    const game3 = addGame("rty", "uio");
    await sleep(10);
    const game4 = addGame("fgh", "jkl");

    updateScore(game1.id as string, 5, 5);
    updateScore(game2.id as string, 4, 4);
    updateScore(game3.id as string, 3, 3);
    updateScore(game4.id as string, 2, 2);

    const res = listingGames();
    expect(res.length).toBe(4);
    expect(res[0].id).toBe(game1.id);
    expect(res[1].id).toBe(game2.id);
    expect(res[2].id).toBe(game3.id);
    expect(res[3].id).toBe(game4.id);
  });
});
