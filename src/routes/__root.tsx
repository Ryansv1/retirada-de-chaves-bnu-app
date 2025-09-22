import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Toaster } from "@/components/ui/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { HelpCircle } from "lucide-react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<>
			<Outlet />
			{/** Card de ajuda */}
			<div className="absolute bottom-4 left-4">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant={"outline"} className="rounded-full">
							<HelpCircle />
							Ajuda
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start">
						<div className="flex flex-col gap-2">
							<h1 className="font-bold text-lg">Precisa de ajuda?</h1>
							<h2 className="text-md">Entre em contato em:</h2>
							<div className="text-sm text-primary font-semibold">
								<a href="mailto:ti-bnu@contato.ufsc.br">
									E-mail: ti-bnu@contato.ufsc.br
								</a>
								<p>Ramal: 3388</p>
								<p>Sala: B315</p>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<TanStackRouterDevtools />
			<ReactQueryDevtools />
			<Toaster />
		</>
	),
});
