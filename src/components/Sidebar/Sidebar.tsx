"use client";

import { useState } from "react";
import {
    ChevronDown,
    Package,
    FileText,
    Users,
    ShoppingCart,
    CookingPot,
    Quote,
    ListTodo,
    LayoutDashboard,
    Plus,
    List
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarItems = [
    {
        title: "Products",
        icon: Package,
        subItems: [
            { title: "Product List", url: "/product-list", icon: List },
            { title: "Add Product", url: "/create-product", icon: Plus },
        ],
    },
    {
        title: "Posts",
        icon: FileText,
        subItems: [
            { title: "Post List", url: "/post-list", icon: List },
            { title: "Create Post", url: "/create-post", icon: Plus },
        ],
    },
];

export function AppSidebar() {
    const [openMenu, setOpenMenu] = useState<string | null>("Products");
    // const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleMenu = (menuTitle: string) => {
        setOpenMenu(openMenu === menuTitle ? null : menuTitle);
    };

    // const toggleCollapse = () => {
    //     setIsCollapsed(!isCollapsed);
    //     // Close all menus when collapsing
    //     if (!isCollapsed) {
    //         setOpenMenu(null);
    //     }
    // };

    return (
        <Sidebar
            collapsible="icon"
            // collapsed={isCollapsed}
            // onCollapse={toggleCollapse}
            // className={cn(
            //     "border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            //     isCollapsed ? "w-[80px]" : "w-64"
            // )}
        >
            <SidebarContent className="p-4">

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Dashboard Link */}
                            <SidebarMenuItem>
                                <SidebarMenuButton

                                >
                                    <a
                                        href="/home"

                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Main Navigation Groups */}
                            {sidebarItems.map((menu) => (
                                <div key={menu.title} className="space-y-1">
                                    <SidebarMenuItem>
                                        <SidebarMenuButton

                                            onClick={() => toggleMenu(menu.title)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <menu.icon className="w-5 h-5" />
                                                <span>{menu.title}</span>
                                            </div>

                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                        <div className="ml-2 pl-6 space-y-1 border-l-2 border-accent">
                                            {menu.subItems.map((sub) => (
                                                <SidebarMenuItem key={sub.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className="hover:bg-accent/30 transition-colors rounded-lg"
                                                    >
                                                        <a
                                                            href={sub.url}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm"
                                                        >
                                                            {sub.icon && <sub.icon className="w-4 h-4 text-muted-foreground" />}
                                                            <span>{sub.title}</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </div>

                                </div>
                            ))}

                            {/* Additional Links */}
                            <div className="space-y-1">
                                {[
                                    { title: "Users", url: "/users", icon: Users },
                                    { title: "Cart", url: "/cart", icon: ShoppingCart },
                                ].map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className="group hover:bg-accent/50 transition-colors rounded-lg"
                                        >
                                            <a
                                                href={item.url}
                                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium"
                                            >
                                                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                <span className="group-hover:text-foreground transition-colors">
                                                    {item.title}
                                                </span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </div>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}