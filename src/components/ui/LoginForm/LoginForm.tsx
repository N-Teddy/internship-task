"use client";

import { User, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// Validation schema
const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
    const { login } = useAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        await login(data.username, data.password);
    };

    return (
        <Card className="w-full max-w-md p-8 shadow-lg rounded-xl border-none bg-gradient-to-br from-background to-muted/50">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                <p className="text-muted-foreground mt-2">
                    Enter your credentials to access the dashboard
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Username Field */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Username</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username"
                                            className={cn(
                                                "pl-10 h-12 rounded-lg",
                                                form.formState.errors.username && "border-destructive"
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                                    <a
                                        href="#forgot-password"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className={cn(
                                                "pl-10 h-12 rounded-lg",
                                                form.formState.errors.password && "border-destructive"
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-12 rounded-lg font-medium"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
            </Form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <a href="#signup" className="font-medium text-primary hover:underline">
                    Contact admin
                </a>
            </div>
        </Card>
    );
}