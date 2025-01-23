import { useAuth } from "@/components/auth/auth-context";

export default function Test() {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading user data...</div>; // Optionally show a loading spinner
    }

    if (!isAuthenticated) {
        return <div>User is not authenticated.</div>;
    }

    return (
        <div>
            <h1>Welcome, {user?.appUser.userName || "User"}!</h1>
            <p>Email: {user?.appUser.email}</p>
            {/* <p>Role: {user?.appUser.role}</p> */}
            {/* Render other user details as needed */}
        </div>
    );
}