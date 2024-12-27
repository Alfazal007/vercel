import { Router } from "express";
import { createUserController } from "../controllers/userControllers/controller.user.create";
import { signinController } from "../controllers/userControllers/controller.user.signin";
import { currentUserController } from "../controllers/userControllers/controller.user.currentUser";
import { authMiddleware } from "../middlewares/authmiddleware";

const userRouter = Router()

userRouter.route("/create").post(createUserController)
userRouter.route("/login").post(signinController)
userRouter.route("/current-user").get(authMiddleware, currentUserController)

export {
	userRouter
}
