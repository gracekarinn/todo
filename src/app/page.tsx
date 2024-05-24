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
      containerClassName="absolute inset-0"
      className="w-full h-full"
    >
      <main className="flex flex-col md:px-10 lg:flex-row items-center justify-center w-full min-h-screen bg-black">
        <div className="text-center text-white w-full mx-auto max-w-5xl font-serif my-5">
          <h1 className="md:text-6xl text-3xl font-extrabold font-sans">Welcome to Si Catat</h1>
          <span className="text-xl md:text2xl font-extrabold font-sans">Write every one of your tasks :)</span>
        </div>
        <div className="max-w-md w-full mx-auto lg:mx-10 p-6 md:p-4 bg-opacity-75 rounded-lg shadow-md flex flex-col items-center justify-center z-20">
          {showLogin ? (
            <>
              <Login handleSignUpClick={handleSignUpClick} />
            </>
          ) : (
            <>
              <Register>
                <div className="text-sm text-center p-3">
                  <a
                    className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                    onClick={handleLoginClick}
                  >
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
