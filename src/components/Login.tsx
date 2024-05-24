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


export default function Login() {
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
      const errorMessage = error.message;
    });
  }
    return (
        <main>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white">
                    Email
                    </label>
                    <input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    required
                    className="w-full my-5 p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    type="password"
                    {...form.register("password")}
                    required
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm my-5"
                    />
                    {form.formState.errors.password && (
                      <p className="mt-2 text-sm text-red-600">{form.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </button>
              </div>
            </form>
    </main>
    )
}