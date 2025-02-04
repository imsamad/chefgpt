"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "../app/actions/registerUser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function AuthForm({
  isSignup,
  toggleForm,
  onSubmitCB,
}: {
  isSignup: boolean;
  toggleForm?: () => void;
  onSubmitCB?: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "john",
    email: "john@gmail.com",
    password: "12345678",
  });
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errMsg) setErrMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      if (isSignup) {
        try {
          const res = await registerUser(formData);
          if (res.success) {
            toast({
              title: res.message,
            });
            if (onSubmitCB) onSubmitCB();
            else router.push("/login");
          } else {
            toast({
              variant: "destructive",
              title: res.message,
            });
          }
        } catch {
          toast({
            variant: "destructive",
            title: "Please try again!",
            description: "Server is under maintenance!",
          });
        }

        return;
      }
      const response = await signIn("signin", { ...formData, redirect: false });

      if (response?.error) {
        setErrMsg(response.error);
      } else {
        if (onSubmitCB) {
          onSubmitCB();
        } else {
          const cbUrl = new URLSearchParams(window.location.search).get("next");
          router.push(cbUrl || "/");
        }
      }
    } catch {
      // setErrMsg(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-center text-2xl font-semibold text-gray-700">
        {isSignup ? "Create an Account" : "Login"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:ring"
              required
            />
          </div>
        )}
        <h4 className="text-sm text-red-400 italic text-center">{errMsg}</h4>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:ring"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:ring"
            required
          />
        </div>

        <Button
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
        >
          {isSignup ? "Sign Up" : "Login"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        {toggleForm ? (
          <Button
            variant="link"
            onClick={toggleForm}
            disabled={isLoading}
            className="p-0"
          >
            {isSignup ? "Login" : "Sign Up"}
          </Button>
        ) : (
          <Link href={isSignup ? "/login" : "/signup"}>
            <Button variant="link" className="p-0">
              {isSignup ? "Login" : "Sign Up"}
            </Button>
          </Link>
        )}
      </p>
    </div>
  );
}
