import React, { useState } from "react";
import { Maximize, Minimize } from "lucide-react";  // Import icons from Lucide React
import { Button } from "../ui/button";
// Type for FullscreenButton component props (optional if you want to customize later)
interface FullscreenButtonProps {
    // You can add more props here if needed
}

// FullscreenButton Component
const FullscreenButton: React.FC<FullscreenButtonProps> = () => {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false); // Track fullscreen state

    const toggleFullscreen = (): void => {
        if (!isFullscreen) {
            // Request fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
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
