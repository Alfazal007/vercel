import { configDotenv } from "dotenv";

configDotenv({
	path: ".env"
});

export const envVariables = {
	corsOrigin: process.env.CORSORIGIN as string,
	port: parseInt(process.env.PORT as string),
	accessTokenSecret: process.env.ACCESSSECRET as string,
	accessTokenExpiry: process.env.ACCESSTOKENEXPIRY as string,
	cloudinaryCloudName: process.env.CLOUDINARYCLOUDNAME as string,
	cloudinaryApiKey: process.env.CLOUDINARYAPIKEY as string,
	cloudinaryApiSecret: process.env.CLOUDINARYAPISECRET as string
}
