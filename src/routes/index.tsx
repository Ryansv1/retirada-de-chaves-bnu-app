import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import bgUrl from "@/assets/images/login-page.jpg";
import { getSession } from "@/lib/auth";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import logoUrl from "@/assets/images/logo_horizontal.png";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (session.data?.session) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	return (
		<main className="relative flex items-center justify-start min-h-screen w-full overflow-hidden font-inter">
			<img
				src={bgUrl}
				className="absolute inset-0 z-0 h-full w-full object-cover brightness-50 "
			/>
			<Card className="mx-auto my-auto relative z-10 w-full max-w-md ml-28 p-8 backdrop-blur-sm shadow-xl rounded-xl">
				<CardHeader>
					<img src={logoUrl} className="mb-10  w-sm place-self-center" />
					<CardTitle className="text-center text-lg">
						Sistema de Retirada de Chaves
					</CardTitle>
					<CardDescription className="text-center">
						Clique para acessar o sistema.
					</CardDescription>
				</CardHeader>
				<Button
					onClick={() =>
						navigate({
							to: "/signIn",
							from: Route.fullPath,
						})
					}
				>
					Acessar
				</Button>
			</Card>
		</main>
	);
}
