import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export default function AvatarProfile() {
	const { user, logout } = useAuth();

	// Capitalize first letter of username
	const capitalizedUsername = user?.username
		? user.username.charAt(0).toUpperCase() + user.username.slice(1)
		: '';

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
					<Avatar className="h-8 w-8 border-2 border-transparent hover:border-primary transition-all">
						<AvatarImage src={user?.image} alt="User avatar" />
						<AvatarFallback className="bg-primary text-primary-foreground">
							{user?.username?.charAt(0).toUpperCase() || 'U'}
						</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{capitalizedUsername}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<a
						href="/profile"
						className="w-full flex items-center gap-2 cursor-pointer"
					>
						<User className="h-4 w-4" />
						<span>Profile</span>
					</a>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={logout}
					className="text-destructive focus:text-destructive focus:bg-destructive/10"
				>
					<LogOut className="h-4 w-4 mr-2" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}