import z from "zod";

export const SignUpSchema = z.object({
	name: z.string().nonempty(),
	email: z.email(),
	password: z
		.string()
		.min(6, "Mínimo de 6 caracteres")
		.nonempty("Não deve estar vazia.")
		.trim(),
});

export const SignInSchema = z.object({
	email: z.email(),
	password: z.string().nonempty("Não deve estar vazia."),
});

export type ISignInData = z.infer<typeof SignInSchema>;
export type ISignupData = z.infer<typeof SignUpSchema>;
