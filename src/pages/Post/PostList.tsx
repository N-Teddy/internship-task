"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ThumbsDown,
    ThumbsUp,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PostActionButton } from "@/components/PostActionButton/PostActionButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const API_URL = "https://dummyjson.com/posts";

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
    tags: string[];
    reactions: {
        likes: number;
        dislikes: number;
    };
}

export default function PostList() {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Post;
        direction: "asc" | "desc";
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["posts", currentPage],
        queryFn: async () => {
            try {
                let url = `${API_URL}?limit=${pageSize}&skip=${(currentPage - 1) * pageSize
                    }`;

                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            } catch (error) {
                toast.error("Failed to load posts");
                throw error;
            }
        },
    });

    const requestSort = (key: keyof Post) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        toast(`Sorted by ${key} (${direction})`);
    };

    const sortedPosts = data?.posts?.slice().sort((a: Post, b: Post) => {
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
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">


                <div className="flex-1 space-y-4">
                    <div className="rounded-md border shadow-sm bg-background">
                        <ScrollArea className="h-[calc(100vh-280px)] w-full">
                            <Table className="relative">
                                <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                                    <TableRow>
                                        <TableHead className="w-[50px]">ID</TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => requestSort("title")}
                                        >
                                            <div className="flex items-center">
                                                Title
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => requestSort("userId")}
                                        >
                                            <div className="flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                User
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead>Tags</TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => requestSort("reactions")}
                                        >
                                            <div className="flex items-center">
                                                <ThumbsUp className="mr-2 h-4 w-4" />
                                                Reactions
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        [...Array(pageSize)].map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-10" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-[200px]" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-20" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-[150px]" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-20" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-8 w-[100px]" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : isError ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                Failed to load posts
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sortedPosts?.map((post: Post) => (
                                            <TableRow key={post.id} className="hover:bg-muted/50">
                                                <TableCell>{post.id}</TableCell>
                                                <TableCell className="font-medium max-w-[300px] truncate">
                                                    {post.title}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="gap-1">
                                                        <User className="h-3 w-3" />
                                                        User #{post.userId}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {post.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1 text-green-600">
                                                            <ThumbsUp className="w-4 h-4" />
                                                            <span>{post.reactions.likes}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-red-600">
                                                            <ThumbsDown className="w-4 h-4" />
                                                            <span>{post.reactions.dislikes}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <PostActionButton
                                                        postId={post.id}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <div className="text-sm text-muted-foreground">
                            Showing{" "}
                            <span className="font-medium">
                                {(currentPage - 1) * pageSize + 1}-
                                {Math.min(currentPage * pageSize, data?.total || 0)}
                            </span>{" "}
                            of <span className="font-medium">{data?.total || 0}</span> posts
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                                <span className="sr-only">First page</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous page</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage >= totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next page</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage >= totalPages}
                            >
                                <ChevronsRight className="h-4 w-4" />
                                <span className="sr-only">Last page</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}