"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
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
  const { user, setUser } = useDashboardStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setRegisterInfo({ ...registerInfo, [name]: value });
  };

  useEffect(() => {
    if (!user) {
      setUser(
        localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user") as string)
          : null
      );
    }
  }, []);

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const submitForm = async (e: any) => {
    e.preventDefault();

    if (registerInfo.password !== registerInfo.cpassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "default",
        className: "bg-red-400 text-black",
        duration: 2000,
      });
      return;
    }

    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerInfo),
      });
      const result = await res.json();
      const { success, message } = result;
      if (success) {
        toast({
          title: "Account Created",
          variant: "default",
          className: "bg-green-400 text-black",
          duration: 2000,
        });
        router.push("/login");
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

  if (user) return null;
  else
    return (
      <div className="flex items-center justify-center min-h-screen px-5 bg-gradient-to-br from-[#ff7e5f] to-[#feb47b]">
        <Card className="w-full max-w-md p-6 rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105 bg-white">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Register Your Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Personal Task Management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submitForm}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-800">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your Name"
                  name="name"
                  className="border border-gray-300 rounded-lg px-4 py-3 shadow-md focus:ring-2 focus:ring-orange-400"
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  className="border border-gray-300 rounded-lg px-4 py-3 shadow-md focus:ring-2 focus:ring-orange-400"
                  onChange={handleChange}
                  required
                  autoComplete="off"
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
                  className="border border-gray-300 rounded-lg px-4 py-3 shadow-md focus:ring-2 focus:ring-orange-400"
                  autoComplete="on"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpassword" className="text-gray-800">
                  Confirm Password
                </Label>
                <Input
                  id="cpassword"
                  type="password"
                  placeholder="Confirm your password"
                  name="cpassword"
                  className="border border-gray-300 rounded-lg px-4 py-3 shadow-md focus:ring-2 focus:ring-orange-400"
                  autoComplete="on"
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300 ease-in-out"
              >
                Register
              </Button>
            </form>
            <div className="pt-4 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-500 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}

export default Page;
