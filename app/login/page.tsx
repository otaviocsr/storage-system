"use client";
import { SignUpForm } from "@/components/sign-up";

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    localStorage.setItem("isAuthenticated", "true");
    window.location.href = "/";
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm onSubmit={handleSubmit}/>
      </div>
    </div>
  );
}
