import { configDotenv } from "dotenv";

configDotenv({
	path: ".env"
});

export const envVariables = {
	cloudinaryCloudName: process.env.CLOUDINARYCLOUDNAME as string,
	cloudinaryApiKey: process.env.CLOUDINARYAPIKEY as string,
	cloudinaryApiSecret: process.env.CLOUDINARYAPISECRET as string
}
