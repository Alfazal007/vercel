import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { ApiResponse } from "../../utils/apiResponse"
import z from "zod"
import { ApiError } from "../../utils/apiError"
import { prisma } from "../../config/prisma"
import { verifyPassword } from "../../helpers/hashPassword"
import { generateToken } from "../../helpers/tokenHandler"

const createUserTypes = z.object({
	username: z.string({ message: "Username not provided" }).trim().min(6, "Minimum length of username should be 6").max(20, "Maximum length of username should be 20"),
	password: z.string({ message: "Password not provided" }).trim().min(6, "Minimum length of password should be 6").max(20, "Maximum length of password should be 20"),
})

export const signinController = asyncHandler(async (req: Request, res: Response) => {
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
		if (!isExistingUser) {
			return res.status(404).json(new ApiError(404, "User not found", []))
		}
		const isPasswordValid = await verifyPassword(parsedData.data.password, isExistingUser.password)
		if (!isPasswordValid) {
			return res.status(400).json(new ApiError(400, "Invalid password", []))
		}

		const accessToken = generateToken(isExistingUser.username, isExistingUser.id)
		return res
			.status(200)
			.cookie("accessToken", accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: false,
			})
			.json(new ApiResponse(200, "Successfully signed in", { username: isExistingUser.username, id: isExistingUser.id, accessToken: accessToken }))
	} catch (err) {
		return res.status(400).json(new ApiError(400, "Issue talking to the database", []))
	}
})
