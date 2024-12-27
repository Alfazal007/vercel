import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(12)
	const hashedPassword = await bcrypt.hash(password, salt)
	return hashedPassword
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
	const isValidPassword = await bcrypt.compare(password, hashedPassword)
	return isValidPassword
}
