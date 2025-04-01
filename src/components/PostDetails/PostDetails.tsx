"use client";

import { useQuery } from "@tanstack/react-query";
import {
    X,
    MessageSquare,
    Heart,
    ThumbsUp,
    ThumbsDown,
    Clock,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface PostDetailDialogProps {
    postId: number;
    open: boolean;
    onClose: () => void;
}

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
    tags: string[];
    reactions: {
        likes: number;
        dislikes: number;
    },
    createdDate: string;
}

interface Comment {
    id: number;
    body: string;
    postId: number;
    user: {
        id: number;
        username: string;
    };
    createdAt: string;
}

export function PostDetails({ postId, open, onClose }: PostDetailDialogProps) {
    // Fetch post details
    const { data: post, isLoading: isPostLoading } = useQuery<Post>({
        queryKey: ['post', postId],
        queryFn: async () => {
            const res = await fetch(`https://dummyjson.com/posts/${postId}`);
            if (!res.ok) throw new Error("Failed to fetch post");
            return res.json();
        },
        enabled: open,
    });

    const formatDateSafely = (dateString?: string) => {
        if (!dateString) return "Unknown time";

        try {
            const date = new Date(dateString);
            return isNaN(date.getTime())
                ? "Unknown time"
                : formatDistanceToNow(date, { addSuffix: true });
        } catch {
            return "Unknown time";
        }
    };

    // Fetch comments
    const { data: comments, isLoading: isCommentsLoading } = useQuery<{
        comments: Comment[];
        total: number;
    }>({
        queryKey: ['post-comments', postId],
        queryFn: async () => {
            const res = await fetch(`https://dummyjson.com/comments/post/${postId}`);
            if (!res.ok) throw new Error("Failed to fetch comments");
            return res.json();
        },
        enabled: open,
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
                {/* <VisuallyHidden> */}
                    <DialogTitle>Post Details</DialogTitle>
                {/* </VisuallyHidden> */}

                {isPostLoading ? (
                    <div className="space-y-4 p-6">
                        <Skeleton className="h-8 w-3/4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-left">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold">{post?.title}</h2>
                                    <DialogDescription className="flex items-center gap-2 mt-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${post?.userId}`} />
                                            <AvatarFallback>U{post?.userId}</AvatarFallback>
                                        </Avatar>
                                        <span>User #{post?.userId}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {post?.createdDate && formatDistanceToNow(new Date(post.createdDate), { addSuffix: true })}
                                        </span>
                                    </DialogDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="text-muted-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Badge variant="outline" className="gap-1">
                                    <Heart className="h-3 w-3 text-red-500" />
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-green-600">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{post?.reactions.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-red-600">
                                                <ThumbsDown className="w-4 h-4" />
                                                <span>{post?.reactions.dislikes}</span>
                                            </div>
                                        </div>
                                </Badge>
                                {post?.tags?.map(tag => (
                                    <Badge key={tag} variant="secondary">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </DialogHeader>

                        <ScrollArea className="h-[calc(80vh-180px)] px-6">
                            <div className="prose dark:prose-invert max-w-none py-4">
                                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                                    {post?.body}
                                </p>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4 pb-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Comments ({comments?.total || 0})
                                    </h3>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {isCommentsLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                                <Skeleton className="h-16 w-full" />
                                            </div>
                                        ))}
                                    </div>
                                ) : comments?.comments?.length ? (
                                    <div className="space-y-4">
                                        {comments.comments.map(comment => (
                                            <div key={comment.id} className="rounded-lg border p-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${comment.user.id}`} />
                                                        <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{comment.user.username}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDateSafely(comment.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="mt-3 pl-11 text-gray-700 dark:text-gray-300">
                                                    {comment.body}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No comments yet
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="flex gap-2 p-6 pt-0">
                            <Button variant="outline" className="gap-2 flex-1">
                                <ThumbsUp className="h-4 w-4" />
                                Like
                            </Button>
                            <Button className="gap-2 flex-1">
                                <MessageSquare className="h-4 w-4" />
                                Add Comment
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}