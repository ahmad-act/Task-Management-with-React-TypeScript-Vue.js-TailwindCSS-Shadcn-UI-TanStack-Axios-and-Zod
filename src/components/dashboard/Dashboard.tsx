import { TasksBarChart } from "./TasksBarChart";
import { TasksPieChart } from "./TasksPieChart";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { TasksPieChartLabelList } from "./TasksPieChartLabelList";

export function Dashboard() {
    return (
        <div className="grid gap-2 md:grid-cols-2"> {/* Reduced gap for smaller spacing */}
            {/* Pie Chart Card */}
            <Card className="flex flex-col p-2 text-sm"> {/* Added smaller padding and font size */}
                <CardHeader className="items-center pb-1"> {/* Adjusted padding */}
                    <CardTitle className="text-base"> {/* Smaller title size */}
                        Tasks Overview (Pie Chart)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                    <TasksPieChart />
                </CardContent>
            </Card>

            {/* Bar Chart Card */}
            <Card className="flex flex-col p-2 text-sm">
                <CardHeader className="items-center pb-1">
                    <CardTitle className="text-base">
                        Tasks Over Time (Bar Chart)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                    <TasksBarChart />
                </CardContent>
            </Card>

            {/* Pie Chart Card */}
            <Card className="flex flex-col p-2 text-sm">
                <CardHeader className="items-center pb-1">
                    <CardTitle className="text-base">
                        Tasks Distribution (Pie Chart)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                    <TasksPieChartLabelList />
                </CardContent>
            </Card>
        </div>
    );
}
