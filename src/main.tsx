import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme/ThemeProvider.tsx';
import { Toaster } from './components/ui/toaster.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <App />
            <Toaster />
        </ThemeProvider>
    </StrictMode>
)
