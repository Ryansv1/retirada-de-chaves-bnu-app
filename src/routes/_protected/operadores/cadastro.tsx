import { getSession, signUp } from "@/lib/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, type ISignupData } from "@/schema/auth";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2Icon, UserPlusIcon, LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { OPERADORES_QUERY_KEY } from ".";

export const Route = createFileRoute("/_protected/operadores/cadastro")({
	beforeLoad: async () => {
		const session = await getSession();
		const isAdmin = session.data?.user.role === "ADMIN";
		if (!isAdmin) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = Route.useNavigate();
	const form = useForm({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			email: "",
			name: "",
			password: "",
		},
	});

	const onSubmit = async (formData: ISignupData) => {
		setIsLoading(true);
		const { data, error } = await signUp.email({
			email: formData.email,
			name: formData.name,
			password: formData.password,
		});

		if (data) {
			setIsLoading(false);
			toast.success("Usuário criado com sucesso!.");
			queryClient.invalidateQueries({
				queryKey: [OPERADORES_QUERY_KEY],
			});
			return navigate({
				to: "/operadores",
				from: Route.fullPath,
			});
		}

		if (error) {
			setIsLoading(false);
			toast.error("Ocorreu um erro.", {
				description: error.message,
			});
		}
	};
	return (
		<div className="container mx-auto flex flex-col items-center justify-center">
			<Card className="max-w-lg">
				<CardHeader>
					<CardTitle>Cadastro de Operador</CardTitle>
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
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome Completo do Operador</FormLabel>
										<FormControl>
											<Input type="text" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail do Operador</FormLabel>
										<FormControl>
											<Input type="text" {...field} />
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
										<FormLabel>Senha de acesso do Operador</FormLabel>
										<FormControl>
											<Input type="text" {...field} />
										</FormControl>
										<FormMessage />
										<FormDescription>
											Esse dado é criptografado, portanto, em caso de perda, não
											podemos recuperar.
										</FormDescription>
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
								Cadastrando...
							</>
						) : (
							<>
								<UserPlusIcon />
								Cadastrar
							</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
