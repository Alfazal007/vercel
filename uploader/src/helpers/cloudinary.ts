import { v2 as cloudinary } from 'cloudinary';
import { envVariables } from '../config/envVariables';
import fs from "fs";

cloudinary.config({
	cloud_name: envVariables.cloudinaryCloudName,
	api_key: envVariables.cloudinaryApiKey,
	api_secret: envVariables.cloudinaryApiSecret
});

const uploadToCloudinary = (buffer: Buffer, userId: string, projectId: string, path: string, fileName: string) => {
	return new Promise((resolve, reject) => {
		const index = path.indexOf("public")
		const pathCloudinary = path.substring(index)
		const updatedFolder = pathCloudinary.replace(fileName, "")
		const stream = cloudinary.uploader.upload_stream(
			{
				unique_filename: false,
				overwrite: true,
				resource_type: "raw",
				folder: `/vercel/${userId}/${projectId}/${updatedFolder}`,
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

export async function createCloudinaryData(userId: string, projectId: string, filePath: string): Promise<boolean> {
	try {
		const buffer = fs.readFileSync(filePath);
		await uploadToCloudinary(buffer, userId, projectId, filePath, "some.txt");
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

