import { Router } from "express";
const authrouter=Router();
import * as authcontroller from "../controller/authcontroller.js"
authrouter.post("/register",authcontroller.register)
authrouter.get("/get-me",authcontroller.getme)
export default authrouter;
