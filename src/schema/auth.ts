import z from "zod";

export const SignUpSchema = z.object({
	name: z.string().nonempty(),
	email: z.email(),
	password: z
		.string()
		.min(8, "Mínimo de 8 caracteres")
		.nonempty("Não deve estar vazia.")
		.trim(),
});

export const SignInSchema = z.object({
	email: z.email(),
	password: z.string().nonempty("Não deve estar vazia."),
});

export type ISignInData = z.infer<typeof SignInSchema>;
export type ISignupData = z.infer<typeof SignUpSchema>;
