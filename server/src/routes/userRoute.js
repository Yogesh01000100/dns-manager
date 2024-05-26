import express from "express";
import {
  listHostedZones,
  createDomain,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/hosted-zones", listHostedZones);  // #
router.post("/create-domain", createDomain);

export default router;