import { DevolucaoChaveSchema, type IDevolucaoData } from "@/schema/chave";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
	DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { CheckIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormControl,
	FormDescription,
} from "./form";
import { Input } from "./input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { retornarEmprestimo } from "@/services/emprestimos";
import { toast } from "sonner";
import { CHAVES_QUERY_KEY } from "@/routes/_protected/emprestimos";

function useRetornarEmprestimo() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["retornar-emprestimo"],
		mutationFn: async ({ data, id }: { data: IDevolucaoData; id: string }) =>
			await retornarEmprestimo(id, data),
		onSuccess: () => {
			toast.success("Sucesso ao devolver a chave!");
			queryClient.invalidateQueries({
				queryKey: [CHAVES_QUERY_KEY],
			});
		},
	});
}

export function RetornarEmprestimo({ id }: { id: string }) {
	const retornarEmprestimo = useRetornarEmprestimo();
	const form = useForm({
		resolver: zodResolver(DevolucaoChaveSchema),
		defaultValues: {
			matricula: "",
		},
	});

	async function onSubmit(data: IDevolucaoData) {
		return await retornarEmprestimo.mutateAsync({ id, data });
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<PlusIcon />
					Retornar Empréstimo
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Retornar Empréstimo</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form id="retornar-emprestimo" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="matricula"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Matrícula do Solicitante</FormLabel>
									<FormControl>
										<Input type="text" placeholder={"1231241"} {...field} />
									</FormControl>
									<FormMessage />
									<FormDescription>
										Peça para o Solicitante digitar sua matrícula, em seguida,
										clique em retornar empréstimo
									</FormDescription>
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter>
					<Button variant={"outline"} onClick={() => form.reset()}>
						<Trash2Icon />
						Limpar
					</Button>
					<Button type="submit" form="retornar-emprestimo">
						<CheckIcon />
						Retornar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
