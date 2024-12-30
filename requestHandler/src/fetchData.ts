import { v2 as cloudinary } from "cloudinary"
import { envVariables } from "./loadEnv"
import axios from "axios"
import { Response } from "express";

cloudinary.config({
	cloud_name: envVariables.cloudinaryCloudName,
	api_key: envVariables.cloudinaryApiKey,
	api_secret: envVariables.cloudinaryApiSecret
});

export async function downloadFile(publicId: string, res: Response) {
	try {
		// Fetch the file from Cloudinary (assuming it's an HTML page or similar content)
		const resource = await cloudinary.api.resource(publicId, { resource_type: "raw" });
		const url = resource.secure_url;
		// Get the file's content type, and ensure it's appropriate for the file type (e.g., HTML, JS)
		let contentType = ""
		if (publicId.endsWith("html")) {
			contentType = 'text/html'
		} else if (publicId.endsWith("css")) {
			contentType = 'text/css'
		} else if (publicId.endsWith("js")) {
			contentType = "application/javascript"
		} else if (publicId.endsWith("json")) {
			contentType = 'application/json';
		} else if (publicId.endsWith("png")) {
			contentType = 'image/png';
		} else if (publicId.endsWith("jpg") || publicId.endsWith("jpeg")) {
			contentType = 'image/jpeg';
		} else if (publicId.endsWith("svg")) {
			contentType = 'image/svg+xml';
		} else {
			contentType = 'application/octet-stream';
		}

		// Stream the file from Cloudinary
		const response = await axios({
			url,
			responseType: 'stream'
		});

		// Set the appropriate headers for the file type
		res.setHeader('Content-Type', contentType);
		res.setHeader('Content-Disposition', 'inline'); // This ensures it is shown in the browser, not downloaded

		// Pipe the stream directly to the HTTP response
		response.data.pipe(res);
	} catch (error) {
		console.error('Error fetching file:', error);
		res.status(500).send('Error fetching file');
	}
}

