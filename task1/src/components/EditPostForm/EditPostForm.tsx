"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";

interface PostFormData {
    title: string;
    body: string;
    tags: string;
}

interface EditPostOffcanvasProps {
    post: {
        id: number;
        title: string;
        body: string;
        tags: string[];
    };
    isOpen: boolean;
    onClose: () => void;
}

export function EditPostForm({ post, isOpen, onClose }: EditPostOffcanvasProps) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset } = useForm<PostFormData>({
        defaultValues: {
            title: post.title,
            body: post.body,
            tags: post.tags.join(", ")
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: PostFormData) => {
            const res = await fetch(`https://dummyjson.com/posts/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: data.title,
                    body: data.body,
                    tags: data.tags.split(',').map(tag => tag.trim())
                })
            });
            if (!res.ok) throw new Error("Failed to update");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['posts']);
            toast.success("Post updated successfully");
            onClose();
        },
        onError: () => {
            toast.error("Failed to update post");
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Offcanvas panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="relative w-screen max-w-md">
                    <div className="flex flex-col h-full bg-background shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Edit Post</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                        >
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    {...register("title", { required: true })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="body">Content</Label>
                                <Textarea
                                    id="body"
                                    className="min-h-[200px]"
                                    {...register("body", { required: true })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                <Input
                                    id="tags"
                                    {...register("tags")}
                                />
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={updateMutation.isPending}
                                onClick={handleSubmit((data) => updateMutation.mutate(data))}
                            >
                                {updateMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}