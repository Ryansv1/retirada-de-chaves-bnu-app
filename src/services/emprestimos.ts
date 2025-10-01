import { api } from "@/lib/axios";
import type { TListarEmprestimos } from "@/routes/_protected/listar-emprestimos";
import type {
	IDevolucaoData,
	IEmprestimoAdministrativo,
	IRetiradaData,
} from "@/schema/chave";
import type { IEmprestimoByID } from "@/types";

export async function getEmprestimos(filters: TListarEmprestimos) {
	try {
		const response = await api.get("/emprestimos", {
			params: {
				...filters,
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getEmprestimoById(id: string) {
	try {
		const response = await api.get<IEmprestimoByID>(`/emprestimos/${id}`);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

export async function gerarEmprestimo(idChave: string, data: IRetiradaData) {
	try {
		const response = await api.post(`/emprestimos/retirada/${idChave}`, {
			...data,
		});

		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function retornarEmprestimo(
	idChave: string,
	data: IDevolucaoData
) {
	try {
		const response = await api.post(
			`/emprestimos/devolucao/${idChave}`,
			JSON.stringify({
				matricula: data.matricula,
			}),
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function gerarEmprestimoAdministrativo(
	data: IEmprestimoAdministrativo
) {
	try {
		const response = await api.post("/emprestimos/emprestimo-administrativo", {
			...data,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
