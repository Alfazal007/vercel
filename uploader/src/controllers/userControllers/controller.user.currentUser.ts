import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";

export const currentUserController = asyncHandler(async (req: Request, res: Response) => {
	const currentUser = req.user;
	if (!currentUser) {
		return res.status(401).json(new ApiError(401, "Login again", []))
	}
	return res.status(200).json(new ApiResponse(200, "", currentUser))
})
