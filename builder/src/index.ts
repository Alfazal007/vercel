import { createClient } from "redis";
import { createCloudinaryData, fetchAllFiles } from "./cloudinary";
import { runCommands } from "./runBuildCommands";
import fs from "fs"
import path from "path"
import { prisma } from "./prisma";

const client = createClient();

async function main() {
	while (true) {
		if (!client.isOpen) {
			await client.connect()
		}
		let projectIdForErrorCase;
		try {
			const redisData = await client.brPop("projects", 0);
			if (redisData) {
				const jsonData = JSON.parse(redisData.element)
				const userId = jsonData.userId
				const projectId = jsonData.projectId
				if (!userId || !projectId) {
					continue;
				}
				projectIdForErrorCase = projectId;
				// the delay is because cloudinary is slow and queue worker may receive incomplete data
				await new Promise(resolve => setTimeout(resolve, 5000));
				const done = await fetchAllFiles(userId, projectId)
				if (!done) {
					await updateStatus(false, projectId)
					continue;
				}
				const commandOutputs = await runCommands()
				console.log({ commandOutputs })
				const uploadedDistToCloudinary = await createCloudinaryData(userId, projectId)
				if (!uploadedDistToCloudinary) {
					await updateStatus(false, projectId)
					continue;
				}
				await updateStatus(true, projectId)
			}
		} catch (err) {
			console.log(err)
			await updateStatus(false, projectIdForErrorCase)
		} finally {
			try {
				const targetFolder = path.join(__dirname, "../output/")
				fs.rmSync(targetFolder, { force: true, recursive: true });
			} catch (cleanupError) {
				console.error("Failed to clean up:", cleanupError);
			}
		}
	}
}

async function updateStatus(done: boolean, projectId: string) {
	try {
		if (done == false) {
			await prisma.projects.update({
				where: {
					id: projectId
				},
				data: {
					state: "ERROR"
				}
			})
		} else {
			await prisma.projects.update({
				where: {
					id: projectId
				},
				data: {
					state: "DEPLOYED"
				}
			})
		}
	} catch (err) {
		console.log("Issue talking to the database")
	}
}

main()
