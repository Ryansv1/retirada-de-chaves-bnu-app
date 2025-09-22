import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, getSession, signUp } from "@/lib/auth";
import { SignInSchema, type ISignInData } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import bgUrl from "@/assets/images/login-page.jpg";
import logoUrl from "@/assets/images/logo_horizontal.png";
import { LoaderIcon, LogIn, Trash2Icon, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/signIn")({
	beforeLoad: async () => {
		const session = await getSession();
		if (session.data?.session) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [isLoading, setIsLoading] = useState(false);
	const navigate = Route.useNavigate();
	const form = useForm({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (formData: ISignInData) => {
		setIsLoading(true);
		const { data, error } = await signIn.email({
			email: formData.email,
			password: formData.password,
		});

		if (data) {
			setIsLoading(false);
			toast.success("Sucesso ao autenticar");
			return navigate({
				to: "/dashboard",
				from: Route.fullPath,
			});
		}

		if (error) {
			setIsLoading(false);
			toast.error("Ocorreu um erro", {
				description: error.message,
			});
		}
	};

	return (
		<main className="relative flex items-center justify-start min-h-screen w-full overflow-hidden">
			<img
				src={bgUrl}
				className="absolute inset-0 z-0 h-full w-full object-cover brightness-50 "
			/>
			<Card className="mx-auto my-auto relative z-10 w-full max-w-xl ml-28 p-8 backdrop-blur-sm shadow-xl rounded-xl">
				<CardHeader>
					<img src={logoUrl} className="mb-10  w-sm place-self-center" />
					<CardTitle className="text-center text-lg font-bold uppercase">
						Login de Operador
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							id="create-user"
							onSubmit={form.handleSubmit(onSubmit)}
							className="grid grid-cols-1 gap-6"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="operador@email.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Senha de acesso</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="********"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</CardContent>
				<CardFooter className="flex flex-row justify-between">
					<Button variant={"outline"} onClick={() => form.reset()}>
						<Trash2Icon />
						Limpar Campos
					</Button>
					<Button form="create-user" type="submit" disabled={isLoading}>
						{isLoading ? (
							<>
								<LoaderIcon className="animate-spin" />
								Entrando...
							</>
						) : (
							<>
								<LogIn />
								Entrar
							</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
