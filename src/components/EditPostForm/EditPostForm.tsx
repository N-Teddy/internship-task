"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

interface PostFormData {
    title: string;
    body: string;
    tags: string;
}

interface EditPostDialogProps {
    post?: {
        id: number;
        title: string;
        body: string;
        tags: string[];
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    isLoading?: boolean;
}

export function EditPostForm({
    post,
    open,
    onOpenChange,
    onSuccess
}: EditPostDialogProps) {
    const queryClient = useQueryClient();

    const { register, handleSubmit } = useForm<PostFormData>({
        defaultValues: {
            title: post?.title,
            body: post?.body,
            tags: post?.tags.join(", ")
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: PostFormData) => {
            const res = await fetch(`https://dummyjson.com/posts/${post?.id}`, {
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
            onOpenChange(false);
            onSuccess?.();
        },
        onError: () => {
            toast.error("Failed to update post");
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                    <DialogDescription>
                        Make changes to your post here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                className="col-span-3"
                                {...register("title", { required: true })}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="body" className="text-right">
                                Content
                            </Label>
                            <Textarea
                                id="body"
                                className="col-span-3 min-h-[200px]"
                                {...register("body", { required: true })}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tags" className="text-right">
                                Tags
                            </Label>
                            <Input
                                id="tags"
                                className="col-span-3"
                                placeholder="Comma separated tags"
                                {...register("tags")}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}