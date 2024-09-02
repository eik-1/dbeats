import express from "express";
import {
  getUser,
  createUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:walletAddress", getUser);
router.post("/create", createUser);
router.put("/:walletAddress", updateUser);

export default router;
