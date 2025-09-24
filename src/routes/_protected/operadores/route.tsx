import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/auth";
export const Route = createFileRoute("/_protected/operadores")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session || !session.data) {
			throw redirect({
				to: "/signIn",
			});
		}

		if (session.data.user.role !== "ADMIN") {
			throw redirect({
				to: "/emprestimos",
				search: () => ({
					status: "disponivel",
				}),
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
