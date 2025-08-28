import { Router } from "express";
import { generate, redirect } from "../controllers/user.controllers.js";

const router = Router()


router.post('/generate', generate)


export default router