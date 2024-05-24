import type { FC } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface RegisterProps {
    children: React.ReactNode;
}



const FormSchema = z.object({
    name: z
      .string({
        required_error: "Please fill your full name.",
      })
      .min(4, "Name must be at least 4 characters long."),
    email: z.string({
      required_error: "Please fill your email.",
    }).email("Invalid email address."),
    password: z.string({
      required_error: "Please fill your password.",
    }) 
    .min(8, "Password must be at least 8 characters long."),
  });

type FormValues = z.infer<typeof FormSchema>;

export const Register : FC<RegisterProps> = ({children}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
      });

    function onSubmit(data: FormValues) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            updateProfile(user, {displayName: data.name})
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    return (
        <main>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white">
                        Name
                    </label>
                    <input
                        id="name"
                        {...form.register("name")}
                        type="text"
                        className="w-full text-black p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {form.formState.errors.name && (
                        <p className="mt-2 text-sm text-red-600">{form.formState.errors.name.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white">
                        Email
                    </label>
                    <input
                        id="email"
                        {...form.register("email")}
                        type="email"
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {form.formState.errors.email && (
                        <p className="mt-2 text-sm text-red-600">{form.formState.errors.email.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white">
                        Password
                    </label>
                    <input
                        id="password"
                        {...form.register("password")}
                        type="password"
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {form.formState.errors.password && (
                        <p className="mt-2 text-sm text-red-600">{form.formState.errors.password.message}</p>
                    )}
                </div>
                <div className="flex-row items-center justify-between">
                    {children}
                    <button
                        type="submit"
                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </main>
    );
};
