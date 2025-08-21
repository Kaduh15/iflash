import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	Brain,
	Clock,
	Settings,
	Target,
	TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_private/dashboard/")({
	component: RouteComponent,
});

const WORLDS = [
	{
		id: 1,
		word: "Exemplo",
		translation: "Example",
		date: new Date(),
		emoji: "😎",
	},
	{
		id: 2,
		word: "Teste",
		translation: "Test",
		date: new Date(),
		emoji: "🙂",
	},
	{
		id: 3,
		word: "Aprender",
		translation: "Learn",
		date: new Date(),
		emoji: "😓",
	},
];

function RouteComponent() {
	return (
		<>
			<header className="flex items-center justify-between">
				<div className="flex flex-col">
					<h1 className="font-bold text-3xl">Olá! 👋</h1>
					<p className="text-muted-foreground">Pronto para aprender hoje?</p>
				</div>
				<div className="flex items-center gap-3">
					<Badge
						className="rounded-full px-4 py-2 font-semibold text-md text-white"
						variant="secondary"
					>
						🔥 7 dias
					</Badge>
					<Settings className="mx-4 size-5" />
				</div>
			</header>

			<Card className="flex flex-row justify-between gap-6 bg-card p-6">
				<CardHeader className="flex flex-1 flex-col justify-center gap-2 p-0">
					<h2 className="font-semibold text-foreground text-xl">
						Progresso de Hoje
					</h2>
					<p className="text-muted-foreground">3 de 5 palavras estudadas</p>
					<CardDescription className="flex items-center gap-2 text-chart-1">
						<Target className="size-4" /> Meta diária: 5 Palavras
					</CardDescription>
				</CardHeader>
				<CardContent className="flex items-center justify-center">
					<Progress className="w-10" size={100} value={60} variant="circular" />
				</CardContent>
			</Card>

			<div className="mt-10 flex flex-col items-center gap-4">
				<Link className="w-fit" to="/study">
					<Button className="h-16 w-100 rounded-3xl px-4 py-6 text-xl">
						<Brain /> Estudar Hoje
					</Button>
				</Link>
				<span className="text-muted-foreground text-sm">
					2 palavras restantes
				</span>
			</div>

			<div className="mt-12 flex items-center justify-center gap-6">
				<Card className="flex h-fit w-1/2 flex-col items-center py-4">
					<CardContent className="flex flex-col items-center">
						<p className="font-bold text-2xl text-chart-1">24</p>
						<p className="flex items-center gap-2 text-muted-foreground text-xs">
							<BookOpen className="size-4 text-muted-foreground" />
							Palavras Aprendidas
						</p>
					</CardContent>
				</Card>
				<Card className="flex h-fit w-1/2 flex-col items-center py-4">
					<CardContent className="flex flex-col items-center">
						<p className="font-bold text-2xl text-chart-2">24</p>
						<p className="flex items-center gap-2 text-muted-foreground text-xs">
							<TrendingUp className="size-4 text-muted-foreground" />
							Taxa de Acerto
						</p>
					</CardContent>
				</Card>
			</div>

			<div>
				<Card>
					<CardHeader className="flex items-center justify-between">
						<h2 className="font-semibold text-foreground text-xl">
							Palavras Recentes
						</h2>
						<Link className="text-xs" to="/stats">
							Ver Todas
						</Link>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{WORLDS.map((world) => (
							<div
								className="flex items-center justify-between rounded-lg bg-background p-4"
								key={world.id}
							>
								<div className="flex items-center gap-4">
									<span className="text-xl">😎</span>
									<div className="flex flex-col">
										<span className="font-semibold text-foreground">
											Palavra 1
										</span>
										<span className="text-muted-foreground text-sm">
											Significado 1
										</span>
									</div>
								</div>
								<div className="flex items-center gap-2 text-muted-foreground text-xs">
									<Clock size={12} />
									Revisar em breve
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
