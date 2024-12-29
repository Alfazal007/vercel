import { createClient } from "redis";
const client = createClient();

async function main() {
	if (!client.isOpen) {
		await client.connect()
	}
	const res1 = await client.brPop("projects", 0);
	console.log({ res1 })
	console.log(res1.element)
}

main()
