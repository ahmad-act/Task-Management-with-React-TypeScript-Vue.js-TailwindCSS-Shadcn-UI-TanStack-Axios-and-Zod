import { useState } from "react";
import { useAppUserCreate, useAppUserUpdate } from "@/features/appuser-management";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert } from "../ui/alert";
import { useTheme } from "@/components/theme/ThemeProvider";
import { AppUserFormDataType } from "@/schemas/appUserSchema";
import { toast } from "@/hooks/use-toast";

interface AppUserFormProps {
    title: string;
    selectedData?: AppUserFormDataType;
    onCancel: () => void;
}

export function AppUserForm(
    {
        title,
        selectedData: updatedData,
        onCancel
    }: AppUserFormProps) {
    const { theme } = useTheme();
    //const { toast } = useToast();
    const { mutate: createAppUser, isError: createError, message: createMessage } = useAppUserCreate();
    const { mutate: updateAppUser, isError: updateError, message: updateMessage } = useAppUserUpdate();

    const [formData, setUpdatedDataLocal] = useState<AppUserFormDataType>({
        id: updatedData?.id || "",
        userName: updatedData?.userName || "",
        password: updatedData?.password || "",
        email: updatedData?.email || "",
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
            updateAppUser(
                {
                    dataId: { id: formData.id },
                    data: {
                        userName: formData.userName,
                        password: formData.password,
                        email: formData.email,
                        userDataAccessLevel: formData.userDataAccessLevel ?? 0
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
            createAppUser(
                {
                    userName: formData.userName,
                    password: formData.password,
                    email: formData.email,
                    userDataAccessLevel: formData.userDataAccessLevel ?? 0
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
                {formData.id ? "Update AppUser" : "Create AppUser"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="userName">
                        Username:
                    </label>
                    <Input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                        Email:
                    </label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                        Password:
                    </label>
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
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
                        {formData.id ? "Update AppUser" : "Create AppUser"}
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
