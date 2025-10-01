import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getEmprestimos } from "@/services/emprestimos";
import { Status, type Emprestimo } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowRight, CalendarIcon, FilterIcon, InfoIcon } from "lucide-react";
import { DateTime } from "luxon";
import React from "react";
import z from "zod";

const columns: ColumnDef<Emprestimo>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "tipo",
		header: "Tipo",
		cell: ({ row }) => {
			return (
				<Badge variant={"outline"}>
					<InfoIcon /> {row.original.tipo}
				</Badge>
			);
		},
	},
	{
		accessorKey: "justificativa",
		header: "Justificativa",
		cell: ({ row }) => {
			const justificativa = row.original.justificativa;

			return justificativa ? justificativa : "Não se aplica.";
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;

			return (
				<Badge
					variant={status === Status["PENDENTE"] ? "destructive" : "default"}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		accessorKey: "dataRetirada",
		header: "Data da Retirada",
		cell: ({ row }) => {
			const dataRetirada = row.original.dataRetirada;

			return DateTime.fromISO(dataRetirada).toFormat("DD, HH:mm", {
				locale: "pt-BR",
			});
		},
	},
	{
		accessorKey: "dataRetorno",
		header: "Data do Retorno",
		cell: ({ row }) => {
			const dataRetirada = row.original.dataRetorno;

			return dataRetirada ? (
				DateTime.fromISO(dataRetirada).toFormat("DD, HH:mm", {
					locale: "pt-BR",
				})
			) : (
				<span className="text-destructive animate-pulse">Não devolvida</span>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const emprestimoId = row.original.id;

			return (
				<Link
					to={"/listar-emprestimos/$id"}
					params={{
						id: emprestimoId,
					}}
				>
					<Button>
						<ArrowRight />
					</Button>
				</Link>
			);
		},
	},
];

const urlSchema = z.object({
	status: z.enum(["DEVOLVIDO", "PENDENTE"]).optional(),
	tipo: z.enum(["ADMINISTRATIVO", "NORMAL"]).optional(),
	dataRetirada: z.iso.date().catch(DateTime.now().toISODate()),
	dataRetorno: z.iso.date().catch(DateTime.now().plus({ days: 7 }).toISODate()),
	nomeSolicitante: z.string().optional(),
	matriculaSolicitante: z.string().optional(),
	codigo: z.string().optional(),
});

export type TListarEmprestimos = z.infer<typeof urlSchema>;

const EMPRESTIMOS_QUERY_KEY = "emprestimsos";

export const Route = createFileRoute("/_protected/listar-emprestimos/")({
	validateSearch: (search) => urlSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context, deps }) => {
		const { queryClient } = context;
		const { search } = deps;
		queryClient.prefetchQuery({
			queryKey: [EMPRESTIMOS_QUERY_KEY, search],
			queryFn: () => getEmprestimos(search),
		});
	},
	pendingComponent: () => {
		<Skeleton className="w-full h-screen" />;
	},
	component: RouteComponent,
});

function useEmprestimos(search: any) {
	return useSuspenseQuery({
		queryKey: [EMPRESTIMOS_QUERY_KEY, search],
		queryFn: () => getEmprestimos(search),
	});
}

function RouteComponent() {
	const search = Route.useSearch();
	const { data: emprestimos, isError: emprestimosError } =
		useEmprestimos(search);
	const navigate = useNavigate({ from: Route.fullPath });
	const [codigo, setCodigo] = React.useState<string>("");
	const [nomeSolicitante, setNomeSolicitante] = React.useState<string>("");
	const [matriculaSolicitante, setMatriculaSolicitante] =
		React.useState<string>("");

	const debouncedCodigo = useDebounce(codigo, 300);
	const debouncedNome = useDebounce(nomeSolicitante, 300);
	const debouncedMatricula = useDebounce(matriculaSolicitante, 300);

	React.useEffect(() => {
		navigate({
			to: ".",
			search: (prev) => ({
				...prev,
				codigo: debouncedCodigo || undefined,
			}),
		});
	}, [debouncedCodigo, navigate]);

	React.useEffect(() => {
		navigate({
			to: ".",
			search: (prev) => ({
				...prev,
				nomeSolicitante: debouncedNome || undefined,
			}),
		});
	}, [debouncedNome, navigate]);

	React.useEffect(() => {
		navigate({
			to: ".",
			search: (prev) => ({
				...prev,
				matriculaSolicitante: debouncedMatricula || undefined,
			}),
		});
	}, [debouncedMatricula, navigate]);

	return (
		<div className="container mx-auto">
			<h1 className="font-bold text-2xl">Todos os Empréstimos</h1>
			{/** Filtros */}
			<Card className="my-4">
				<CardHeader>
					<div className="flex items-center gap-2">
						<FilterIcon />
						<CardTitle>Filtros</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="grid grid-cols-3 gap-2">
						<div className="flex flex-col gap-2">
							<Label>Tipo de empréstimo</Label>
							<Select
								onValueChange={(val: "ADMINISTRATIVO" | "NORMAL" | "TODOS") => {
									navigate({
										to: ".",
										search: (prev) => ({
											...prev,
											tipo:
												val === "ADMINISTRATIVO" || val === "NORMAL"
													? val
													: undefined,
										}),
									});
								}}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											search.tipo === "ADMINISTRATIVO"
												? "Administrativo"
												: search.tipo === "NORMAL"
													? "Normal"
													: "Todos"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="TODOS">Todos</SelectItem>
									<SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
									<SelectItem value="NORMAL">Normal</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Status do empréstimo</Label>
							<Select
								onValueChange={(val: "DEVOLVIDO" | "PENDENTE" | "TODOS") => {
									navigate({
										to: ".",
										search: (prev) => ({
											...prev,
											status:
												val === "DEVOLVIDO" || val === "PENDENTE"
													? val
													: undefined,
										}),
									});
								}}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											search.status === "DEVOLVIDO"
												? "Devolvido"
												: search.status === "PENDENTE"
													? "Pendente"
													: "Todos"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="TODOS">Todos</SelectItem>
									<SelectItem value="DEVOLVIDO">Devolvido</SelectItem>
									<SelectItem value="PENDENTE">Pendente</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div className="flex flex-col gap-2">
							<Label>Data de Retirada</Label>
							<div className="*:not-first:mt-2">
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
										>
											<span
												className={cn(
													"truncate",
													!search.dataRetirada &&
														!search.dataRetorno &&
														"text-muted-foreground"
												)}
											>
												{search.dataRetirada ? (
													search.dataRetorno ? (
														<>
															{DateTime.fromISO(search.dataRetirada).toFormat(
																"DD",
																{
																	locale: "pt-BR",
																}
															)}{" "}
															-{" "}
															{DateTime.fromISO(search.dataRetorno).toFormat(
																"DD",
																{
																	locale: "pt-BR",
																}
															)}
														</>
													) : (
														DateTime.fromISO(search.dataRetirada).toFormat(
															"DD",
															{
																locale: "pt-BR",
															}
														)
													)
												) : (
													"Pick a date range"
												)}
											</span>
											<CalendarIcon
												size={16}
												className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
												aria-hidden="true"
											/>
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-2" align="start">
										<Calendar
											mode="range"
											selected={{
												from: DateTime.fromISO(search.dataRetirada).toJSDate(),
												to: DateTime.fromISO(search.dataRetorno).toJSDate(),
											}}
											onSelect={(data) => {
												return data
													? navigate({
															to: ".",
															search: (prev) => ({
																...prev,
																dataRetirada: DateTime.fromJSDate(
																	data.from!
																).toISODate()!,
																dataRetorno: DateTime.fromJSDate(
																	data.to!
																).toISODate()!,
															}),
														})
													: null;
											}}
										/>
									</PopoverContent>
								</Popover>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-3 gap-2">
						<div className="flex flex-col gap-2">
							<Label>Código da chave</Label>
							<Input
								placeholder="Ex: B118"
								value={codigo}
								onChange={(e) => setCodigo(e.target.value)}
								type="text"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Nome do solicitante</Label>
							<Input
								placeholder="Ex: João da Silva"
								value={nomeSolicitante}
								onChange={(e) => setNomeSolicitante(e.target.value)}
								type="text"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Matrícula do solicitante</Label>
							<Input
								placeholder="Ex: 2021000000"
								value={matriculaSolicitante}
								onChange={(e) => setMatriculaSolicitante(e.target.value)}
								type="text"
							/>
						</div>
					</div>
				</CardContent>
			</Card>
			<Separator className="my-4" />
			{/** Tabela */}
			{emprestimosError ? (
				<span className="flex-1 bg-destructive/10 font-bold h-84 flex items-center justify-center border-destructive border-2 rounded-lg text-destructive">
					Ocorreu um erro ao listar os empréstimos. Contate o Administrador.
				</span>
			) : (
				<DataTable data={emprestimos} columns={columns} />
			)}
		</div>
	);
}
