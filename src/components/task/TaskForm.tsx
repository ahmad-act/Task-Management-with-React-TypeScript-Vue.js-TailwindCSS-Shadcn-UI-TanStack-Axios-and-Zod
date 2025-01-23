import { useState } from "react";
import { useTaskCreate, useTaskUpdate } from "@/features/task-management";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert } from "../ui/alert";
import { useTheme } from "@/components/theme/ThemeProvider";
import { TaskFormDataSchema } from "@/schemas/taskSchema";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { TaskListType } from "@/schemas/taskSchema";
import { useProjectFind } from "@/features/project-management";

interface TaskFormProps {
    title: string;
    selectedData?: TaskFormDataSchema;
    onCancel: () => void;
}

export function TaskForm(
    {
        title,
        selectedData: updatedData,
        onCancel
    }: TaskFormProps) {
    const { theme } = useTheme();
    const { mutate: createTask, isError: createError, message: createMessage } = useTaskCreate();
    const { mutate: updateTask, isError: updateError, message: updateMessage } = useTaskUpdate();

    const { isPending, data: responseData, error }: { isPending: boolean; data: TaskListType; error: any } = useProjectFind(
        {
            searchTerm: '',
            page: 1,
            pageSize: 100000,
            sortColumn: 'name',
            sortOrder: 'asc',
        }
    );
    console.log("🚀 ~ file: TaskForm.tsx:38 ~ responseData:", responseData)

    const [formData, setUpdatedDataLocal] = useState<TaskFormDataSchema>({
        id: updatedData?.id || "",
        name: updatedData?.name || "",
        description: updatedData?.description || "",
        status: updatedData?.status || "",
        projectId: updatedData?.projectId || "",
        project: updatedData?.project,
        userDataAccessLevel: updatedData?.userDataAccessLevel || 0
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setUpdatedDataLocal({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (formData.id) {
            // Trigger the update mutation
            updateTask(
                {
                    dataId: { id: formData.id },
                    data: {
                        name: formData.name,
                        description: formData.description,
                        status: formData.status,
                        projectId: formData.projectId,
                        userDataAccessLevel: 0
                    }
                },
                {
                    onSuccess: () => {
                        setSuccessMessage(`${title} updated successfully!`);
                        onCancel();

                        toast({
                            title: `${title} updated successfully!`,
                            //description: `${title} updated successfully!`,
                        })
                    },
                }
            );
        } else {
            // Trigger the create mutation
            createTask(
                {
                    name: formData.name,
                    description: formData.description,
                    status: formData.status,
                    projectId: formData.projectId,
                    userDataAccessLevel: 0
                },
                {
                    onSuccess: () => {
                        setSuccessMessage(`${title} created successfully!`);
                        onCancel();

                        toast({
                            title: `${title} created successfully!`,
                            //description: `${title} created successfully!`,
                        })
                    },
                });
        }
    };

    const themeClasses = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black';

    return (
        <div className={`space-y-6 max-w-md mx-auto p-6 shadow-md rounded-lg ${themeClasses}`}>
            <h2 className="text-2xl font-semibold text-center">
                {formData.id ? "Update Task" : "Create Task"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                        Task Name:
                    </label>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                        Description:
                    </label>
                    <Input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="status">
                        Status:
                    </label>
                    <Input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
                </div>

                {/* Task Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="projectId">
                        Project:
                    </label>

                    <Select
                        name="projectId"
                        value={formData.projectId}
                        onValueChange={(selectedValue: string) => {
                            setUpdatedDataLocal((prev) => ({
                                ...prev,
                                projectId: selectedValue, // Update projectId with the selected value
                            }));
                        }}
                        required
                    >
                        <SelectTrigger >
                            {formData.projectId
                                ? responseData.items.find(item => item.id === formData.projectId)?.name
                                : "Select a project"}
                        </SelectTrigger>

                        <SelectContent>
                            {/* Placeholder Item with empty string value */}
                            <SelectItem value="-" disabled>
                                Select a task
                            </SelectItem>

                            {/* Task items - each with a non-empty value */}
                            {responseData.items.map((task) => (
                                <SelectItem key={task.id} value={task.id}>
                                    {task.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex space-x-4">
                    <Button
                        type="button"
                        onClick={onCancel}
                        className={`flex-1 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className={`flex-1 py-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        {formData.id ? "Update Task" : "Create Task"}
                    </Button>
                </div>
            </form>

            {/* Success Message */}
            {successMessage && (
                <Alert
                    className={`mt-4 ${theme === 'dark' ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800'
                        }`}
                    variant="default"
                >
                    {successMessage}
                </Alert>
            )}

            {/* Error Message */}
            {(createError || updateError) && (
                <Alert
                    className={`mt-4 ${theme === 'dark' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-800'
                        }`}
                    variant="destructive"
                >
                    {createMessage || updateMessage}
                </Alert>
            )}
        </div>
    );
}
