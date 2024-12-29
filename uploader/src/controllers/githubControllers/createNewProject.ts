import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import z from "zod";
import { cloneProject } from "../../helpers/cloneProject";
import { prisma } from "../../config/prisma";
import { ApiResponse } from "../../utils/apiResponse";
import { uploadToCloud } from "../../helpers/uploadToCloud";

const createProjectType = z.object({
	url: z.string({ message: "Github url not provided" }),
})

export const createNewClone = asyncHandler(async (req: Request, res: Response) => {
	// check auth
	const currentUser = req.user;
	if (!currentUser) {
		return res.status(401).json(new ApiError(401, "Login again", []))
	}

	// check req body
	const data = req.body
	console.log({ data })
	if (!data) {
		return res.status(400).json(new ApiError(400, "No request body provided", []))
	}
	const parsedData = createProjectType.safeParse(req.body)
	if (!parsedData.success) {
		const zodErrors: string[] = []
		parsedData.error.errors.forEach((err) => {
			zodErrors.push(err.message)
		});
		return res.status(400).json(new ApiError(400, "Zod errors", [], zodErrors))
	}

	// handle url
	try {
		const newProject = await prisma.projects.create({
			data: {
				githubUrl: parsedData.data.url,
				state: "UPLOADING",
			}
		})
		const resCloneProject = await cloneProject(parsedData.data.url, newProject.id)
		if (!resCloneProject) {
			return res.status(400).json(new ApiError(400, "Issue deploying the project, try again later", []))
		}
		//		const uploadToCloudRes = await uploadToCloud(newProject.id);

		// TODO: Complete this logic

		return res.status(200).json(new ApiResponse(200, "Done", []))
	} catch (err) {
		console.log({ err })
		return res.status(400).json(new ApiError(400, "Issue talking to the database", []))
	}
});
