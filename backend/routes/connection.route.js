import { Router } from "express";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  getAllMyConnectionRequest,
  whatAreMyConnection,
} from "../controllers/connection.controller.js";


const router = Router();

router.route("/connections").post(sendConnectionRequest);
router.route("/connections/sent").get(getAllMyConnectionRequest);
router.route("/connections/received").get(whatAreMyConnection);
router.route("/connections/:connectionId").patch(acceptConnectionRequest);


export default router;