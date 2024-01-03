import express from "express";
import { createGame } from "../controllers/game/createGame";
import { listGames } from "../controllers/game/listGames";

const router = express.Router();

router.route("/").post(createGame).get(listGames);

export default router;
