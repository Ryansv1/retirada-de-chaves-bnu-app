import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const { useSession, signIn, signOut, signUp, getSession } =
	createAuthClient({
		plugins: [
			inferAdditionalFields({
				user: {
					role: {
						input: false,
						type: "string",
					},
				},
			}),
		],
		baseURL: import.meta.env.VITE_API_URL,
		basePath: import.meta.env.VITE_API_BASE_PATH,
	});
