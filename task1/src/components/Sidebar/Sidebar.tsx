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
            { title: "Categories", url: "/product-category" },
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
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleMenu = (menuTitle: string) => {
        setOpenMenu(openMenu === menuTitle ? null : menuTitle);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        // Close all menus when collapsing
        if (!isCollapsed) {
            setOpenMenu(null);
        }
    };

    return (
        <Sidebar
            collapsible="icon"
            collapsed={isCollapsed}
            onCollapse={toggleCollapse}
            className={cn(
                "border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                isCollapsed ? "w-[80px]" : "w-64"
            )}
        >
            <SidebarContent className="p-4">
                {/* Logo/Brand Area - Shows icon only when collapsed */}
                <div className={cn(
                    "mb-6 px-4 py-2 flex items-center justify-center",
                    isCollapsed ? "px-2" : "px-4"
                )}>
                    {isCollapsed ? (
                        <LayoutDashboard className="w-6 h-6" />
                    ) : (
                        <h2 className="text-xl font-semibold tracking-tight">Dashboard</h2>
                    )}
                </div>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Dashboard Link */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        "hover:bg-accent/50 transition-colors rounded-lg",
                                        isCollapsed ? "justify-center" : "justify-start"
                                    )}
                                >
                                    <a
                                        href="/home"
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 text-sm font-medium",
                                            isCollapsed ? "px-2" : "px-3"
                                        )}
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        {!isCollapsed && <span>Overview</span>}
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Main Navigation Groups */}
                            {sidebarItems.map((menu) => (
                                <div key={menu.title} className="space-y-1">
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            className={cn(
                                                "flex items-center justify-between w-full px-3 py-2 rounded-lg",
                                                "hover:bg-accent/50 transition-colors",
                                                "text-sm font-medium",
                                                isCollapsed ? "justify-center px-2" : "justify-start px-3"
                                            )}
                                            onClick={() => toggleMenu(menu.title)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <menu.icon className="w-5 h-5" />
                                                {!isCollapsed && <span>{menu.title}</span>}
                                            </div>
                                            {!isCollapsed && (
                                                <ChevronDown
                                                    className={cn(
                                                        "w-4 h-4 transition-transform text-muted-foreground",
                                                        openMenu === menu.title ? "rotate-180" : ""
                                                    )}
                                                />
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    {/* Submenu Items - Only show when not collapsed */}
                                    {!isCollapsed && openMenu === menu.title && (
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
                                    )}
                                </div>
                            ))}

                            {/* Additional Links */}
                            <div className={cn(
                                "pt-4 mt-4 border-t",
                                isCollapsed ? "border-t-transparent" : ""
                            )}>
                                {[
                                    { title: "Users", url: "/users", icon: Users },
                                    { title: "Cart", url: "/cart", icon: ShoppingCart },
                                    { title: "Recipes", url: "/recipe", icon: CookingPot },
                                    { title: "Quotes", url: "/quote", icon: Quote },
                                    { title: "Todos", url: "/todos", icon: ListTodo },
                                ].map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "hover:bg-accent/50 transition-colors rounded-lg",
                                                isCollapsed ? "justify-center px-2" : "justify-start px-3"
                                            )}
                                        >
                                            <a
                                                href={item.url}
                                                className={cn(
                                                    "flex items-center gap-3 py-2 text-sm font-medium",
                                                    isCollapsed ? "justify-center" : "justify-start"
                                                )}
                                            >
                                                <item.icon className="w-5 h-5" />
                                                {!isCollapsed && <span>{item.title}</span>}
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