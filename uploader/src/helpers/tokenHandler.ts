import jwt from "jsonwebtoken"
import { envVariables } from "../config/envVariables"
export function generateToken(username: string, id: string): string {
	const token = jwt.sign({ username, id }, envVariables.accessTokenSecret, {
		expiresIn: envVariables.accessTokenExpiry
	})
	return token
}
