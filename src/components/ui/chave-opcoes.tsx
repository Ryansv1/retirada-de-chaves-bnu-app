import { TipoChave, type IAllChaves } from "@/types";
import {
	DialogTrigger,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Badge } from "./badge";
import { AlertCircleIcon, CogIcon, Home, KeyRound } from "lucide-react";
import { Separator } from "./separator";
import { RetornarEmprestimo } from "./retornar-emprestimo";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { GerarEmprestimo } from "./gerar-emprestimos";
import { useQuery } from "@tanstack/react-query";
import { getChaveById } from "@/services/chaves";
import { DateTime } from "luxon";
import { Skeleton } from "./skeleton";
const EMPRESTIMO_BY_CHAVE_ID_QUERY_KEY = "emprestimo-by-chave";

function useChaveById(chaveId: string, isDisponivel: boolean) {
	return useQuery({
		queryKey: [EMPRESTIMO_BY_CHAVE_ID_QUERY_KEY, chaveId],
		queryFn: () => getChaveById(chaveId),
		enabled: !!chaveId && isDisponivel === false,
	});
}

export function Opcoes({
	chave,
	isDisponivel,
}: {
	chave: IAllChaves;
	isDisponivel: boolean;
}) {
	const { data, isLoading, isError } = useChaveById(chave.id, isDisponivel);

	if (chave?.tipo === TipoChave["ARMARIO"]) {
		return (
			<Dialog key={chave.id}>
				<DialogTrigger asChild>
					<Button variant={"outline"}>
						<CogIcon />
						Opções
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{chave.Armario?.codigo}</DialogTitle>
					</DialogHeader>
					<div className="relative">
						<Badge
							className="absolute top-4 right-0 text-primary"
							variant={"secondary"}
						>
							<KeyRound /> Armário
						</Badge>
						<Separator />
						<div className="flex flex-col gap-4 mt-4">
							<div>
								<h1 className="font-bold ">Informações da chave</h1>
								<div className="grid grid-cols-2 gap-2 mt-2 text-sm">
									<h1>Bloco: {chave.Armario?.bloco}</h1>
									<h1>Localização: {chave.Armario?.localizacao}</h1>
								</div>
							</div>
							<Separator />
							{!isDisponivel ? (
								<div className="flex flex-col gap-4 mt-4 border-1  rounded-lg p-4">
									<h1>Quem retirou:</h1>
									{isLoading ? (
										<Skeleton className="w-full h-10" />
									) : isError ? (
										<span className="flex-1 bg-destructive/10 font-bold h-84 flex items-center justify-center border-destructive border-2 rounded-lg text-destructive">
											Ocorreu um erro ao listar o empréstimos relacionado à
											chave. Contate o Administrador.
										</span>
									) : (
										<div className="grid grid-cols-1 gap-2 mt-2 text-sm">
											<h1>
												Usuário:{" "}
												{data?.Emprestimo.map(
													(emprestimo) => emprestimo.UsuarioSolicitante.nome
												)}
											</h1>
											<h2>
												Data da retirada:{" "}
												{data?.Emprestimo.map((emprestimo) =>
													DateTime.fromISO(emprestimo.dataRetirada).toFormat(
														"DD, HH:mm",
														{ locale: "pt-BR" }
													)
												)}
											</h2>
										</div>
									)}
								</div>
							) : null}
						</div>
					</div>
					<DialogFooter>
						{isDisponivel === true ? (
							<GerarEmprestimo id={chave.id} />
						) : (
							<RetornarEmprestimo id={chave.id} />
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	if (chave?.tipo === TipoChave["AMBIENTE"]) {
		return (
			<Dialog key={chave.id}>
				<DialogTrigger asChild>
					<Button variant={"outline"}>
						<CogIcon />
						Opções
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{chave.Ambiente?.codigo} - {chave.Ambiente?.nome}
						</DialogTitle>
					</DialogHeader>
					<div className="relative">
						<Badge
							className="absolute top-4 right-0 text-primary"
							variant={"secondary"}
						>
							<Home /> Ambiente
						</Badge>
						<Separator />
						<div className="flex flex-col gap-4 mt-4">
							<div>
								<h1 className="font-bold ">Informações do ambiente</h1>
								<div className="grid grid-cols-2 gap-2 mt-2 text-sm">
									<h1>Localização: {chave.Ambiente?.localizacao}</h1>
									<h1>Capacidade do ambiente: {chave.Ambiente?.capacidade}</h1>
								</div>
							</div>
							<Separator />

							{!isDisponivel ? (
								<div className="flex flex-col gap-4 mt-4 border-1  rounded-lg p-4">
									<h1>Quem retirou:</h1>
									{isLoading ? (
										<Skeleton className="w-full h-10" />
									) : isError ? (
										<span className="flex-1 bg-destructive/10 font-bold h-84 flex items-center justify-center border-destructive border-2 rounded-lg text-destructive">
											Ocorreu um erro ao listar o empréstimos relacionado à
											chave. Contate o Administrador.
										</span>
									) : (
										<div className="grid grid-cols-1 gap-2 mt-2 text-sm">
											<h1>
												Usuário:{" "}
												{data?.Emprestimo.map(
													(emprestimo) => emprestimo.UsuarioSolicitante.nome
												)}
											</h1>
											<h2>
												Data da retirada:{" "}
												{data?.Emprestimo.map((emprestimo) =>
													DateTime.fromISO(emprestimo.dataRetirada).toFormat(
														"DD, HH:mm",
														{ locale: "pt-BR" }
													)
												)}
											</h2>
										</div>
									)}
								</div>
							) : null}
							{chave.Ambiente?.precisaReserva ? (
								<Alert variant={"destructive"}>
									<AlertCircleIcon />
									<AlertTitle>
										Esse ambiente precisa de reserva prévia
									</AlertTitle>
									<AlertDescription>
										Por favor, verifique no sistema SIEF se há uma reserva para
										o usuário solicitante
									</AlertDescription>
								</Alert>
							) : null}
						</div>
					</div>
					<DialogFooter>
						{isDisponivel === true ? (
							<GerarEmprestimo id={chave.id} />
						) : (
							<RetornarEmprestimo id={chave.id} />
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}
}
