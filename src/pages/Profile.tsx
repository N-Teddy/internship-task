"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CalendarDays, Clock, Mail, Phone, User, ShoppingCart, MessageSquare, ListTodo, Edit } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext"; // Adjust the import path as needed

interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    birthDate: string;
    image: string;
}

interface ActivityItem {
    id: number;
    type: 'post' | 'comment' | 'todo' | 'cart';
    title: string;
    content?: string;
    date: string;
    completed?: boolean;
    items?: number;
}

const fetchUserData = async (userId: number) => {
    const response = await axios.get(`https://dummyjson.com/users/${userId}`);
    return response.data;
};

const fetchUserActivities = async (userId: number) => {
    // Simulate fetching different types of activities
    const [posts, comments, todos, carts] = await Promise.all([
        axios.get(`https://dummyjson.com/posts/user/${userId}`),
        axios.get(`https://dummyjson.com/comments/user/${userId}`),
        axios.get(`https://dummyjson.com/todos/user/${userId}`),
        axios.get(`https://dummyjson.com/carts/user/${userId}`),
    ]);

    // Transform data into a unified activity format
    const activities: ActivityItem[] = [
        ...posts.data.posts.map((post: any) => ({
            id: post.id,
            type: 'post',
            title: post.title,
            content: post.body,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        })),
        ...comments.data.comments.map((comment: any) => ({
            id: comment.id,
            type: 'comment',
            title: `Comment on post ${comment.postId}`,
            content: comment.body,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        })),
        ...todos.data.todos.map((todo: any) => ({
            id: todo.id,
            type: 'todo',
            title: todo.todo,
            completed: todo.completed,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        })),
        ...carts.data.carts.map((cart: any) => ({
            id: cart.id,
            type: 'cart',
            title: `Cart #${cart.id}`,
            items: cart.totalProducts,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        })),
    ];

    // Sort by date (newest first)
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export default function Profile() {
    const { user: authUser } = useAuth();

    // Redirect if not authenticated
    if (!authUser) {
        return (
            <div className="container mx-auto py-8 text-center">
                <h2 className="text-xl font-semibold">Please log in to view your profile</h2>
            </div>
        );
    }

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user', authUser.id],
        queryFn: () => fetchUserData(authUser.id),
    });

    const { data: activities, isLoading: activitiesLoading } = useQuery({
        queryKey: ['activities', authUser.id],
        queryFn: () => fetchUserActivities(authUser.id),
    });

    if (userLoading) {
        return (
            <div className="container mx-auto py-8 space-y-8">
                <Skeleton className="h-64 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (!userData) {
        return <div className="container mx-auto py-8 text-center">User not found</div>;
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            {/* Profile Header */}
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={userData.image || authUser.image} alt={`${userData.firstName} ${userData.lastName}`} />
                        <AvatarFallback>
                            {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">
                                {userData.firstName} {userData.lastName}
                            </h1>
                            <Badge variant="outline" className="text-sm">
                                {userData.gender}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">@{authUser.username}</p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{authUser.email}</span>
                            </div>
                            {userData.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{userData.phone}</span>
                                </div>
                            )}
                            {userData.birthDate && (
                                <div className="flex items-center gap-2 text-sm">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span>{userData.birthDate}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Posts</CardTitle>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {activities?.filter(a => a.type === 'post').length || 0}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Comments</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {activities?.filter(a => a.type === 'comment').length || 0}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Carts</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {activities?.filter(a => a.type === 'cart').length || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Activity</TabsTrigger>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="carts">Carts</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {activitiesLoading ? (
                        [...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))
                    ) : (
                        activities?.map((activity) => (
                            <ActivityCard key={`${activity.type}-${activity.id}`} activity={activity} />
                        ))
                    )}
                </TabsContent>

                {['posts', 'comments', 'todos', 'carts'].map((type) => (
                    <TabsContent key={type} value={type} className="space-y-4">
                        {activitiesLoading ? (
                            [...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))
                        ) : (
                            activities
                                ?.filter(a => a.type === type)
                                .map((activity) => (
                                    <ActivityCard key={`${activity.type}-${activity.id}`} activity={activity} />
                                ))
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
    const getIcon = () => {
        switch (activity.type) {
            case 'post': return <Edit className="h-5 w-5" />;
            case 'comment': return <MessageSquare className="h-5 w-5" />;
            case 'todo': return <ListTodo className="h-5 w-5" />;
            case 'cart': return <ShoppingCart className="h-5 w-5" />;
            default: return <User className="h-5 w-5" />;
        }
    };

    const getBadge = () => {
        switch (activity.type) {
            case 'post': return <Badge variant="secondary">Post</Badge>;
            case 'comment': return <Badge variant="outline">Comment</Badge>;
            case 'todo':
                return activity.completed
                    ? <Badge className="bg-green-500">Completed</Badge>
                    : <Badge variant="destructive">Pending</Badge>;
            case 'cart': return <Badge>{activity.items} items</Badge>;
            default: return null;
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent">
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="font-medium leading-none">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                {getBadge()}
            </CardHeader>
            {activity.content && (
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {activity.content}
                    </p>
                </CardContent>
            )}
        </Card>
    );
}