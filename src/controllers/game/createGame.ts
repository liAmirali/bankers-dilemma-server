import { Request, Response } from "express";
import { v4 as uuid4 } from "uuid";
import { HttpResponse } from "../../http/http-response";

export const createGame = (req: Request, res: Response) => {
  const gameId = uuid4();

  console.log("CREATED GAME ID:", gameId);

  res.send(new HttpResponse("Game was created successfully.", { gameId }));
};
