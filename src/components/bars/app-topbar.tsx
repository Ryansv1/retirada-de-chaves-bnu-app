import { LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { DateTime } from "luxon";
import { useTheme } from "@/context/theme.context";
import { useSession, signOut } from "@/lib/auth";
import { Skeleton } from "../ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function AppTopbar() {
	const navigate = useNavigate();
	const { setTheme } = useTheme();
	const { data, isPending } = useSession();

	async function logout() {
		const { data, error } = await signOut();
		if (data) {
			toast.success("Sucesso ao sair");
			return navigate({
				to: "/signIn",
				replace: true,
			});
		}
		if (error) {
			toast.error("Ocorreu um erro. Tente novamente", {
				description: error.message,
			});
			return;
		}
	}

	return (
		<header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="md:hidden" />

				<span className="text-xs text-muted-foreground">
					{DateTime.now().toFormat("DDDD, HH:mm", { locale: "pt-BR" })}
				</span>
			</div>

			<div className="flex items-center gap-4">
				{isPending ? (
					<Skeleton className="w-20 h-6" />
				) : (
					<span className="text-xs text-primary font-bold">
						Autenticado como: {data?.user.name} - {data?.user.email}
					</span>
				)}

				<TooltipProvider>
					<Tooltip>
						<DropdownMenu>
							<TooltipTrigger asChild>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-700 dark:-rotate-90 dark:scale-0" />
										<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 duration-700 scale-0 transition-all dark:rotate-0 dark:scale-100" />
										<span className="sr-only">Trocar Tema</span>
									</Button>
								</DropdownMenuTrigger>
							</TooltipTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => setTheme("light")}>
									Claro
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("dark")}>
									Escuro
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => setTheme("system")}>
									Sistema
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<TooltipContent>
							<p>Mudar tema</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* <TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="h-5 w-5" />
								<span className="sr-only">Notifications</span>
								<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive animate-pulse"></span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Notificações</TooltipContent>
					</Tooltip>
				</TooltipProvider> */}

				{/* <TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="relative">
								<Settings className="h-5 w-5" />
								<span className="sr-only">Configurações</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Configurações</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider> */}

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant={"ghost"} onClick={logout}>
								<LogOut />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Sair do sistema</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</header>
	);
}
