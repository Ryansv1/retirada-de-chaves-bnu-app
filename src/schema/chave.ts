import z from "zod";

export const RetiradaChaveSchema = z.object({
	matricula: z
		.string()
		.min(8, "Digite uma matricula de 8 digitos no mínimo")
		.max(11, "Matrícula não pode ser maior que 11 dígitos"),
});

export const DevolucaoChaveSchema = RetiradaChaveSchema;

export type IRetiradaData = z.infer<typeof RetiradaChaveSchema>;
export type IDevolucaoData = z.infer<typeof DevolucaoChaveSchema>;
