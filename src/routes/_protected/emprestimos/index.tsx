import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";
import { getChaves } from "@/services/chaves";

import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import { useDebounce } from "@uidotdev/usehooks";
import {
	ArrowLeftRightIcon,
	FilterIcon,
	Home,
	KeyRound,
	MapPinIcon,
	PlusCircleIcon,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { TipoChave } from "@/types";
import { Opcoes } from "@/components/ui/chave-opcoes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const ChavesSearchFilterSchema = z.object({
	codigo: z.string().optional(),
	status: z
		.enum(["disponivel", "indisponivel"])
		.default("disponivel")
		.optional(),
	tipo: z.enum(["ARMARIO", "AMBIENTE"]).optional(),
	localizacao: z.enum(["SNO", "VELHA"]).optional(),
});

export type TChavesSearchFilter = z.infer<typeof ChavesSearchFilterSchema>;
export const CHAVES_QUERY_KEY = "chaves";

export const Route = createFileRoute("/_protected/emprestimos/")({
	validateSearch: (search) => ChavesSearchFilterSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context, deps }) => {
		const { queryClient } = context;
		const { search } = deps;

		return queryClient.prefetchQuery({
			queryKey: [CHAVES_QUERY_KEY, search],
			queryFn: () => getChaves(search),
		});
	},
	pendingComponent: () => <Skeleton className="w-full h-full" />,
	component: RouteComponent,
});

function useChaves(search: any) {
	return useSuspenseQuery({
		queryKey: [CHAVES_QUERY_KEY, search],
		queryFn: () => getChaves(search),
	});
}

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data: chaves, isError: chavesError } = useChaves(search);
	const [codigo, setCodigo] = React.useState<string>("");
	const debounced = useDebounce(codigo, 300);

	React.useEffect(() => {
		navigate({
			to: ".",
			search: (prev) => ({
				...prev,
				codigo: debounced || undefined,
			}),
		});
	}, [debounced, navigate]);

	return (
		<div className="container mx-auto">
			{/** Header */}
			<div className="flex flex-row gap-2 items-center relative">
				<h1 className="text-2xl font-bold">Empréstimos de chave</h1>
				<ArrowLeftRightIcon />
				<Button asChild className="absolute right-0">
					<Link to={"/emprestimos/emprestimo-administrativo"}>
						<PlusCircleIcon /> Empréstimo Administrativo{" "}
					</Link>
				</Button>
			</div>
			<h2 className="text-md text-muted-foreground">
				Selecione os filtros de acordo com suas necessidades
			</h2>

			{/** Filtros */}
			<Card className="my-4">
				<CardHeader>
					<div className="flex flex-row gap-2 items-center">
						<FilterIcon className="w-4 h-4" />
						<CardTitle>Filtros</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="grid grid-cols-3">
						<div className="flex flex-col gap-2">
							<Label>Selecione a Localização (Campus)</Label>
							<Select
								onValueChange={(val: "SNO" | "VELHA" | "TODOS") =>
									navigate({
										to: ".",
										from: Route.fullPath,
										search: (prev) => ({
											...prev,
											localizacao:
												val === "SNO" || val === "VELHA" ? val : undefined,
										}),
									})
								}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											search.localizacao === "VELHA"
												? "Campus Velha"
												: search.localizacao === "SNO"
													? "Campus Salto do Norte"
													: "Todos"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="TODOS">Todos</SelectItem>
									<SelectItem value="VELHA">Campus Velha</SelectItem>
									<SelectItem value="SNO">Campus Salto do Norte</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Selecione o tipo</Label>
							<Select
								onValueChange={(val: "AMBIENTE" | "ARMARIO" | "TODAS") =>
									navigate({
										to: ".",
										from: Route.fullPath,
										search: (prev) => ({
											...prev,
											tipo:
												val === "AMBIENTE" || val === "ARMARIO"
													? val
													: undefined,
										}),
									})
								}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											search.tipo === "AMBIENTE"
												? "Ambiente"
												: search.tipo === "ARMARIO"
													? "Armário"
													: "Todos"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Todos">Todos</SelectItem>
									<SelectItem value="AMBIENTE">Ambiente</SelectItem>
									<SelectItem value="ARMARIO">Armário</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Selecione o Status Atual da Chave</Label>
							<Select
								onValueChange={(val: "disponivel" | "indisponivel") =>
									navigate({
										to: ".",
										from: Route.fullPath,
										search: (prev) => ({
											...prev,
											status: val,
										}),
									})
								}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											search.status === "disponivel"
												? "Disponível"
												: "Indisponível"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="disponivel">Disponível</SelectItem>
									<SelectItem value="indisponivel">Indisponível</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="codigo-sala">Código do Ambiente/Armário</Label>
						<Input
							placeholder="Ex: B118"
							value={codigo}
							onChange={(e) => setCodigo(e.target.value)}
							type="text"
						/>
					</div>
				</CardContent>
			</Card>

			<div className="mb-4 w-full my-2 p-6 border border-sm rounded-xl shadow-sm">
				<h2 className="font-semibold mb-2">Legenda:</h2>
				<ul className="flex flex-col gap-2 text-sm">
					<li className="flex items-center gap-2">
						<span className="inline-block bg-primary/40 w-3 h-3 rounded-full border border-primary" />
						<span>Chaves do novo Campus Salto do Norte</span>
					</li>
					<li className="flex items-center gap-2">
						<span className="inline-block bg-amber-300/40 w-3 h-3 rounded-full border border-amber-400" />
						<span>Chaves do antigo Campus Velha</span>
					</li>
				</ul>
			</div>
			{/** Listagem de Chaves */}
			<main className="relative">
				{!chaves ? (
					<Skeleton className="w-full h-full" />
				) : chavesError ? (
					<div className="flex-1 bg-destructive/10 font-bold h-84 flex items-center justify-center border-destructive border-2 rounded-lg text-destructive">
						Ocorreu um erro ao buscar as chaves. Contate o administrador.
					</div>
				) : chaves.length === 0 ? (
					<div className="flex-1 bg-primary/10 font-bold h-84 flex items-center justify-center border-primary border-2 rounded-lg text-primary">
						Não foram encontradas Chaves para o filtro solicitado.
					</div>
				) : (
					<div className="grid grid-cols-2 gap-3">
						{chaves.map((chave) => (
							<Card
								key={chave.id}
								className={cn(
									"min-h-20 relative  hover:ring-2 duration-300",
									chave.Ambiente?.localizacao === "VELHA" ||
										chave.Armario?.localizacao === "VELHA"
										? "border-l-amber-300 border-l-6  ring-amber-300"
										: "border-l-primary border-l-6 ring-primary"
								)}
							>
								<CardHeader className="">
									<CardTitle>
										{chave.tipo === "AMBIENTE" ? (
											<>
												{chave.Ambiente?.codigo} - {chave.Ambiente?.nome}
											</>
										) : (
											chave.Armario?.codigo
										)}
									</CardTitle>
									<CardDescription className="text-xs">
										ID: {chave.id}
									</CardDescription>
									<div className="flex flex-col absolute right-6 top-6 gap-2 items-end">
										{chave.tipo === TipoChave["AMBIENTE"] ? (
											<Badge variant={"outline"}>
												<MapPinIcon />
												{chave.Ambiente?.localizacao}
											</Badge>
										) : (
											<Badge variant={"outline"}>
												<MapPinIcon />
												{chave.Armario?.localizacao}
											</Badge>
										)}
										<Badge variant={"outline"}>
											{chave.tipo === "AMBIENTE" ? (
												<>
													<Home /> Ambiente
												</>
											) : (
												<>
													<KeyRound /> Armário
												</>
											)}
										</Badge>
									</div>
								</CardHeader>
								<CardFooter className="place-self-start">
									<Opcoes
										chave={chave}
										isDisponivel={search.status === "disponivel" ? true : false}
									/>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
