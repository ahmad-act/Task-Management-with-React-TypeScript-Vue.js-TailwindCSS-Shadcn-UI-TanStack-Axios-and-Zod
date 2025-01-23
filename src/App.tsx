import './App.css'
import LoginPage from './app/login/page';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoutes from './components/auth/protected-routes';
import { AuthProvider } from './components/auth/auth-context';
import WorkspacePage from './app/workspaces/page';
import ProjectPage from './app/projects/page';
import IssuePage from './app/issues/page';
import TaskPage from './app/tasks/page';
import KanbanBoardPage from './app/kanban-board/page';
import DashboardPage from './app/dashboard/page';
import AppUserPage from './app/app-user/page';

const queryClient = new QueryClient()

function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<ProtectedRoutes />} >
                            <Route index element={<DashboardPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/kanban-board" element={<KanbanBoardPage />} />
                            <Route path="/workspaces" element={<WorkspacePage />} />
                            <Route path="/projects" element={<ProjectPage />} />
                            <Route path="/issues" element={<IssuePage />} />
                            <Route path="/tasks" element={<TaskPage />} />
                            <Route path="/app-user" element={<AppUserPage />} />
                        </Route>

                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </BrowserRouter >
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App
