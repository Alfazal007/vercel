import { createClient } from "redis";
import { fetchAllFiles } from "./cloudinary";

const client = createClient();

async function main() {
	while (true) {
		if (!client.isOpen) {
			await client.connect()
		}
		try {
			const redisData = await client.brPop("projects", 0);
			if (redisData) {
				const jsonData = JSON.parse(redisData.element)
				const userId = jsonData.userId
				const projectId = jsonData.projectId
				if (!userId || !projectId) {
					continue;
				}
				const done = await fetchAllFiles(userId, projectId)
				if (!done) {
					continue;
				}
				// TODO:: build in a containerized fashion
			}
		} catch (err) {
			console.log("here")
			console.log(err)
		}
	}
}

main()
