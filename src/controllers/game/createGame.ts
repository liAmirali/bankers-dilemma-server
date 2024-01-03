import { Request, Response, query } from "express";

import { HttpResponse } from "../../http/http-response";
import { postgres } from "../../db";

export const createGame = async (req: Request, res: Response) => {
  let queryRes;
  let gameId;

  if (!req.body.name) {
    return res.send(new HttpResponse("No name is specified for the game.", null, 422));
  }

  try {
    queryRes = await postgres.query(
      `INSERT INTO games (name) VALUES ('${req.body.name}') RETURNING game_id;`
    );

    if (queryRes && queryRes.rowCount && queryRes.rowCount > 0) {
      gameId = queryRes.rows[0].game_id;
    }

    console.log("gameId", gameId);
  } catch (error) {
    return res.send(new HttpResponse("Couldn't run query.", error, 422));
  }

  return res.send(new HttpResponse("Game was created successfully.", { gameId: gameId }));
};
