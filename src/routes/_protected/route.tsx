import { getSession } from "@/lib/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppTopbar } from "@/components/bars/app-topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/bars/app-sidebar";

export const Route = createFileRoute("/_protected")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session.data?.session) {
			throw redirect({
				to: "/signIn",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SidebarProvider>
			<div className="flex h-screen w-full overflow-hidden bg-background font-inter">
				<AppSidebar />
				<div className="flex flex-1 flex-col overflow-hidden">
					<AppTopbar />
					<main className="flex-1 overflow-auto p-6">
						<Outlet />
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
