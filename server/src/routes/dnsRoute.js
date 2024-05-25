import express from "express";
import {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../controllers/dnsControllers.js";

const router = express.Router();

router.get("/list-records", getRecords);
router.post("/create-record", createRecord); 
router.put("/update-record/:recordId", updateRecord); 
router.delete("/delete-record/:recordId", deleteRecord); 

export default router;