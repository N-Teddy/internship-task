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
import { toast } from "react-toastify";

import { EditPostForm } from "../EditPostForm/EditPostForm"; // Make sure this path is correct
import { PostDetails } from "../PostDetails/PostDetails";

interface PostActionButtonProps {
  postId: number;
}

export function PostActionButton({ postId }: PostActionButtonProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch post data for editing
  const { data: post } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await fetch(`https://dummyjson.com/posts/${postId}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    },
    enabled: isEditOpen, // Only fetch when edit dialog is open
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

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    queryClient.invalidateQueries(['posts']);
    toast.success("Post updated successfully");
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
            onClick={() => setIsDetailOpen(true)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4 text-blue-500" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsEditOpen(true)}
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

      {/* Post Detail Dialog */}
      <PostDetails
        postId={postId}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Edit Post Form Dialog */}
      <EditPostForm
        post={post ? {
          id: post.id,
          title: post.title,
          body: post.body,
          tags: post.tags || []
        } : undefined}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}