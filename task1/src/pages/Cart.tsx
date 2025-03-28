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
    Package,
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

interface Cart {
    id: number;
    userId: number;
    total: number;
    discountedTotal: number;
    totalProducts: number;
    totalQuantity: number;
    products: {
        id: number;
        title: string;
        quantity: number;
        price: number;
        discountedPrice: number;
    }[];
}

export default function Carts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Omit<Cart, 'products'>;
        direction: "asc" | "desc";
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["carts", searchTerm, currentPage],
        queryFn: async () => {
            let url = `https://dummyjson.com/carts?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`;

            if (searchTerm) {
                // Search by user ID if search term is numeric
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Cart Management
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>All Carts</CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by user ID..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => requestSort("id")}
                                    >
                                        <div className="flex items-center">
                                            Cart ID
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => requestSort("userId")}
                                    >
                                        <div className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            User ID
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => requestSort("totalProducts")}
                                    >
                                        <div className="flex items-center">
                                            <Package className="mr-2 h-4 w-4" />
                                            Products
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => requestSort("totalQuantity")}
                                    >
                                        <div className="flex items-center">
                                            Items
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer text-right"
                                        onClick={() => requestSort("total")}
                                    >
                                        <div className="flex items-center justify-end">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            Total
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer text-right"
                                        onClick={() => requestSort("discountedTotal")}
                                    >
                                        <div className="flex items-center justify-end">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            Discounted
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(pageSize)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            Failed to load carts
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedCarts?.map((cart: Cart) => (
                                        <TableRow key={cart.id}>
                                            <TableCell className="font-medium">
                                                <Badge variant="outline">#{cart.id}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">User {cart.userId}</Badge>
                                            </TableCell>
                                            <TableCell>{cart.totalProducts}</TableCell>
                                            <TableCell>{cart.totalQuantity}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                ${cart.total}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="font-medium text-green-600">
                                                    ${cart.discountedTotal}
                                                </span>
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    (Saved ${cart.total - cart.discountedTotal})
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1 || isLoading}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1 || isLoading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage >= totalPages || isLoading}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage >= totalPages || isLoading}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}