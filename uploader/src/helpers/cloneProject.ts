import simpleGit from "simple-git"
import { prisma } from "../config/prisma"
import path from "path"

export async function cloneProject(githubUrl: string, projectId: string): Promise<boolean> {
	try {
		await simpleGit().clone(githubUrl, path.join(__dirname, `../../output/${projectId}`))
		return true
	} catch (err) {
		await prisma.projects.update({
			where: {
				id: projectId
			},
			data: {
				state: "ERROR"
			}
		})
		return false
	}
}
