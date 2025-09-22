import { api } from "@/lib/axios";
import type { TChavesSearchFilter } from "@/routes/_protected/emprestimos";
import type { IAllChaves, IChaveById } from "@/types";

export async function getChaves(filters: TChavesSearchFilter) {
	try {
		const response = await api.get<IAllChaves[]>("/chaves", {
			params: {
				...filters,
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getChaveById(id: string) {
	try {
		const response = await api.get<IChaveById>(`/chaves/${id}`);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
