import { Router } from "express";
import { authMiddleware } from "../middlewares/authmiddleware";
import { createNewClone } from "../controllers/githubControllers/createNewProject";
import { getProjectStatus } from "../controllers/githubControllers/getProjectStatus";

const githubRouter = Router()

githubRouter.route("/create-project").post(authMiddleware, createNewClone)
githubRouter.route("/get-project/:projectId").get(authMiddleware, getProjectStatus)

export {
	githubRouter
}
