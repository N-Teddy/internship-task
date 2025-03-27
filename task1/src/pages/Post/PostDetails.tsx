"use client";

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, User, Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

interface Comment {
    id: number;
    body: string;
    user: {
        id: number;
        username: string;
    };
}

export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch post data
    const { data: post, isLoading: isPostLoading } = useQuery<Post>({
        queryKey: ['post', id],
        queryFn: async () => {
            const res = await fetch(`https://dummyjson.com/posts/${id}`);
            if (!res.ok) throw new Error("Failed to fetch post");
            return res.json();
        },
        onError: () => toast.error("Failed to load post")
    });

    // Fetch comments
    const { data: comments, isLoading: isCommentsLoading } = useQuery<{
        comments: Comment[];
    }>({
        queryKey: ['post-comments', id],
        queryFn: async () => {
            const res = await fetch(`https://dummyjson.com/posts/${id}/comments`);
            if (!res.ok) throw new Error("Failed to fetch comments");
            return res.json();
        },
        onError: () => toast.error("Failed to load comments")
    });

    if (isPostLoading) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-6">
                <Skeleton className="h-8 w-[200px]" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[70%]" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            {/* Back button and title */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">{post?.title}</h1>
            </div>

            {/* Post content */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${post?.userId}`} />
                        <AvatarFallback>U{post?.userId}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                        User #{post?.userId}
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                        <Heart className="h-4 w-4 text-red-500" />
                        // Replace the reactions display with:
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4 text-blue-500" />
                                <span>{post.reactions.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ThumbsDown className="h-4 w-4 text-red-500" />
                                <span>{post.reactions.dislikes}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="prose dark:prose-invert">
                    <p className="whitespace-pre-line">{post?.body}</p>
                </div>

                {post?.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {post.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Comments section */}
            <Separator className="my-6" />

            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Comments</h2>
                    <span className="text-sm text-muted-foreground">
                        ({comments?.comments?.length || 0})
                    </span>
                </div>

                {isCommentsLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-[120px]" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ))}
                    </div>
                ) : comments?.comments?.length ? (
                    <div className="space-y-4">
                        {comments.comments.map(comment => (
                            <div key={comment.id} className="border rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${comment.user.id}`} />
                                        <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{comment.user.username}</p>
                                        <p className="text-sm text-muted-foreground">
                                            User #{comment.user.id}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-3 pl-11">{comment.body}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No comments yet
                    </div>
                )}
            </div>
        </div>
    );
}