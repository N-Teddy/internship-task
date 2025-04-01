"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    ShoppingCart,
    User,
    DollarSign,
    Loader2
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Cart {
    id: number;
    userId: number;
    total: number;
    totalProducts: number;
    totalQuantity: number;
    products: {
        id: number;
        title: string;
        quantity: number;
        price: number;
        thumbnail: string;
    }[];
}

export default function Carts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Omit<Cart, 'products'>;
        direction: "asc" | "desc";
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // Reduced page size for more compact view

    const { data, isLoading, isError } = useQuery({
        queryKey: ["carts", searchTerm, currentPage],
        queryFn: async () => {
            let url = `https://dummyjson.com/carts?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`;

            if (searchTerm) {
                if (!isNaN(Number(searchTerm))) {
                    url = `https://dummyjson.com/carts/user/${searchTerm}`;
                }
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch carts");
            return res.json();
        },
    });

    const requestSort = (key: keyof Omit<Cart, 'products'>) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedCarts = data?.carts?.slice().sort((a: Cart, b: Cart) => {
        if (!sortConfig) return 0;
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const totalPages = Math.ceil((data?.total || 0) / pageSize);

    return (
        <div className="space-y-4 ml-4 mr-4 mt-4"> {/* Added margins for sidebar spacing */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold flex items-center gap-2"> {/* Reduced text size */}
                    <ShoppingCart className="w-4 h-4" /> {/* Smaller icon */}
                    Cart Management
                </h1>
            </div>

            <Card className="border-0 shadow-sm"> {/* Lighter card styling */}
                <CardHeader className="p-4"> {/* Tighter padding */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3"> {/* Reduced gap */}
                        <CardTitle className="text-lg">All Carts</CardTitle> {/* Smaller title */}
                        <div className="relative w-full md:w-56"> {/* Narrower search */}
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /> {/* Smaller icon */}
                            <Input
                                placeholder="Search by user ID..."
                                className="pl-8 h-8 text-sm" // Compact input
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4"> {/* Tighter padding */}
                    <div className="rounded-md border">
                        <Table className="compact-table"> {/* Added class for compact styling */}
                            <TableHeader>
                                <TableRow className="h-10"> {/* Reduced row height */}
                                    <TableHead className="px-3 py-2"> {/* Tighter padding */}
                                        <div className="flex items-center text-sm"> {/* Smaller text */}
                                            Cart ID
                                            <ArrowUpDown className="ml-1 h-3 w-3" /> {/* Smaller sort icon */}
                                        </div>
                                    </TableHead>
                                    <TableHead className="px-3 py-2">
                                        <div className="flex items-center text-sm">
                                            <User className="mr-1 h-3.5 w-3.5" />
                                            User ID
                                            <ArrowUpDown className="ml-1 h-3 w-3" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="px-3 py-2 text-sm">Products</TableHead>
                                    <TableHead className="px-3 py-2">
                                        <div className="flex items-center text-sm">
                                            Items
                                            <ArrowUpDown className="ml-1 h-3 w-3" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="px-3 py-2 text-right text-sm">
                                        <div className="flex items-center justify-end">
                                            <DollarSign className="mr-1 h-3.5 w-3.5" />
                                            Total
                                            <ArrowUpDown className="ml-1 h-3 w-3" />
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(pageSize)].map((_, i) => (
                                        <TableRow key={i} className="h-10">
                                            <TableCell className="px-3 py-2"><Skeleton className="h-4 w-[60px]" /></TableCell>
                                            <TableCell className="px-3 py-2"><Skeleton className="h-4 w-[60px]" /></TableCell>
                                            <TableCell className="px-3 py-2">
                                                <div className="flex">
                                                    {[...Array(3)].map((_, j) => (
                                                        <Skeleton key={j} className="h-6 w-6 rounded-full mr-1" /> // Smaller skeletons
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-3 py-2"><Skeleton className="h-4 w-[60px]" /></TableCell>
                                            <TableCell className="px-3 py-2"><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4 text-sm"> {/* Smaller text */}
                                            Failed to load carts
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedCarts?.map((cart: Cart) => (
                                        <TableRow key={cart.id} className="h-10 hover:bg-muted/50">
                                            <TableCell className="px-3 py-2 font-medium text-sm"> {/* Smaller text */}
                                                <Badge variant="outline" className="text-xs px-1.5 py-0.5">#{cart.id}</Badge> {/* Smaller badge */}
                                            </TableCell>
                                            <TableCell className="px-3 py-2">
                                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">User {cart.userId}</Badge>
                                            </TableCell>
                                            <TableCell className="px-3 py-2">
                                                <div className="flex -space-x-1"> {/* Tighter image grouping */}
                                                    {cart.products.slice(0, 4).map((product) => (
                                                        <Avatar key={product.id} className="h-6 w-6 border border-background"> {/* Smaller avatars */}
                                                            <AvatarImage src={product.thumbnail} alt={product.title} />
                                                            <AvatarFallback className="text-xs"> {/* Smaller fallback */}
                                                                {product.title.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                    {cart.products.length > 4 && (
                                                        <Avatar className="h-6 w-6 border border-background bg-muted">
                                                            <AvatarFallback className="text-xs">
                                                                +{cart.products.length - 4}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-3 py-2 text-sm">{cart.totalQuantity}</TableCell>
                                            <TableCell className="px-3 py-2 text-right font-medium text-sm">
                                                ${cart.total.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Compact Pagination */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1 || isLoading}
                            >
                                <ChevronsLeft className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1 || isLoading}
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage >= totalPages || isLoading}
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage >= totalPages || isLoading}
                            >
                                <ChevronsRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}