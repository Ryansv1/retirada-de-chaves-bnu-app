import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	EmprestimoAdministrativoSchema,
	type IEmprestimoAdministrativo,
} from "@/schema/chave";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import {
	BrushCleaningIcon,
	CalendarIcon,
	InfoIcon,
	SaveIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useId } from "react";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { getChaves } from "@/services/chaves";
import { CHAVES_QUERY_KEY } from "..";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { gerarEmprestimoAdministrativo } from "@/services/emprestimos";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api-error";

export const Route = createFileRoute(
	"/_protected/emprestimos/emprestimo-administrativo/"
)({
	beforeLoad: ({ context }) => {
		const { queryClient } = context;

		queryClient.prefetchQuery({
			queryKey: [CHAVES_QUERY_KEY],
			queryFn: () => getChaves({}),
		});
	},
	component: RouteComponent,
});

function useGerarEmprestimoAdministrativo() {
	const { queryClient } = Route.useRouteContext();
	return useMutation({
		mutationKey: ["emprestimo-administrativo"],
		mutationFn: (data: IEmprestimoAdministrativo) =>
			gerarEmprestimoAdministrativo(data),
		onSuccess: () => {
			toast.success("Sucesso!");
			queryClient.invalidateQueries({
				queryKey: [CHAVES_QUERY_KEY],
			});
		},
		onError: (err) => {
			const msg = handleApiError(err);
			toast.error("err", {
				description: msg.message,
			});
		},
	});
}

function useChaves() {
	return useSuspenseQuery({
		queryKey: [CHAVES_QUERY_KEY],
		queryFn: () => getChaves({}),
	});
}

function RouteComponent() {
	const { data: chaves, isError: chavesError } = useChaves();
	const gerarEmprestimoAdministrativo = useGerarEmprestimoAdministrativo();
	const form = useForm({
		resolver: zodResolver(EmprestimoAdministrativoSchema),
		defaultValues: {
			dataRetirada: DateTime.now().toISO(),
			justificativa: "",
			status: "DEVOLVIDO",
		},
	});

	useEffect(() => {
		console.log(form.getValues());
	});

	const onSubmit = async (data: IEmprestimoAdministrativo) => {
		return await gerarEmprestimoAdministrativo.mutateAsync(data);
	};

	return (
		<div className="container mx-auto">
			<h1 className="text-2xl font-bold">Empréstimo Administrativo</h1>
			<Alert className="bg-amber-500/20 text-amber-500 border-amber-500 my-4 ">
				<InfoIcon />
				<AlertTitle className="font-bold">Você tem certeza?</AlertTitle>
				<AlertDescription>
					<p className="text-sm text-muted-foreground">
						Esses empréstimos somente são válidos em momentos em que o sistema
						estava inoperante/inacessível, ou que o operador não teve acesso ao
						sistema para realizar o lançamento das retiradas de chaves.
						Portanto, os mesmos vão precisar de uma justificativa.
					</p>
				</AlertDescription>
			</Alert>

			<Card>
				<CardHeader>
					<CardTitle>Formulário de Empréstimo Administrativo</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="chaveId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Chave</FormLabel>
										<Select onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecione uma Chave" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{chaves &&
													!chavesError &&
													chaves.map((chave) => (
														<SelectItem value={chave.id}>
															{chave.Ambiente?.codigo ?? chave.Armario?.codigo}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex flex-col gap-4">
								<div>
									<FormField
										control={form.control}
										name="dataRetirada"
										render={({ field }) => {
											const id = useId();
											const selectedDateTime = field.value
												? DateTime.fromISO(field.value)
												: null;

											return (
												<FormItem>
													<FormLabel>Data da retirada</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={"outline"}
																	className="w-full justify-start text-left font-normal"
																>
																	{selectedDateTime ? (
																		selectedDateTime.toFormat(
																			"dd/MM/yyyy HH:mm"
																		)
																	) : (
																		<span>Selecione data e hora</span>
																	)}
																	<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent className="w-auto p-0">
															<Calendar
																mode="single"
																selected={
																	selectedDateTime
																		? selectedDateTime.toJSDate()
																		: undefined
																}
																onSelect={(date) => {
																	if (!date) {
																		field.onChange("");
																		return;
																	}

																	const newDate = DateTime.fromJSDate(date).set(
																		{
																			hour: selectedDateTime?.hour || 0,
																			minute: selectedDateTime?.minute || 0,
																		}
																	);
																	// Garante formato ISO correto com timezone
																	field.onChange(
																		newDate.toISO({ includeOffset: false })
																	);
																}}
															/>
															<div className="border-t p-3">
																<div className="flex items-center gap-3">
																	<Label htmlFor={id} className="text-xs">
																		Hora
																	</Label>
																	<div className="relative grow">
																		<Input
																			id={id}
																			type="time"
																			min={"00:00"}
																			max={"23:59"}
																			value={
																				selectedDateTime
																					? selectedDateTime.toFormat("HH:mm")
																					: ""
																			}
																			onChange={(e) => {
																				const time = e.target.value;
																				if (!time) return;

																				const [hour, minute] = time
																					.split(":")
																					.map(Number);

																				const newDateTime = (
																					selectedDateTime || DateTime.now()
																				).set({
																					hour,
																					minute,
																				});

																				// Garante formato ISO correto com timezone
																				field.onChange(
																					newDateTime.toISO({
																						includeOffset: false,
																					})
																				);
																			}}
																		/>
																	</div>
																</div>
															</div>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								</div>
								<div>
									<FormField
										control={form.control}
										name="status"
										render={({ field }) => (
											<FormItem className="flex flex-row gap-2 items-center">
												<FormLabel>O empréstimo já está devolvido?</FormLabel>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger>
														<SelectValue>
															{field.value === "DEVOLVIDO"
																? "Devolvido"
																: "Pendente"}
														</SelectValue>
													</SelectTrigger>
													<SelectContent>
														<SelectItem value={"DEVOLVIDO"}>
															Devolvido
														</SelectItem>
														<SelectItem value="PENDENTE">Pendente</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								{form.watch("status") === "DEVOLVIDO" && (
									<FormField
										control={form.control}
										name="dataRetorno"
										render={({ field }) => {
											const id = useId();
											const selectedDateTime = field.value
												? DateTime.fromISO(field.value)
												: null;

											return (
												<FormItem>
													<FormLabel>Data da retirada</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={"outline"}
																	className="w-full justify-start text-left font-normal"
																>
																	{selectedDateTime ? (
																		selectedDateTime.toFormat(
																			"dd/MM/yyyy HH:mm"
																		)
																	) : (
																		<span>Selecione data e hora</span>
																	)}
																	<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent className="w-auto p-0">
															<Calendar
																mode="single"
																selected={
																	selectedDateTime
																		? selectedDateTime.toJSDate()
																		: undefined
																}
																onSelect={(date) => {
																	if (!date) {
																		field.onChange("");
																		return;
																	}

																	const newDate = DateTime.fromJSDate(date).set(
																		{
																			hour: selectedDateTime?.hour || 0,
																			minute: selectedDateTime?.minute || 0,
																		}
																	);
																	// Garante formato ISO correto com timezone
																	field.onChange(
																		newDate.toISO({ includeOffset: false })
																	);
																}}
															/>
															<div className="border-t p-3">
																<div className="flex items-center gap-3">
																	<Label htmlFor={id} className="text-xs">
																		Hora
																	</Label>
																	<div className="relative grow">
																		<Input
																			id={id}
																			type="time"
																			min={"00:00"}
																			max={"23:59"}
																			value={
																				selectedDateTime
																					? selectedDateTime.toFormat("HH:mm")
																					: ""
																			}
																			onChange={(e) => {
																				const time = e.target.value;
																				if (!time) return;

																				const [hour, minute] = time
																					.split(":")
																					.map(Number);

																				const newDateTime = (
																					selectedDateTime || DateTime.now()
																				).set({
																					hour,
																					minute,
																				});

																				// Garante formato ISO correto com timezone
																				field.onChange(
																					newDateTime.toISO({
																						includeOffset: false,
																					})
																				);
																			}}
																		/>
																	</div>
																</div>
															</div>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								)}
							</div>
							<div>
								<FormField
									control={form.control}
									name="justificativa"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Justificativa</FormLabel>
											<FormControl>
												<Textarea {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex flex-row items-center gap-2 place-self-end">
								<Button variant={"outline"} onClick={() => form.reset()}>
									<BrushCleaningIcon />
									Limpar Formulário
								</Button>
								<Button variant={"default"}>
									<SaveIcon />
									Salvar
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
