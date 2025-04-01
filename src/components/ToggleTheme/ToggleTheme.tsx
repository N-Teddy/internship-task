import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function ToggleTheme() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-accent/50"
                >
                    <Sun className={cn(
                        "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all",
                        theme === "dark" && "-rotate-90 scale-0"
                    )} />
                    <Moon className={cn(
                        "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all",
                        theme === "dark" && "rotate-0 scale-100"
                    )} />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-40"
            >
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className={cn(
                        "flex items-center gap-2",
                        theme === "light" && "bg-accent"
                    )}
                >
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className={cn(
                        "flex items-center gap-2",
                        theme === "dark" && "bg-accent"
                    )}
                >
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className={cn(
                        "flex items-center gap-2",
                        theme === "system" && "bg-accent"
                    )}
                >
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}