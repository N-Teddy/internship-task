"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

type PostFormData = {
    title: string;
    body: string;
    tags: string;
    userId: number;
};

export default function CreatePost() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<PostFormData>({
        defaultValues: {
            userId: 1 // Default user ID (can be dynamic)
        }
    });

    const createMutation = useMutation({
        mutationFn: async (postData: PostFormData) => {
            const res = await fetch('https://dummyjson.com/posts/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: postData.title,
                    body: postData.body,
                    userId: postData.userId,
                    tags: postData.tags.split(',').map(tag => tag.trim()),
                    reactions: 0 // Initialize with 0 reactions
                })
            });
            if (!res.ok) throw new Error("Failed to create post");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['posts']);
            toast.success("Post created successfully");
            reset();
            navigate('/post-list');
        },
        onError: () => {
            toast.error("Failed to create post");
        }
    });

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">Create New Post</h1>
            </div>

            <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title*</Label>
                    <Input
                        id="title"
                        placeholder="Enter post title"
                        {...register("title", {
                            required: "Title is required",
                            minLength: {
                                value: 5,
                                message: "Title must be at least 5 characters"
                            }
                        })}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="body">Content*</Label>
                    <Textarea
                        id="body"
                        placeholder="Write your post content here..."
                        className="min-h-[200px]"
                        {...register("body", {
                            required: "Content is required",
                            minLength: {
                                value: 20,
                                message: "Content must be at least 20 characters"
                            }
                        })}
                    />
                    {errors.body && (
                        <p className="text-sm text-red-500">{errors.body.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                        id="tags"
                        placeholder="technology, programming, web"
                        {...register("tags")}
                    />
                    <p className="text-sm text-muted-foreground">
                        Separate tags with commas
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                        id="userId"
                        type="number"
                        {...register("userId", {
                            valueAsNumber: true,
                            min: { value: 1, message: "Invalid user ID" }
                        })}
                    />
                    {errors.userId && (
                        <p className="text-sm text-red-500">{errors.userId.message}</p>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/post-list')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={createMutation.isLoading}
                    >
                        {createMutation.isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : 'Create Post'}
                    </Button>
                </div>
            </form>
        </div>
    );
}