"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Tags, User } from "lucide-react";

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
        formState: { errors, isValid },
        reset
    } = useForm<PostFormData>({
        defaultValues: {
            userId: 1
        },
        mode: "onChange" // Validate on change for better UX
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
                    reactions: 0
                })
            });
            if (!res.ok) throw new Error("Failed to create post");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Post created successfully!", {
                action: {
                    label: "View Posts",
                    onClick: () => navigate('/post-list')
                }
            });
            reset();
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create post");
        }
    });

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="shrink-0"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Create New Post</h1>
            </div>

            <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="title">Title*</Label>
                    <Input
                        id="title"
                        placeholder="Enter post title"
                        className={errors.title ? "border-destructive" : ""}
                        {...register("title", {
                            required: "Title is required",
                            minLength: {
                                value: 5,
                                message: "Title must be at least 5 characters"
                            },
                            maxLength: {
                                value: 100,
                                message: "Title must be less than 100 characters"
                            }
                        })}
                    />
                    {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                </div>

                <div className="space-y-3">
                    <Label htmlFor="body">Content*</Label>
                    <Textarea
                        id="body"
                        placeholder="Write your post content here..."
                        className={`min-h-[200px] ${errors.body ? "border-destructive" : ""}`}
                        {...register("body", {
                            required: "Content is required",
                            minLength: {
                                value: 20,
                                message: "Content must be at least 20 characters"
                            },
                            maxLength: {
                                value: 1000,
                                message: "Content must be less than 1000 characters"
                            }
                        })}
                    />
                    {errors.body && (
                        <p className="text-sm text-destructive">{errors.body.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="tags">
                            <div className="flex items-center gap-2">
                                <Tags className="h-4 w-4" />
                                <span>Tags</span>
                            </div>
                        </Label>
                        <Input
                            id="tags"
                            placeholder="technology, programming, web"
                            {...register("tags", {
                                pattern: {
                                    value: /^[a-zA-Z0-9, ]*$/,
                                    message: "Only letters, numbers and commas allowed"
                                }
                            })}
                        />
                        <p className="text-sm text-muted-foreground">
                            Separate tags with commas (e.g., tech, programming)
                        </p>
                        {errors.tags && (
                            <p className="text-sm text-destructive">{errors.tags.message}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="userId">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>User ID</span>
                            </div>
                        </Label>
                        <Input
                            id="userId"
                            type="number"
                            className={errors.userId ? "border-destructive" : ""}
                            {...register("userId", {
                                valueAsNumber: true,
                                min: { value: 1, message: "Invalid user ID" },
                                max: { value: 100, message: "User ID must be less than 100" }
                            })}
                        />
                        {errors.userId && (
                            <p className="text-sm text-destructive">{errors.userId.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/post-list')}
                        disabled={createMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={createMutation.isPending || !isValid}
                    >
                        {createMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Post'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}