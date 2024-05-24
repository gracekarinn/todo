import type { FC } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

interface RegisterProps {
  children: React.ReactNode;
}

const FormSchema = z.object({
  name: z
    .string({
      required_error: "Please fill your full name.",
    })
    .min(4, "Name must be at least 4 characters long."),
  email: z
    .string({
      required_error: "Please fill your email.",
    })
    .email("Invalid email address."),
  password: z
    .string({
      required_error: "Please fill your password.",
    })
    .min(8, "Password must be at least 8 characters long."),
});

type FormValues = z.infer<typeof FormSchema>;

export const Register: FC<RegisterProps> = ({ children }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: FormValues) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        updateProfile(user, { displayName: data.name });
        toast.success("Henlo " + data.name)
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          toast.error('Mending login.');
        } else {
          const errorMessage = error.message;
          toast.error(errorMessage);
        }
      });
  }

  return (
    <main className="flex w-full h-full items-center justify-center">
      <form
        className="space-y-6 bg-gray-800 bg-opacity-50 border border-purple-500 shadow-lg rounded-lg p-8 text-white w-full max-w-md neon-border"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <h2 className="text-2xl text-white font-bold text-center">Sign Up</h2>
          <label htmlFor="name" className="block text-sm font-medium text-purple-400">
            Name
          </label>
          <input
            id="name"
            {...form.register("name")}
            type="text"
            className="w-full p-3 mt-1 bg-gray-700 border border-purple-500 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
            placeholder="Enter your full name"
          />
          {form.formState.errors.name && (
            <p className="mt-2 text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-purple-400">
            Email
          </label>
          <input
            id="email"
            {...form.register("email")}
            type="email"
            className="w-full p-3 mt-1 bg-gray-700 border border-purple-500 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
            placeholder="Enter your email"
          />
          {form.formState.errors.email && (
            <p className="mt-2 text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-purple-400">
            Password
          </label>
          <input
            id="password"
            {...form.register("password")}
            type="password"
            className="w-full p-3 mt-1 bg-gray-700 border border-purple-500 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
            placeholder="Enter your password"
          />
          {form.formState.errors.password && (
            <p className="mt-2 text-sm text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="flex-row items-center justify-between">
          {children}
          <button
            type="submit"
            className="flex justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Sign Up
          </button>
        </div>
      </form>
    </main>
  );
};
