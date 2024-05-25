import express from "express";
import {
  createSessionCookie,
  checkSession,
  sessionLogout,
} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/create-session-cookie", createSessionCookie);
router.get("/check-session", checkSession);
router.post("/logout", sessionLogout);

export default router;