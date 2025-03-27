"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { EditPostForm } from "../EditPostForm/EditPostForm";

interface PostActionButtonProps {
    postId: number;
    onEdit?: (id: number) => void; // Keep this for backward compatibility
}

export function PostActionButton({ postId, onEdit }: PostActionButtonProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Fetch post data for the offcanvas
    const { data: post } = useQuery({
        queryKey: ['post', postId],
        queryFn: async () => {
            const res = await fetch(`https://dummyjson.com/posts/${postId}`);
            if (!res.ok) throw new Error("Failed to fetch post");
            return res.json();
        },
        enabled: isEditOpen // Only fetch when offcanvas is open
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`https://dummyjson.com/posts/${postId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['posts']);
            toast.success("Post deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete post");
        },
    });

    const handleEditClick = () => {
        if (onEdit) {
            // If onEdit prop exists, use the old behavior
            onEdit(postId);
        } else {
            // Otherwise use the new offcanvas approach
            setIsEditOpen(true);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => navigate(`/posts/${postId}`)}
                        className="cursor-pointer"
                    >
                        <Eye className="mr-2 h-4 w-4 text-blue-500" />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleEditClick}
                        className="cursor-pointer"
                    >
                        <Edit className="mr-2 h-4 w-4 text-amber-500" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => deleteMutation.mutate()}
                        className="cursor-pointer text-red-500"
                        disabled={deleteMutation.isPending}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Render offcanvas only if post data is available */}
            {post && (
                <EditPostForm
                    post={{
                        id: post.id,
                        title: post.title,
                        body: post.body,
                        tags: post.tags || []
                    }}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </>
    );
}