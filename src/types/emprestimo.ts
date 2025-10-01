import type { Chave } from "./chave";
import type { Status, TipoEmprestimo } from "./enums";
import type { Operadores } from "./operadores";
import type { Usuarios } from "./usuarios";

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



export interface IEmprestimoByID extends Emprestimo  {
  OperadorDevolucao: Pick<Operadores, "id" | "email" | "name" | "role">
  OperadorSolicitacao: Pick<Operadores, "id" | "email" | "name" | "role">,
  UsuarioDevolucao: Usuarios
  UsuarioSolicitante: Usuarios,
  Chave: Chave
}
