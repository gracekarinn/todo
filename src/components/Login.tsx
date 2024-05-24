"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string({
    required_error: "Please fill your email.",
  }).email("Invalid email address."),
  password: z.string({
    required_error: "Please fill your password.",
  }) 
  .min(8, "Password must be at least 8 characters long."),
});

type FormValues = z.infer<typeof FormSchema>;


export default function Login({ handleSignUpClick = () => {} }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  function onSubmit(data: FormValues) {
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      toast.success('Halo ' + user.displayName)
      router.push("/dashboard")
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        toast.error('User not found. Please sign up first.');
      } else {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    });
  }
  return (
    <main className="flex w-full items-center justify-center">
      <form
        className="space-y-6 py-15  bg-gray-800 bg-opacity-50 border border-blue-500 shadow-lg rounded-lg p-10 text-white w-full max-w-md neon-border"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <h2 className="text-2xl text-white font-bold text-center">Login</h2>
          <label htmlFor="email" className="block text-sm font-medium text-blue-400">
            Email
          </label>
          <input
            id="email"
            {...form.register("email")}
            type="email"
            className="w-full p-3 mt-1 bg-gray-700 border border-blue-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
            placeholder="Enter your email"
          />
          {form.formState.errors.email && (
            <p className="mt-2 text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-blue-400">
            Password
          </label>
          <input
            id="password"
            {...form.register("password")}
            type="password"
            className="w-full p-3 mt-1 bg-gray-700 border border-blue-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
            placeholder="Enter your password"
          />
          {form.formState.errors.password && (
            <p className="mt-2 text-sm text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="flex-row items-center justify-between">
          <button
            type="submit"
            className="flex justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
        <div className="text-sm text-center p-3">
          <a
            className="font-medium text-red-600 hover:text-red-500 cursor-pointer"
            onClick={handleSignUpClick}
          >
            Don&apos;t have an account? Sign Up
          </a>
        </div>
      </form>
    </main>
  );
};