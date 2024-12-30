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
		const res = await cloudinary.search
			.expression(`folder:vercel11/${userId}/${projectId}/* AND resource_type:raw`)
			.max_results(500)
			.execute();

		res.resources.forEach((object: any) => {
			publicIds.push(object.public_id)
			filesOnCloudinary.push(object.folder)
		});
		const downloadPromises = publicIds.map((publicId: string) => downloadFile(publicId, userId, projectId));
		await Promise.all(downloadPromises);
		return true
	} catch (error) {
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

// upload dist folder to cloudinary
const uploadToCloudinary = (buffer: Buffer, userId: string, path: string, fileName: string, projectId: string) => {
	return new Promise((resolve, reject) => {
		const index = path.indexOf("vercel11/dist")
		const pathCloudinary = path.substring(index + 14)
		const updatedFolder = pathCloudinary.replace(fileName, "")
		const stream = cloudinary.uploader.upload_stream(
			{
				unique_filename: false,
				overwrite: true,
				resource_type: "raw",
				folder: `/vercel11/${userId}/dist/${projectId}/${updatedFolder}`,
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
	const targetFolder = path.join(__dirname, `../output/vercel11/`)
	try {
		const files = await getAllFilePaths(targetFolder + "dist/")
		const uploads = files.map(async (filePath) => {
			const buffer = await fs.promises.readFile(filePath);
			return uploadToCloudinary(buffer, userId, filePath, path.basename(filePath), projectId);
		});
		await Promise.all(uploads);
		return true;
	} catch (error) {
		console.error(error);
		return false;
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
