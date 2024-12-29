import path from "path"

export async function uploadToCloud(projectId: string): Promise<boolean> {
	const currentFolderPath = path.join(__dirname, `../../output/${projectId}`)
	return false
}
