import './App.css'
import { Button } from './components/ui/button'

export default function App() {
	return (
		<h1 className="text-3xl font-bold underline">
			Hello world!
			<Button variant={"default"}>Click me</Button>
		</h1>
	)
}
