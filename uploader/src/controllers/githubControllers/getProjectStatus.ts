import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { prisma } from "../../config/prisma";
import { ApiResponse } from "../../utils/apiResponse";

export const getProjectStatus = asyncHandler(async (req: Request, res: Response) => {
	const currentUser = req.user;
	if (!currentUser) {
		return res.status(401).json(new ApiError(401, "Login again", []))
	}
	const { projectId } = req.params
	if (!projectId) {
		return res.status(400).json(new ApiError(400, "No project id given", []))
	}
	try {
		const data = req.body;
		if (!data) {
			return res.status(400).json(new ApiError(400, "No request body provided", []))
		}
		const projectInfo = await prisma.projects.findFirst({
			where: {
				id: projectId,
			}
		})
		if (!projectInfo) {
			return res.status(400).json(new ApiError(400, "Project not found", []))
		}
		return res.status(200).json(new ApiResponse(200, "Found the project", { state: projectInfo.state }))
	} catch (err) {
		return res.status(400).json(new ApiError(400, "Issue talking to the database", []))
	}
})
