import z from "zod";

export const RetiradaChaveSchema = z.object({
	matricula: z
		.string()
		.min(7, "Digite uma matricula de 7 digitos no mínimo")
		.max(11, "Matrícula não pode ser maior que 11 dígitos"),
});

export const DevolucaoChaveSchema = RetiradaChaveSchema;

export const EmprestimoAdministrativoSchema = z
	.object({
		chaveId: z.string().uuid("Selecione uma chave."),
		justificativa: z.string().min(10, "Justificativa é obrigatória"),

		// Validação mais flexível que aceita string ISO e converte
		dataRetirada: z.iso.datetime({
			local: true,
			precision: 3,
			offset: true,
			message: "Data de retirada inválida",
		}),

		status: z.enum(["PENDENTE", "DEVOLVIDO"]),

		// Opcional e nullable para lidar com casos onde não há data
		dataRetorno: z.iso
			.datetime({
				local: true,
				precision: 3,
				offset: true,
				message: "Data de retorno inválida",
			})
			.optional()
			.nullable(),
	})
	.refine(
		(data) => {
			// Se o status é DEVOLVIDO, deve ter data de retorno
			if (data.status === "DEVOLVIDO" && !data.dataRetorno) {
				return false;
			}
			return true;
		},
		{
			message:
				"Data de retorno é obrigatória quando o empréstimo está devolvido.",
			path: ["dataRetorno"],
		}
	)
	.refine(
		(data) => {
			// Se tem data de retorno, ela deve ser depois da data de retirada
			if (data.dataRetorno && data.dataRetirada) {
				const retirada = new Date(data.dataRetirada);
				const retorno = new Date(data.dataRetorno);
				return retorno >= retirada;
			}
			return true;
		},
		{
			message: "Data de retorno deve ser posterior à data de retirada.",
			path: ["dataRetorno"],
		}
	);

export type IEmprestimoAdministrativo = z.infer<
	typeof EmprestimoAdministrativoSchema
>;
export type IRetiradaData = z.infer<typeof RetiradaChaveSchema>;
export type IDevolucaoData = z.infer<typeof DevolucaoChaveSchema>;
