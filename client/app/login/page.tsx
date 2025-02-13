"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser } = useDashboardStore();
  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await res.json();
      const { success, message, jwtToken, email, name } = result;

      if (success) {
        toast({
          title: "Login Successful",
          variant: "default",
          className: "bg-green-400 text-black",
          duration: 2000,
        });

        await localStorage.setItem(
          "user",
          JSON.stringify({ name: name, email: email, token: jwtToken })
        );
        setUser(
          localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user") as string)
            : null
        );
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: message,
          variant: "default",
          className: "bg-red-400 text-black",
          duration: 2000,
        });
      }
    } catch (error: any) {
      const { message } = error;
      toast({
        title: "Error",
        description: message,
        variant: "default",
        className: "bg-red-400 text-black",
        duration: 2000,
      });
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(
      localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null
    );
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-[#ff7e5f] to-[#feb47b]">
      <Card className="w-full max-w-md p-6 rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Log in to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={submitForm}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                name="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-md focus:ring-2 focus:ring-orange-400"
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                name="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-md focus:ring-2 focus:ring-orange-400"
                autoComplete="on"
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200 ease-in-out"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-orange-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
