import { useState } from "react";
import { useProjectCreate, useProjectUpdate } from "@/features/project-management";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert } from "../ui/alert";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ProjectFormDataSchema } from "@/schemas/projectSchema";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useWorkspaceFind } from "@/features/workspace-management";
import { WorkspaceListType } from "@/schemas/workspaceSchema";

interface ProjectFormProps {
    title: string;
    selectedData?: ProjectFormDataSchema;
    onCancel: () => void;
}

export function ProjectForm(
    {
        title,
        selectedData: updatedData,
        onCancel
    }: ProjectFormProps) {
    const { theme } = useTheme();
    const { mutate: createProject, isError: createError, message: createMessage } = useProjectCreate();
    const { mutate: updateProject, isError: updateError, message: updateMessage } = useProjectUpdate();

    const { isPending, data: responseData, error }: { isPending: boolean; data: WorkspaceListType; error: any } = useWorkspaceFind(
        {
            searchTerm: '',
            page: 1,
            pageSize: 100000,
            sortColumn: 'name',
            sortOrder: 'asc',
        }
    );
    console.log("🚀 ~ file: ProjectForm.tsx:38 ~ responseData:", responseData)

    const [formData, setUpdatedDataLocal] = useState<ProjectFormDataSchema>({
        id: updatedData?.id || "",
        name: updatedData?.name || "",
        description: updatedData?.description || "",
        status: updatedData?.status || "",
        workspaceId: updatedData?.workspaceId || "",
        workspace: updatedData?.workspace,
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
            updateProject(
                {
                    dataId: { id: formData.id },
                    data: {
                        name: formData.name,
                        description: formData.description,
                        status: formData.status,
                        workspaceId: formData.workspaceId,
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
            createProject(
                {
                    name: formData.name,
                    description: formData.description,
                    status: formData.status,
                    workspaceId: formData.workspaceId,
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
                {formData.id ? "Update Project" : "Create Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                        Project Name:
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

                {/* Workspace Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="workspaceId">
                        Workspace:
                    </label>

                    <Select
                        name="workspaceId"
                        value={formData.workspaceId}
                        onValueChange={(selectedValue: string) => {
                            setUpdatedDataLocal((prev) => ({
                                ...prev,
                                workspaceId: selectedValue, // Update workspaceId with the selected value
                            }));
                        }}
                        required
                    >
                        <SelectTrigger >
                            {formData.workspaceId
                                ? responseData.items.find(item => item.id === formData.workspaceId)?.name
                                : "Select a workspace"}
                        </SelectTrigger>

                        <SelectContent>
                            {/* Placeholder Item with empty string value */}
                            <SelectItem value="-" disabled>
                                Select a workspace
                            </SelectItem>

                            {/* Workspace items - each with a non-empty value */}
                            {responseData.items.map((workspace) => (
                                <SelectItem key={workspace.id} value={workspace.id}>
                                    {workspace.name}
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
                        {formData.id ? "Update Project" : "Create Project"}
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
