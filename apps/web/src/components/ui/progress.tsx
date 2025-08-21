import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";
import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
	variant?: "linear" | "circular";
	/** Só para o circular */
	size?: number; // px
	strokeWidth?: number; // px
	showLabel?: boolean;
	formatLabel?: (progressValue: number) => React.ReactNode;
};

const MAX_PROGRESS = 100;

export function Progress({
	className,
	value,
	variant = "linear",
	size = 120,
	strokeWidth = 10,
	showLabel = true,
	formatLabel = (progressValue) => `${Math.round(progressValue)}%`,
	...props
}: ProgressProps) {
	const progressValue = Math.max(0, Math.min(MAX_PROGRESS, value ?? 0));

	if (variant === "linear") {
		return (
			<ProgressPrimitive.Root
				className={cn(
					"relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
					className
				)}
				data-slot="progress"
				{...props}
			>
				<ProgressPrimitive.Indicator
					className="h-full w-full flex-1 bg-primary transition-all"
					data-slot="progress-indicator"
					style={{ transform: `translateX(-${MAX_PROGRESS - progressValue}%)` }}
				/>
			</ProgressPrimitive.Root>
		);
	}

	// --- Variante circular ---
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const PERCENT_BASE = 100;
	const strokeOffset = circumference * (1 - progressValue / PERCENT_BASE);
	const center = size / 2;

	return (
		<div
			aria-valuemax={100}
			aria-valuemin={0}
			aria-valuenow={progressValue}
			className={cn("relative inline-grid place-items-center", className)}
			role="progressbar"
			style={{ width: size, height: size }}
			{...props}
		>
			<svg
				className="rotate-[-90deg]"
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				width={size}
			>
				<title>{`Progresso: ${formatLabel(progressValue)}`}</title>
				{/* trilho */}
				<circle
					className="text-primary/20"
					cx={center}
					cy={center}
					fill="none"
					r={radius}
					stroke="currentColor"
					strokeWidth={strokeWidth}
				/>
				{/* indicador */}
				<circle
					className="text-primary transition-[stroke-dashoffset] duration-500 ease-out"
					cx={center}
					cy={center}
					fill="none"
					r={radius}
					stroke="currentColor"
					strokeDasharray={circumference}
					strokeDashoffset={strokeOffset}
					strokeLinecap="round"
					strokeWidth={strokeWidth}
				/>
			</svg>

			{showLabel && (
				<span className="absolute inset-0 grid rotate-0 place-items-center font-bold text-foreground text-xl">
					{formatLabel(progressValue)}
				</span>
			)}
		</div>
	);
}
