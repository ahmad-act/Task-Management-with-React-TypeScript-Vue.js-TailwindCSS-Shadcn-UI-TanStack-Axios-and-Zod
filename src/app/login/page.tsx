import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { SignUpForm } from "@/components/auth/signup-form";
import { useAuth } from "@/components/auth/auth-context";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        navigate("/");
    }

    // State to toggle between login and sign-up forms
    const [isLoginPage, setIsLoginPage] = useState<boolean>(true);

    return (
        <>
            {isLoginPage ? (
                <LoginForm setIsLoginPage={setIsLoginPage} />
            ) : (

                <SignUpForm setIsLoginPage={setIsLoginPage} />
            )}
        </>
    );
}
