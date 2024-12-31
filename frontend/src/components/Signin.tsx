import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserContext } from "@/context/UserContext";

const loginUserType = z.object({
	username: z.string({ message: "Username not provided" }).trim().min(6, "Minimum length of username should be 6").max(20, "Maximum length of username should be 20"),
	password: z.string({ message: "Password not provided" }).trim().min(6, "Minimum length of password should be 6").max(20, "Maximum length of password should be 20"),
})

export const SignIn = () => {
	const navigate = useNavigate();
	const [isSending, setIsSending] = useState<boolean>(false);
	const { user } = useContext(UserContext)
	useEffect(() => {
		if (user) {
			navigate("/")
		}
	}, [])

	const form = useForm<z.infer<typeof loginUserType>>({
		resolver: zodResolver(loginUserType),
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const { toast } = useToast();

	async function onSubmit(values: z.infer<typeof loginUserType>) {
		try {
			setIsSending(true);
			const res = await axios.post(
				"http://localhost:8000/api/v1/user/login",
				values, {
				withCredentials: true
			}
			);
			console.log(res);
			if (res.status != 200) {
				toast({
					title: "Issue signing in",
					description: `${res.data.message}`,
				});
				return;
			}
			toast({
				title: "Signin successful",
			});
			console.log(res.data)
			setUser({
				accessToken: res.data.data.accessToken as string,
				username: res.data.data.username as string,
				id: res.data.data.id as string
			});
			navigate("/");
		} catch (err: any) {
			toast({
				title: "Issue signing in",
				description: `There was an error signing in ${err.message}`,
				variant: "destructive"
			});
		} finally {
			setIsSending(false);
		}
	}
	const { setUser } = useContext(UserContext)

	return (
		<div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
			<div className="md:border-2 border-gray-700 p-8 bg-gray-800 rounded-lg shadow-xl">
				<h1 className="font-bold text-2xl pb-4 text-center text-white">Sign-in to use Custom gists</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<div className="w-60 md:w-96">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-300">Username</FormLabel>
										<FormControl>
											<Input
												className="h-12 md:text-xl bg-gray-700 border-gray-600 text-white placeholder-gray-400"
												placeholder="username"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-60 md:w-96">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-300">Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="password"
												{...field}
												className="h-12 md:text-xl bg-gray-700 border-gray-600 text-white placeholder-gray-400"
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>
						{!isSending && <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Login</Button>}
					</form>
				</Form>
				<p className="pt-4 text-gray-300">Don't have an account? <span className="text-blue-400 cursor-pointer" onClick={() => { navigate("/signup") }}>Signup</span></p>
			</div>
		</div>
	);
};
