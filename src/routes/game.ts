import express from "express";
import { createGame } from "../controllers/game/createGame";

const router = express.Router();

router.route("/").post(createGame);

export default router;
