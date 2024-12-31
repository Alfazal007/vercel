import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const registerUserType = z.object({
	username: z.string({ message: "Username not provided" }).trim().min(6, "Minimum length of username should be 6").max(20, "Maximum length of username should be 20"),
	password: z.string({ message: "Password not provided" }).trim().min(6, "Minimum length of password should be 6").max(20, "Maximum length of password should be 20"),
})

export const SignUp = () => {
	const navigate = useNavigate();
	const [isSending, setIsSending] = useState<boolean>(false);

	const form = useForm<z.infer<typeof registerUserType>>({
		resolver: zodResolver(registerUserType),
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const { toast } = useToast();

	async function onSubmit(values: z.infer<typeof registerUserType>) {
		try {
			setIsSending(true);
			const res = await axios.post(
				"http://localhost:8000/api/v1/user/create",
				values
			);
			if (res.status !== 201) {
				toast({
					title: "Issue signing up",
					description: `${res.data.message}`,
					variant: "destructive"
				});
				return;
			}
			toast({
				title: "Signup successful",
			});
			navigate("/signin");
		} catch (err: any) {
			toast({
				title: "Issue signing up",
				description: `There was an error signing up: ${err.message}`,
				variant: "destructive"
			});
		} finally {
			setIsSending(false);
		}
	}

	return (
		<div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
			<div className="md:border-2 border-gray-700 p-8 bg-gray-800 rounded-lg">
				<h1 className="font-bold text-2xl pb-4 text-center text-white">Sign-up to use Custom gists</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
						<Button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 text-white"
							disabled={isSending}
						>
							{isSending ? 'Registering...' : 'Register'}
						</Button>
					</form>
				</Form>
				<p className="pt-4 text-gray-300">
					Already have an account?{' '}
					<span
						className="text-blue-400 cursor-pointer"
						onClick={() => navigate("/signin")}
					>
						Sign in
					</span>
				</p>
			</div>
		</div>
	);
};
