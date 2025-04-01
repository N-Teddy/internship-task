"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    ShoppingCart,
    Users,
    DollarSign,
    Package,
    TrendingUp,
    TrendingDown
} from "lucide-react";
import { BarChart, PieChart } from "@/components/Charts/Charts" // You'll need to create these
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const fetchDashboardData = async () => {
    const [products, users, carts] = await Promise.all([
        fetch('https://dummyjson.com/products?limit=100').then(res => res.json()),
        fetch('https://dummyjson.com/users?limit=100').then(res => res.json()),
        fetch('https://dummyjson.com/carts').then(res => res.json())
    ]);

    // Process data for visualizations
    const categories = products.products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});

    const revenueByCategory = products.products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + product.price;
        return acc;
    }, {});

    const totalRevenue = carts.carts.reduce((sum, cart) => sum + cart.total, 0);

    return {
        stats: {
            totalProducts: products.total,
            totalUsers: users.total,
            totalCarts: carts.total,
            totalRevenue
        },
        charts: {
            categories,
            revenueByCategory
        }
    };
};

function formatCategoryName(name: string) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function Home() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboardData,
        onError: () => toast.error("Failed to load dashboard data")
    });

    if (isError) return <div>Error loading dashboard</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={`$${(data?.stats.totalRevenue || 0).toLocaleString()}`}
                    icon={<DollarSign className="h-4 w-4" />}
                    trend="up"
                    loading={isLoading}
                />
                <StatCard
                    title="Products"
                    value={data?.stats.totalProducts}
                    icon={<Package className="h-4 w-4" />}
                    loading={isLoading}
                />
                <StatCard
                    title="Users"
                    value={data?.stats.totalUsers}
                    icon={<Users className="h-4 w-4" />}
                    trend="up"
                    loading={isLoading}
                />
                <StatCard
                    title="Active Carts"
                    value={data?.stats.totalCarts}
                    icon={<ShoppingCart className="h-4 w-4" />}
                    loading={isLoading}
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Products by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {isLoading ? (
                            <Skeleton className="h-full w-full" />
                        ) : (
                            <PieChart
                                data={Object.entries(data?.charts.categories || {}).map(([name, value]) => ({
                                    name: name.charAt(0).toUpperCase() + name.slice(1),
                                    value
                                }))}
                            />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {isLoading ? (
                            <Skeleton className="h-full w-full" />
                        ) : (
                            <BarChart
                                data={Object.entries(data?.charts.revenueByCategory || {}).map(([name, value]) => ({
                                    name: name.charAt(0).toUpperCase() + name.slice(1),
                                    value
                                }))}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        <span>Recent Activity</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* You would fetch recent activity from an API */}
                    <div className="text-muted-foreground">
                        {isLoading ? "Loading activity..." : "No recent activity"}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: 'up' | 'down';
    loading?: boolean;
}

function StatCard({ title, value, icon, trend, loading }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-[100px]" />
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{value}</span>
                        {trend === 'up' && (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        {trend === 'down' && (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}