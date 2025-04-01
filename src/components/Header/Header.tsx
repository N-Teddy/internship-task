// src/components/Header/Header.tsx
"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import FullscreenButton from "../FullscreenButton/FullscreenButton";
import ToggleTheme from '../ToggleTheme/ToggleTheme';
import AvatarProfile from '../AvatarProfile/AvatarProfile';

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="h-9 w-9 p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors" />
                </div>

                <div className="flex items-center gap-2">
                    <FullscreenButton className="h-9 w-9 p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors" />
                    <ToggleTheme className="h-9 w-9 p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors" />
                    <AvatarProfile className="h-8 w-8 border-2 border-transparent hover:border-primary rounded-full transition-all" />
                </div>
            </div>
        </header>
    )
}