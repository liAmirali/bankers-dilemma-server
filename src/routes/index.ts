import express from "express";

import { default as authRouter } from "./auth";
import { default as gameRouter } from "./game";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/game", gameRouter);

export default router;
