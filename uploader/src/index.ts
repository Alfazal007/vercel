import { app } from "./app";
import { envVariables } from "./config/envVariables";

app.listen(8000, () => {
	console.log(`App listening on port ${envVariables.port}`)
});
