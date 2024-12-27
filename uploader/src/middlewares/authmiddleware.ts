import { envVariables } from "../config/envVariables";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken"

interface User {
	id: string;
	username: string;
}

declare global {
	namespace Express {
		interface Request {
			user: User;
		}
	}
}

export const authMiddleware = asyncHandler(
	async (req, res, next) => {
		const accessToken = req.cookies.accessToken
		if (!accessToken) {
			return res.status(401).json(new ApiError(401, "No access token given", []))
		}
		let userInfo;
		try {
			userInfo = jwt.verify(
				accessToken,
				envVariables.accessTokenSecret
			) as JwtPayload;
		} catch (error) {
			return res.status(403).json(new ApiError(403, "Login again", []));
		}
		if (!userInfo.id || !userInfo.username) {
			return res.status(401).json(new ApiError(401, "Login again", []));
		}
		try {
			const userFromDb = await prisma.user.findFirst({
				where: {
					AND: [
						{

							username: userInfo.username,
						},
						{

							id: userInfo.id
						}
					]
				}
			})
			if (!userFromDb) {
				return res.status(404).json(new ApiError(404, "User not found", []));
			}
			req.user = {
				id: userFromDb.id,
				username: userFromDb.username,
			}
			next();
		} catch (err) {
			return res.status(400).json(new ApiError(400, "Issue talking to the database", []));
		}
	}
)
