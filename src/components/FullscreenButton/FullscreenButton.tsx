import * as React from "react";
import { useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "../ui/button";


interface FullscreenButtonProps {
}

const FullscreenButton: React.FC<FullscreenButtonProps> = function FullscreenButton(): React.ReactElement | null {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const toggleFullscreen = (): void => {
        if (!isFullscreen) {
            // Request fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if ((document.documentElement as any).webkitRequestFullscreen) { // Chrome, Safari
                (document.documentElement as any).webkitRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else {
                console.error("Fullscreen API is not supported by this browser.");
            }
        }
        setIsFullscreen(!isFullscreen); // Toggle fullscreen state
    };

    return (
        <Button
            onClick={toggleFullscreen}
            className="transition-colors"
        >
            {isFullscreen ? (
                <Minimize size={24} /> // Show minimize icon when fullscreen is active
            ) : (
                <Maximize size={24} /> // Show maximize icon when not fullscreen
            )}
        </Button>
    );
}

export default FullscreenButton;
