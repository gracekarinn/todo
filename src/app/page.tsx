"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/Login";
import { Register } from "@/components/Register";
import { auth } from "@/lib/firebase";
import { BackgroundGradientAnimation } from "@/components/ui/background"; 

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignUpClick = () => {
    setShowLogin(false);
  };

  const router = useRouter();

  const fetchUser = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <BackgroundGradientAnimation 
      gradientBackgroundStart="rgb(108, 0, 162)"
      gradientBackgroundEnd="rgb(0, 17, 82)"
      firstColor="18, 113, 255"
      secondColor="221, 74, 255"
      thirdColor="100, 220, 255"
      fourthColor="200, 50, 50"
      fifthColor="180, 180, 50"
      pointerColor="140, 100, 255"
      size="80%"
      blendingValue="hard-light"
      interactive={true}
      containerClassName="relative"
    >
      <main className="flex-col min-h-screen bg-black items-center justify-between p-24">
        <div className="z-10 text-center text-white flex-col w-full mx-auto max-w-5xl items-center justify-between font-serif text-sm lg:flex my-10">
          <h1 className="md:text-6xl text-3xl font-bold text-center">Welcome to Si Catat</h1>
          <span className="text-center text-xl md:text-2xl">Write every one of your tasks</span>
        </div>
        <div className="max-w-md mx-auto p-6 space-y-6 bg-black rounded-lg shadow-md">
          {showLogin ? (
            <>
              <h2 className="text-2xl font-bold text-center">Login</h2>
              <Login />
              <div className="text-sm text-center p-3">
                <a className="font-medium text-blue-600 hover:text-blue-500" onClick={handleSignUpClick}>
                  Don't have an account? Sign Up
                </a>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center">Sign Up</h2>
              <Register>
                <div className="text-sm text-center p-3">
                  <a className="font-medium text-blue-600 hover:text-blue-500" onClick={handleLoginClick}>
                    Already have an account? Login
                  </a>
                </div>
              </Register>
            </>
          )}
        </div>
      </main>
    </BackgroundGradientAnimation>
  );
}
