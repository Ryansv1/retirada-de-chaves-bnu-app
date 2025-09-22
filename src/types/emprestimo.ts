import type { Status, TipoEmprestimo } from "./enums";

export interface Emprestimo {
	id: string;
	chaveId: string;
	usuarioSolicitanteId: string;
	usuarioDevolucaoId: string | null;
	operadorId: string | null;
	dataRetirada: string;
	dataRetorno: string | null;
	status: Status;
	tipo: TipoEmprestimo;
	justificativa: string | null;
	createdAt: string;
	updatedAt: string;
}
