import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginPage from "@/app/login/page";

export function SignUpForm({ setIsLoginPage }: { setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch("https://localhost:7011/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed. Please check your credentials.");
            }

            const result = await response.text();
            console.log("Signup successful:", result);
            <LoginPage />
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className={"flex flex-col gap-6"}>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">Create an account</CardTitle>
                            <CardDescription>Sign up with your details below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignup}>
                                <div className="grid gap-6">
                                    {/* Full Name Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>
                                    {/* Email Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    {/* Password Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    {/* Confirm Password Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            placeholder="Re-enter your password"
                                            required
                                        />
                                    </div>
                                    {error && (
                                        <p className="text-sm text-red-600 text-center">
                                            {error}
                                        </p>
                                    )}
                                    <Button type="submit" className="w-full">
                                        {isSubmitting ? "Logging in..." : "Sign Up"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <button
                                    onClick={() => setIsLoginPage(true)}
                                    className="underline underline-offset-4"
                                >
                                    Login
                                </button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
