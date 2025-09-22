import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./context/theme.context";
import { toast } from "sonner";
import { handleApiError } from "./lib/api-error";

const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onSuccess: () => {
				toast.success("Sucesso!");
			},
			onError: (err) => {
				const msg = handleApiError(err);
				toast.error("Ocorreu um erro", {
					description: msg.message,
				});
			},
		},
	},
});

const router = createRouter({
	routeTree,
	context: {
		queryClient: queryClient,
	},
});

const Providers = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="system">
				<RouterProvider router={router} />
			</ThemeProvider>
		</QueryClientProvider>
	);
};

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Providers />
	</StrictMode>
);
