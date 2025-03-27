import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LogOut,
  User,
} from "lucide-react"

export default function AvatarProfile() {

  const { user, logout } = useAuth();

  return (
    <>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            Welcome {user?.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem></DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuItem>
            <LogOut />
            <span onClick={logout}>Log out</span>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}
