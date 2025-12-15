"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/use-auth-store";
import { loginSchema, LoginValues } from "@/lib/schemas/auth";
import { apiClient } from "@/lib/api-client";
import { useState } from "react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { jwtDecode } from "jwt-decode";
import { Profile } from "@/lib/types";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const login = useAuthStore((state) => state.login);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginValues) {
        setIsLoading(true);
        try {
            const res = await apiClient.post("/auth/login", {
                email: data.email,
                password: data.password
            });

            const { access_token } = res.data;

            // Decode token to get user ID
            const decoded: any = jwtDecode(access_token);
            const userId = decoded.sub;

            // Fetch user profile
            const profileRes = await apiClient.get<Profile>(`/profiles/${userId}/`);
            const user = {
                ...profileRes.data,
                email: data.email // explicit email as profile might not have it
            };

            login(access_token, user as any); // Type assertion if needed match User interface
            toast.success("Welcome back!");

            const redirect = searchParams.get("redirect") || "/";
            router.push(redirect);

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || "Invalid credentials. Please try again.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
