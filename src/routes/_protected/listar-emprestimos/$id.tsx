import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getEmprestimoById } from "@/services/emprestimos";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircleIcon, InfoIcon } from "lucide-react";
import { DateTime } from "luxon";

export const EMPRESTIMO_BY_ID = "emprestimo";

export const Route = createFileRoute("/_protected/listar-emprestimos/$id")({
	beforeLoad: ({ context, params }) => {
		const { queryClient } = context;

		queryClient.prefetchQuery({
			queryKey: [EMPRESTIMO_BY_ID, params.id],
			queryFn: () => getEmprestimoById(params.id),
		});
	},
	component: RouteComponent,
});

function useEmprestimoById(id: string) {
	return useSuspenseQuery({
		queryKey: [EMPRESTIMO_BY_ID, id],
		queryFn: () => getEmprestimoById(id),
	});
}

function RouteComponent() {
	const { id: emprestimoId } = Route.useParams();
	const { data: emprestimo, isError: emprestimoError } =
		useEmprestimoById(emprestimoId);

	if (!emprestimo || emprestimoError) {
		return (
			<Alert>
				<AlertCircleIcon />
				<AlertTitle>Ocorreu um erro!</AlertTitle>
				<AlertDescription>
					Contate o administrador do sistema para comunicar dessa situação.
				</AlertDescription>
			</Alert>
		);
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle>Informações sobre o empréstimo: {emprestimo.id}</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Card>
					<CardHeader className="relative">
						<CardTitle>Informações sobre a Chave e Ambiente</CardTitle>
						<Badge className="absolute right-6">
							Tipo: {emprestimo.Chave.tipo}
						</Badge>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-2">
						<span className="text-muted-foreground">
							ID: {emprestimo.Chave.id}
						</span>
						<span>
							Código:{" "}
							{emprestimo.Chave.Ambiente?.codigo ??
								emprestimo.Chave.Armario?.codigo}
						</span>
						{emprestimo.Chave.tipo === "AMBIENTE" && (
							<>
								<span>Nome: {emprestimo.Chave.Ambiente!.nome}</span>
								<span>
									Localização: {emprestimo.Chave.Ambiente!.localizacao}
								</span>
								<span>
									Capacidade: {emprestimo.Chave.Ambiente!.capacidade} pessoas
								</span>
								<span>
									Precisa de Reserva Prévia:{" "}
									{emprestimo.Chave.Ambiente!.precisaReserva ? "Sim" : "Não"}
								</span>
							</>
						)}
						{emprestimo.Chave.tipo === "ARMARIO" && (
							<>
								<span>
									Localização: {emprestimo.Chave.Armario!.localizacao}
								</span>
								<span>Bloco: {emprestimo.Chave.Armario!.bloco}</span>
							</>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Informações sobre o Empréstimo</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-2">
						<span className="text-muted-foreground">ID: {emprestimo.id}</span>
						<div className="flex flex-row gap-2">
							<span>Status</span>
							<Badge
								variant={
									emprestimo.status === "PENDENTE" ? "destructive" : "default"
								}
							>
								{emprestimo.status}
							</Badge>
						</div>
						<span>
							Data retirada:{" "}
							{DateTime.fromISO(emprestimo.dataRetirada).toFormat("DD, HH:mm", {
								locale: "pt-BR",
							})}
						</span>
						{emprestimo.dataRetorno && emprestimo.status === "DEVOLVIDO" && (
							<span>
								Data Devolução:{" "}
								{DateTime.fromISO(emprestimo.dataRetorno).toFormat(
									"DD, HH:mm",
									{ locale: "pt-BR" }
								)}
							</span>
						)}
						<div className="flex flex-row gap-2">
							<span>Tipo de Empréstimo:</span>
							<Badge
								variant={
									emprestimo.tipo === "ADMINISTRATIVO"
										? "destructive"
										: "default"
								}
							>
								{emprestimo.tipo}
							</Badge>
							<Tooltip>
								<TooltipTrigger>
									<InfoIcon className="w-4 h-4 text-primary cursor-help" />
								</TooltipTrigger>
								<TooltipContent className="break-all">
									<p>
										O tipo de empréstimo pode ser: "ADMINISTRATIVO" para
										empréstimos gerados pelos operadores, em um fluxo atípico,
										ou "NORMAL" para empréstimos gerados pelo fluxo normal do
										sistema
									</p>
								</TooltipContent>
							</Tooltip>
						</div>

						{emprestimo.tipo === "ADMINISTRATIVO" && (
							<span>Justificativa: {emprestimo.justificativa}</span>
						)}
					</CardContent>
				</Card>

				<Separator />
				<Card>
					<CardHeader>
						<CardTitle>Informações sobre o Usuário Solicitante</CardTitle>
					</CardHeader>
					<CardContent className="grid  gap-4">
						<span className="text-muted-foreground">
							ID: {emprestimo.UsuarioSolicitante.id}
						</span>
						<span>Nome: {emprestimo.UsuarioSolicitante.nome}</span>
						<span>Matrícula: {emprestimo.UsuarioSolicitante.matricula}</span>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Informações sobre o Usuário que Devolveu</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						{emprestimo.status === "DEVOLVIDO" ? (
							<>
								<span className="text-muted-foreground">
									ID: {emprestimo.UsuarioDevolucao.id}
								</span>
								<span>Nome: {emprestimo.UsuarioDevolucao.nome}</span>
								<span>Matricula: {emprestimo.UsuarioDevolucao.matricula}</span>
							</>
						) : (
							<span className="flex-1 h-20 bg-destructive/10 text-destructive ring-1 ring-destructive rounded-lg flex items-center justify-center shadow-sm">
								Empréstimo ainda não foi devolvido!
							</span>
						)}
					</CardContent>
				</Card>

				<Separator />
				<Card>
					<CardHeader>
						<CardTitle>Informações sobre o Operador da Solicitação</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						<span className="text-muted-foreground">
							ID: {emprestimo.OperadorSolicitacao.id}
						</span>
						<span>Nome: {emprestimo.OperadorSolicitacao.name}</span>
						<span>E-mail: {emprestimo.OperadorSolicitacao.email}</span>
						<span>Permissão: {emprestimo.OperadorSolicitacao.role}</span>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Informações sobre o Operador da Devolução</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						{emprestimo.status === "DEVOLVIDO" ? (
							<>
								<span className="text-muted-foreground">
									ID: {emprestimo.OperadorDevolucao.id}
								</span>
								<span>Nome: {emprestimo.OperadorDevolucao.name}</span>
								<span>E-mail: {emprestimo.OperadorDevolucao.email}</span>
								<span>Permissão: {emprestimo.OperadorDevolucao.role}</span>
							</>
						) : (
							<span className="flex-1 h-20 bg-destructive/10 text-destructive ring-1 ring-destructive rounded-lg flex items-center justify-center shadow-sm">
								Empréstimo ainda não foi devolvido!
							</span>
						)}
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
}
