import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import React from "react"

const chartData = [
    { status: "todo", tasks: 275, fill: "var(--color-todo)" },
    { status: "inprogress", tasks: 200, fill: "var(--color-inprogress)" },
    { status: "done", tasks: 287, fill: "var(--color-done)" },
]

const chartConfig = {
    visitors: {
        label: "Tasks",
    },
    todo: {
        label: "todo",
        color: "hsl(var(--chart-1))",
    },
    inprogress: {
        label: "inprogress",
        color: "hsl(var(--chart-2))",
    },
    done: {
        label: "done",
        color: "hsl(var(--chart-3))",
    },

} satisfies ChartConfig

export function TasksPieChart() {
    const totalTasks = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.tasks, 0)
    }, [])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Tasks Overview</CardTitle>
                <CardDescription>January - June 2025</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="tasks"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalTasks.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Tasks
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Increasing up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total tasks for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
