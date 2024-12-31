import { useContext, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { UserContext } from '@/context/UserContext'
import { useToast } from '@/hooks/use-toast'
import axios from "axios"

export default function Landing() {
	const [githubUrl, setGithubUrl] = useState('')
	const [isDeploying, setIsDeploying] = useState(false)
	const [done, setCheckDone] = useState(true)
	const [projectId, setProjectId] = useState("")
	const navigate = useNavigate()
	const { user } = useContext(UserContext)
	const { toast } = useToast()

	useEffect(() => {
		if (!user) {
			navigate("/signin")
			return
		}
	}, [])

	async function getStatus() {
		const statusInfo = await axios.get(`http://localhost:8000/api/v1/project/get-project/${projectId}`, {
			withCredentials: true
		})
		if (statusInfo.status != 200) {
			setCheckDone(true)
			setIsDeploying(false)
			setProjectId("")
			toast({
				title: "issue talking to the database"
			})
		} else {
			toast({
				title: `PROJECT ${statusInfo.data.data.state}`,
				description: `Project id ${projectId}`
			})
			if ("DEPLOYED" == statusInfo.data.data.state || statusInfo.data.data.state == "ERROR") {
				setCheckDone(true)
				setIsDeploying(false)
				let newUrl = "http://" + projectId + ".localhost:3001/index.html"
				window.location.href = newUrl;
			}
		}
	}

	useEffect(() => {
		let interval
		if (!done && projectId) {
			interval = setInterval(getStatus, 10000)
		} else {
			clearInterval(interval)
		}
	}, [done, projectId])

	const handleDeploy = async () => {
		setIsDeploying(true)
		setCheckDone(false)
		try {
			const projectResponse = await axios.post(`http://localhost:8000/api/v1/project/create-project`,
				{
					"url": githubUrl
				},
				{ withCredentials: true })
			if (projectResponse.status != 200) {
				setCheckDone(true)
				return
			}
			setProjectId(projectResponse.data.data.projectId)
		} catch (err) {
			setIsDeploying(false)
			setCheckDone(true)
			toast({ title: "Issue deploying the project" })
		}
	}

	return (
		<div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
			<div className="md:border-2 border-gray-700 p-8 bg-gray-800 rounded-lg shadow-xl">
				<h1 className="font-bold text-2xl pb-4 text-center text-white">Deploy Your GitHub Project</h1>
				<div className="space-y-4">
					<div className="w-60 md:w-96">
						<Input
							type="text"
							placeholder="Enter GitHub URL"
							value={githubUrl}
							onChange={(e) => setGithubUrl(e.target.value)}
							className="h-12 md:text-xl bg-gray-700 border-gray-600 text-white placeholder-gray-400"
						/>
					</div>
					<Button
						onClick={handleDeploy}
						disabled={isDeploying || !githubUrl}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 md:text-xl"
					>
						{isDeploying ? 'Deploying...' : 'Deploy'}
					</Button>
				</div>
			</div>
		</div>
	)
}

