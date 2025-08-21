import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
