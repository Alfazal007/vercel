import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { ApiResponse } from "../../utils/apiResponse"
import z from "zod"
import { ApiError } from "../../utils/apiError"
import { prisma } from "../../config/prisma"
import { hashPassword } from "../../helpers/hashPassword"

const createUserTypes = z.object({
	username: z.string({ message: "Username not provided" }).trim().min(6, "Minimum length of username should be 6").max(20, "Maximum length of username should be 20"),
	password: z.string({ message: "Password not provided" }).trim().min(6, "Minimum length of password should be 6").max(20, "Maximum length of password should be 20"),
})

export const createUserController = asyncHandler(async (req: Request, res: Response) => {
	const data = req.body
	if (!data) {
		return res.status(400).json(new ApiError(400, "No request body provided", []))
	}

	const parsedData = createUserTypes.safeParse(data)
	if (!parsedData.success) {
		const zodErrors: string[] = []
		parsedData.error.errors.map((err) => {
			zodErrors.push(err.message)
		})
		return res.status(400).json(new ApiError(400, "Zod errors", [], zodErrors))
	}
	try {
		const isExistingUser = await prisma.user.findFirst({
			where: {
				username: parsedData.data.username
			}
		})
		if (isExistingUser) {
			return res.status(400).json(new ApiError(400, "Use different username", []))
		}

		const hashedPassword = await hashPassword(parsedData.data.password)

		const newUser = await prisma.user.create({
			data: {
				username: parsedData.data.username,
				password: hashedPassword
			},
			select: {
				username: true,
				id: true
			}
		})
		return res.status(201).json(new ApiResponse(201, "Successfully created new user", newUser))
	} catch (err) {
		return res.status(400).json(new ApiError(400, "Issue talking to the database", []))
	}
})
