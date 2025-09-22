import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/ui/data-table";

import { deleteOperador, getOperadores } from "@/services/operadores";
import type { Operadores } from "@/types";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { PlusIcon, ShieldUser, Trash2Icon } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api-error";

const columns: ColumnDef<Operadores>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Nome",
	},
	{
		accessorKey: "email",
		header: "E-mail",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const operador = row.original;

			return <DeleteOperador data={operador} />;
		},
	},
];

export const OPERADORES_QUERY_KEY = "operadores";

export const Route = createFileRoute("/_protected/operadores/")({
	loader: ({ context }) => {
		const { queryClient } = context;

		queryClient.prefetchQuery({
			queryKey: [OPERADORES_QUERY_KEY],
			queryFn: getOperadores,
		});
	},
	component: RouteComponent,
});

function useOperadores() {
	return useSuspenseQuery({
		queryKey: [OPERADORES_QUERY_KEY],
		queryFn: getOperadores,
	});
}

function RouteComponent() {
	const { data: operadores, isError: operadoresError } = useOperadores();

	return (
		<div className="container mx-auto">
			<div className="flex flex-row gap-2 items-center">
				<h1 className="font-bold text-2xl">Operadores</h1>
				<ShieldUser />
			</div>
			<h2 className="text-md text-muted-foreground">
				Aqui estão todos os operadores cadastrados no sistema.
			</h2>

			<div className="my-4 place-self-end">
				<Button asChild>
					<Link to="/operadores/cadastro">
						<PlusIcon />
						Criar novo Operador
					</Link>
				</Button>
			</div>
			<div className="my-4">
				{operadoresError ? (
					<div className="w-full h-84 bg-destructive/10 text-destructive border-destructive font-bold flex items-center justify-center border-2 text-center rounded-lg">
						<span>
							Ocorreu um erro ao buscar os operadores. Contate o administrador.
						</span>
					</div>
				) : (
					<DataTable data={operadores} columns={columns} key={1} />
				)}
			</div>
		</div>
	);
}

function useDeleteOperador() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["delete-operador"],
		mutationFn: (operadorId: string) => deleteOperador(operadorId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [OPERADORES_QUERY_KEY],
			});
			toast.success("Operador removido com sucesso.");
		},
		onError: (err) => {
			const msg = handleApiError(err);
			toast.error("Ocorreu um erro", {
				description: msg.message,
			});
		},
	});
}

function DeleteOperador({ data }: { data: Operadores }) {
	const deleteOperador = useDeleteOperador();

	const submit = async () => {
		return await deleteOperador.mutateAsync(data.id);
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">
					<Trash2Icon />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
					<AlertDialogDescription>
						Essa ação não pode ser desfeita. O operador vai ser deslogado nesse
						momento em que você removê-lo.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={submit}>Continuar</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
