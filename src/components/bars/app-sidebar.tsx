import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { Link } from "@tanstack/react-router";
import {
	ArrowRightLeft,
	ChevronUp,
	LayoutDashboardIcon,
	ListIcon,
	ShieldUser,
	UserRound,
} from "lucide-react";
import { useTheme } from "@/context/theme.context";
import { Separator } from "../ui/separator";
import logoUrl from "@/assets/images/logo_horizontal.png";
import logoDarkUrl from "@/assets/images/logo_dark_horizontal.png";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { theme } = useTheme();

	const navItems = [
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: <LayoutDashboardIcon />,
		},
		{
			label: "Empréstimos",
			href: "/emprestimos",
			icon: <ArrowRightLeft />,
		},
		{
			label: "Listar Empréstimos",
			href: "/listar-emprestimos",
			icon: <ListIcon />,
		},
		{
			label: "Operadores",
			href: "/operadores",
			icon: <ShieldUser />,
		},
	];

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<div className="p-4">
					<img
						key={theme}
						src={theme === "dark" ? logoDarkUrl : logoUrl}
						alt="UFSC - Sistema Administrativo"
					/>
				</div>
			</SidebarHeader>
			<Separator />
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="flex flex-col gap-2">
						{/* <Collapsible
							key={item.title}
							defaultOpen={index === 0}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton className="transition-all duration-200">
										{item.icon}
										<span>{item.title}</span>
										<ChevronUp className="ml-auto group-data-[state=open]/collapsible:rotate-180 duration-200 transition-all" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.children.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton
													asChild
													className="transition-all duration-200"
												>
													<Link to={subItem.href}>{subItem.title}</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible> */}
						{navItems.map((item, index) => (
							<SidebarMenuItem key={index}>
								<SidebarMenuButton
									className="transition-all duration-200 h-12 ring-primary hover:ring-2 [&.active]:bg-primary/30 [&.active]:font-bold  [&.active]:ring-3 "
									asChild
								>
									<Link to={item.href}>
										{item.icon}
										{item.label}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}
