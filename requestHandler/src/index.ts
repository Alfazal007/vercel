import express, { Request, Response } from "express"
import { downloadFile } from "./fetchData"

const app = express()

app.get("/*", (req: Request, res: Response) => {
	const projectId = req.hostname.split(".")[0]
	const requiredFilePath = req.path
	const publicId = `vercel/dist/${projectId}/${requiredFilePath}`
	downloadFile(publicId, res)
})

app.listen(3001, () => {
	console.log("App running on port 3001")
})
