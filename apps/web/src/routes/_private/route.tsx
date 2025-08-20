import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
	component: RouteComponent,
	beforeLoad: async () => {
		const { useAuth } = await import("../../hooks/auth");
		const auth = useAuth();

		if (!auth.isAuthenticated) {
			throw redirect({ to: "/" });
		}
	},
});

function RouteComponent() {
	return <Outlet />;
}
