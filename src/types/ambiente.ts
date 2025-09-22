import type { Localizacao, TipoAmbiente } from "./enums";

export interface Ambiente {
  id: string;
  codigo: string;
  nome: string;
  capacidade: number;
  localizacao: Localizacao;
  tipo: TipoAmbiente;
  precisaReserva: boolean;
}
