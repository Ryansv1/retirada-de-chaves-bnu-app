import { CHAVES_QUERY_KEY } from "@/routes/_protected/emprestimos";
import { RetiradaChaveSchema, type IRetiradaData } from "@/schema/chave";
import { gerarEmprestimo } from "@/services/emprestimos";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { CheckIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./form";
import { Input } from "./input";

function useGerarEmprestimo() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["gerar-emprestimo"],
		mutationFn: async ({ data, id }: { data: IRetiradaData; id: string }) =>
			await gerarEmprestimo(id, data),
		onSuccess: () => {
			toast.success("Sucesso ao gerar empréstimo.");
			queryClient.invalidateQueries({
				queryKey: [CHAVES_QUERY_KEY],
			});
		},
	});
}

export function GerarEmprestimo({ id }: { id: string }) {
	const gerarEmprestimo = useGerarEmprestimo();
	const form = useForm({
		resolver: zodResolver(RetiradaChaveSchema),
		defaultValues: {
			matricula: "",
		},
	});

	async function onSubmit(data: IRetiradaData) {
		return await gerarEmprestimo.mutateAsync({ id, data });
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<PlusIcon />
					Gerar Empréstimo
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Gerar Novo Empréstimo</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form id="gerar-emprestimo" onSubmit={form.handleSubmit(onSubmit)}>
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
										clique em gerar empréstimo
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
					<Button type="submit" form="gerar-emprestimo">
						<CheckIcon />
						Gerar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
