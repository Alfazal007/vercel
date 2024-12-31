import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(
	express.json({
		limit: "16kb",
	})
);

app.use(
	express.urlencoded({
		extended: true,
		limit: "16kb",
	})
);

app.use(express.static("public"));
app.use(cookieParser());

import { userRouter } from "./routes/routes.user";
app.use("/api/v1/user", userRouter);

import { githubRouter } from "./routes/routes.github";
app.use("/api/v1/project", githubRouter)

export {
	app
}
