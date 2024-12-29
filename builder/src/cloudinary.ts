import { v2 as cloudinary } from 'cloudinary';
import { envVariables } from './envVariables';
import axios from "axios";
import path from "path"
import fs from "fs"

cloudinary.config({
	cloud_name: envVariables.cloudinaryCloudName,
	api_key: envVariables.cloudinaryApiKey,
	api_secret: envVariables.cloudinaryApiSecret
});

export async function fetchAllFiles(userId: string, projectId: string) {
	try {
		const filesOnCloudinary: string[] = []
		const publicIds: string[] = []
		const res = await cloudinary.search.expression(
			`folder:vercel4/${userId}/${projectId}/*`
		).max_results(500).execute();
		res.resources.forEach((object: any) => {
			publicIds.push(object.public_id)
			filesOnCloudinary.push(object.folder)
		});
		const downloadPromises = publicIds.map((publicId: string) => downloadFile(publicId, userId, projectId));
		await Promise.all(downloadPromises);
		return true
	} catch (error) {
		try {
			const targetFolder = path.join(__dirname, `../output/`)
			fs.rmSync(targetFolder, { force: true, recursive: true });
		} catch (cleanupError) {
			console.error("Failed to clean up:", cleanupError);
		}
		console.error('Error fetching files:', error);
		return false
	}
}

export async function downloadFile(publicId: string, userId: string, projectId: string) {
	try {
		const resource = await cloudinary.api.resource(publicId, { resource_type: "raw" });
		const url = resource.secure_url;

		const response = await axios({
			url,
			responseType: 'stream'
		});
		const writePathPrepend = publicId.replace(`${userId}/${projectId}`, "")
		const filePath = path.join(__dirname, `../output/${writePathPrepend}`);
		const dirPath = path.dirname(filePath);

		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
		const writer = fs.createWriteStream(filePath);

		response.data.pipe(writer);

		writer.on('error', (err) => {
			console.error('Error writing file', err);
		});
	} catch (error) {
		console.error('Error fetching file:', error);
	}
}

