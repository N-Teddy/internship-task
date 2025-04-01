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
    User,
    Mail,
    Phone,
    Shield,
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

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
}

export default function Users() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({});
    const [sortConfig, setSortConfig] = useState<{
        key: keyof User;
        direction: "asc" | "desc";
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["users", searchTerm, filters, currentPage],
        queryFn: async () => {
            let url = `https://dummyjson.com/users?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`;

            if (searchTerm) url += `&q=${searchTerm}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch users");
            return res.json();
        },
    });

    const requestSort = (key: keyof User) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = data?.users?.slice().sort((a: User, b: User) => {
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
                    <User className="w-5 h-5" />
                    Users Management
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Users List</CardTitle>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
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
                                            onClick={() => requestSort("firstName")}
                                        >
                                            <div className="flex items-center">
                                                Name
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => requestSort("email")}
                                        >
                                            <div className="flex items-center">
                                                <Mail className="mr-2 h-4 w-4" />
                                                Email
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => requestSort("phone")}
                                        >
                                            <div className="flex items-center">
                                                <Phone className="mr-2 h-4 w-4" />
                                                Phone
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => requestSort("username")}
                                        >
                                            <div className="flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                Username
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center">
                                                <Shield className="mr-2 h-4 w-4" />
                                                Actions
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        [...Array(pageSize)].map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                                <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : isError ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">
                                                Failed to load users
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sortedUsers?.map((user: User) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    {user.firstName} {user.lastName}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.phone}</TableCell>
                                                <TableCell>{user.username}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm">
                                                        View
                                                    </Button>
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
        </div>
    );
}