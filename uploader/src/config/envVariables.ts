import { configDotenv } from "dotenv";

configDotenv({
	path: ".env"
});

export const envVariables = {
	corsOrigin: process.env.CORSORIGIN as string,
	port: parseInt(process.env.PORT as string),
	accessTokenSecret: process.env.ACCESSSECRET as string,
	accessTokenExpiry: process.env.ACCESSTOKENEXPIRY as string,
	cloudProjectId: process.env.CLOUDPROJECTID as string,
	cloudProjectSecretKey: process.env.CLOUDPROJECTKEY as string,
	cloudBucketId: process.env.CLOUDBUCKETID as string
}
