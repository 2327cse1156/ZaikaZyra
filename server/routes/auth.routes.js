import express from "express";
const authRouter = express.Router();
import { signUp,signIn,signOut } from "../controllers/auth.controller.js";
authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);

export default authRouter;
