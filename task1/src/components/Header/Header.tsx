
import { SidebarTrigger } from '@/components/ui/sidebar';
import FullscreenButton from "../FullscreenButton/FullscreenButton";
import ToggleTheme from '../ToggleTheme/ToggleTheme';
import AvatarProfile from '../AvatarProfile/AvatarProfile';

export default function Header() {

    return (
        <header className=" w-full p-4 bg-gray-800 text-white flex justify-between items-center">
            <div>
                <SidebarTrigger />
            </div>
            <div className='flex gap-1.5'>
                <FullscreenButton />
                <ToggleTheme />
                <AvatarProfile />
            </div>
        </header>
    )
}
