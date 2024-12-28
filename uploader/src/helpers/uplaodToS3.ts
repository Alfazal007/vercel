import sdk, { Storage } from "node-appwrite"
import { envVariables } from "../config/envVariables";



const client = new sdk.Client();

client
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject(envVariables.cloudProjectId)
	.setKey(envVariables.cloudProjectSecretKey);
/*
async function uploadToCloud() {
	const storage = new Storage(client);

	await storage.createFile(envVariables.cloudProjectId)

	const promise = storage.createFile(
		'[BUCKET_ID]',
		ID.unique(),
		document.getElementById('uploader').files[0]
	);

	promise.then(function (response) {
		console.log(response); // Success
	}, function (error) {
		console.log(error); // Failure
	});

}*/
