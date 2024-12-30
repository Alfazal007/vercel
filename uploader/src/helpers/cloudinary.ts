import { v2 as cloudinary } from 'cloudinary';
import { envVariables } from '../config/envVariables';
import fs from "fs";
import path from 'path';

cloudinary.config({
	cloud_name: envVariables.cloudinaryCloudName,
	api_key: envVariables.cloudinaryApiKey,
	api_secret: envVariables.cloudinaryApiSecret
});

const uploadToCloudinary = (buffer: Buffer, userId: string, path: string, fileName: string) => {
	return new Promise((resolve, reject) => {
		const index = path.indexOf("output")
		const pathCloudinary = path.substring(index + 7)
		const updatedFolder = pathCloudinary.replace(fileName, "")
		const stream = cloudinary.uploader.upload_stream(
			{
				unique_filename: false,
				overwrite: true,
				resource_type: "raw",
				folder: `/vercel/${userId}/${updatedFolder}`,
				public_id: `${fileName}`
			},
			(error, result) => {
				if (error) reject(error);
				else resolve(result);
			}
		);
		stream.end(buffer);
	});
};

export async function createCloudinaryData(userId: string, projectId: string): Promise<boolean> {
	const targetFolder = path.join(__dirname, `../../output/${projectId}`)
	try {
		const files = await getAllFilePaths(targetFolder)
		const uploads = files.map(async (filePath) => {
			const buffer = await fs.promises.readFile(filePath);
			return uploadToCloudinary(buffer, userId, filePath, path.basename(filePath));
		});
		await Promise.all(uploads);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	} finally {
		try {
			fs.rmSync(targetFolder, { force: true, recursive: true });
		} catch (cleanupError) {
			console.error("Failed to clean up:", cleanupError);
		}
	}
}

async function getAllFilePaths(folderPath: string) {
	const filePaths: string[] = [];
	async function traverse(currentPath: string) {
		const items = await fs.promises.readdir(currentPath, { withFileTypes: true });
		for (const item of items) {
			const fullPath = path.join(currentPath, item.name);
			if (item.isDirectory()) {
				await traverse(fullPath);
			} else if (item.isFile()) {
				filePaths.push(fullPath);
			}
		}
	}
	await traverse(folderPath);
	return filePaths;
}

