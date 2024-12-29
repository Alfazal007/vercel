import path from "path"
import fs from "fs"

export async function uploadToCloud(projectId: string): Promise<boolean> {
	const currentFolderPath = path.join(__dirname, `../../output/${projectId}`)
	return false
}

