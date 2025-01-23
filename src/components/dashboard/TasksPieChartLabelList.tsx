import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

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


export function TasksPieChartLabelList() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Label List</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="visitors" hideLabel />}
                        />
                        <Pie data={chartData} dataKey="tasks">
                            <LabelList
                                dataKey="status"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
