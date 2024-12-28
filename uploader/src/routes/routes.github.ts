import { Router } from "express";
import { authMiddleware } from "../middlewares/authmiddleware";
import { createNewClone } from "../controllers/githubControllers/createNewProject";

const githubRouter = Router()

githubRouter.route("/create-project").post(authMiddleware, createNewClone)

export {
	githubRouter
}
