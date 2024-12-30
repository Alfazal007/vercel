import { exec } from "child_process"
import path from "path"

export function runCommands() {
	return new Promise((resolve, reject) => {
		const pathToFolder = path.join(__dirname, "../output/vercel11/")
		const command = `cd ${pathToFolder} && npm install && npm run build`;

		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error: ${error.message}`);
				reject(`Failed: ${stderr || error.message}`);
				return;
			}
			if (stderr) {
				console.error(`Stderr: ${stderr}`);
				reject(`Failed: ${stderr}`);
				return;
			}
			console.log(`Success: ${stdout}`);
			resolve('Success');
		});
	});
}

