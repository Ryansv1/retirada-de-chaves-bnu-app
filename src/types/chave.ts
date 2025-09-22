import type { Ambiente } from "./ambiente";
import type { Armario } from "./armario";
import type { TipoChave } from "./enums";
import type { Emprestimo } from "./emprestimo";

interface BaseChave {
	id: string;
	tipo: TipoChave;
}

// Chave de Armário
export interface ChaveArmario extends BaseChave {
	armarioId: string;
	ambienteId: null;
	Armario: Armario;
	Ambiente: null;
}

// Chave de Ambiente
export interface ChaveAmbiente extends BaseChave {
	armarioId: null;
	ambienteId: string;
	Armario: null;
	Ambiente: Ambiente;
}

// União discriminada (base)
export type Chave = ChaveArmario | ChaveAmbiente;

// ------------------
// 🔹 Uso em listas
// ------------------
/**
 * Quando você precisa carregar várias chaves juntas,
 * mas nem sempre com os relacionamentos populados.
 */
export type IAllChaves = Omit<Chave, "Armario" | "Ambiente"> & {
	Armario: Armario | null;
	Ambiente: Ambiente | null;
};

// ------------------
// 🔹 Emprestimo
// ------------------
interface EmprestimoWithUsuarioSolicitante extends Emprestimo {
	UsuarioSolicitante: {
		nome: string;
	};
}

export type ChaveWithEmprestimo =
	| (ChaveArmario & { Emprestimo: EmprestimoWithUsuarioSolicitante[] })
	| (ChaveAmbiente & { Emprestimo: EmprestimoWithUsuarioSolicitante[] });

// ------------------
// 🔹 Buscar por ID
// ------------------
/**
 * Aqui você sempre espera vir com join,
 * mas pode não existir Armário ou Ambiente dependendo do tipo.
 */
export type IChaveById = Omit<Chave, "Armario" | "Ambiente"> & {
	Armario: Armario | null;
	Ambiente: Ambiente | null;
	Emprestimo: EmprestimoWithUsuarioSolicitante[];
};
