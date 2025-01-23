import { createContext, useContext, ReactNode, useMemo, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useAppUserFindOne } from "@/features/appuser-management";
import { AppUserType } from "@/schemas/appUserSchema";

type AuthContextType = {
    user: AppUserType | null;
    isAuthenticated: boolean;
    isLoading: boolean | null;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    logout: () => { },
});

const getCookie = (key: string) => {
    console.log("🚀 ~ file: auth-context.tsx:21 ~ getCookie ~ key:", key)
    const match = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    console.log("🚀 ~ file: auth-context.tsx:23 ~ getCookie ~ match:", match)
    return match ? match.pop() : "";
};

const deleteCookie = (key: string) => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀AuthProvider🚀🚀🚀🚀🚀🚀🚀🚀")
    const userRef = useRef<AppUserType | null>(null);
    //const isPendingRef = useRef<boolean>(false);

    const token = getCookie('authToken');
    console.log("🚀 ~ file: auth-context.tsx:35 ~ AuthProvider ~ token:", token)

    const id = useMemo(() => {
        if (!token) return null; // Handle the case where the token is not available

        try {
            const decodedToken: any = jwtDecode(token);
            return decodedToken["unique_name"];
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }

    }, [token]);

    console.log("🚀 ~ file: auth-context.tsx:63 ~ AuthProvider ~ id:", id)

    const { isPending, data: responseData, error }: { isPending: boolean; data: AppUserType; error: any } = useAppUserFindOne({ id });
    console.log("🚀 ~ file: auth-context.tsx:66 ~ AuthProvider ~ error:", error)
    console.log("🚀 ~ file: auth-context.tsx:66 ~ AuthProvider ~ responseData:", responseData)
    console.log("🚀 ~ file: auth-context.tsx:66 ~ AuthProvider ~ isPending:", isPending)

    //isPendingRef.current = isPending;

    if (!isPending && !error) {

        userRef.current = responseData.appUser == null ? null : responseData;
        //isPendingRef.current = false;
    }

    else if (error) {
        userRef.current = null;
        //isPendingRef.current = false;
    }

    const logout = () => {
        deleteCookie("authToken");
        responseData.appUser = null;
        userRef.current = null;
        console.log("🚀 ~ 🚀🚀🚀🚀🚀 logout ~ userRef.current:", userRef.current)
        window.location.href = "/login";
    };

    const value: AuthContextType = {
        user: userRef.current,
        isAuthenticated: !!userRef.current,
        isLoading: isPending,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
