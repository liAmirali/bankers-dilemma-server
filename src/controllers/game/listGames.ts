import { Request, Response } from "express";

import { postgres } from "../../db";
import { HttpResponse } from "../../http/http-response";

export const listGames = async (req: Request, res: Response) => {
  let queryResult;
  let games: GameT[] = [];
  try {
    queryResult = await postgres.query("SELECT * FROM games;");

    if (queryResult?.rows) {
      games = queryResult.rows;
    }
  } catch (error) {
    return res.send(new HttpResponse("Couldn't run query.", error, 422));
  }

  return res.send(new HttpResponse("List fetched successfully.", { games: games }, 200));
};
