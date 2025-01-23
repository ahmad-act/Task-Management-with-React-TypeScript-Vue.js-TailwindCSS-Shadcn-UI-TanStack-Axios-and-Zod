import { Button } from './components/ui/button';
import { useTheme } from './ThemeProvider';


export function ThemeToggle() {
    const { theme, toggleTheme }: any = useTheme();

    return (
        <div className="p-4 flex justify-center">
            <Button variant="ghost" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
            </Button>
        </div>
    );
}
