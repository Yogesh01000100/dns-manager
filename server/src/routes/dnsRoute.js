import express from "express";
import {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../controllers/dnsControllers.js";
import { verifySession } from "../middlewares/auth.js";
import { validate } from "../middlewares/validationMiddleware.js";
import {
  recordSchema,
  updateRecordSchema,
  deleteRecordSchema,
} from "../validators/validation.js";

const router = express.Router();

router.get("/list-records", getRecords);
router.post("/create-record", validate(recordSchema), createRecord);
router.put(
  "/update-record",
  validate(updateRecordSchema),
  verifySession,
  updateRecord
);
router.delete("/delete-record", validate(deleteRecordSchema), deleteRecord);

export default router;
