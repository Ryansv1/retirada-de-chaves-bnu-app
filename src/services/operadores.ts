import { api } from "@/lib/axios";

export async function getOperadores() {
	try {
		const response = await api.get("/operadores");
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

export async function deleteOperador(operadorId: string) {
	try {
		const response = await api.delete(`/operadores/${operadorId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}
