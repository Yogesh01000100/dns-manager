import express from "express";
import {
  listHostedZones,
  createDomain,
  deleteDomain,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/hosted-zones", listHostedZones);
router.post("/create-domain", createDomain);
router.delete("/delete-hosted-zone", deleteDomain)

export default router;