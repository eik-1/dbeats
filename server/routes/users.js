import express from "express";
import {
  getUser,
  createUser,
  updateUser,
  getUsersByName,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:walletAddress", getUser);
router.post("/create", createUser);
router.put("/:walletAddress", updateUser);
router.get("/search/:name", getUsersByName);

export default router;
