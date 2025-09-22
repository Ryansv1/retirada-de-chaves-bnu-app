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

export function Opcoes({
	chave,
	isDisponivel,
}: {
	chave: IAllChaves;
	isDisponivel: boolean;
}) {
	if (chave?.tipo === TipoChave["ARMARIO"]) {
		return (
			<Dialog>
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
			<Dialog>
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
