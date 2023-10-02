import Layout from "@/components/Layout";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { getError } from "@/utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";

export default function Register() {
  const { data: session } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (session?.user) {
  //     router.push("/profile");
  //   }
  // }, [router, session]);

  const { handleSubmit, register, formState: { errors } } = useForm();

  const registerUser = async ({ username, password }) => {
    try {
      await axios.post("/api/auth/register", {
        username,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        router.push(`/authenticate-telco?username=${username}`);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };



  return (
    <Layout title="Register">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <form action="" className="mx-auto max-w-screen-md card" onSubmit={handleSubmit(registerUser)}>
          <h1 className="mt-6 text-center text-2xl font-extrabold text-gray-900">Welcome to Telco Data App</h1>
            <h1 className="mb-4 text-xl text-center text-primary">Create an Account </h1>
            <div className="mb-4">
                    <label htmlFor="name">Username</label>
                    <input type="text"
                    {...register('username', {required:'Please enter username'})} 
                    className="w-full" id="username" autoFocus />
                    {
                        errors.username && (
                            <div className="text-red-500">
                                {errors.email.username}
                            </div>
                        )
                    }
                </div>

                <div className="mb-4">
                    <label htmlFor="password">Password</label>
                    <input type="password" 
                        {...register('password', {
                            required:'Please enter valid password',
                            minLength: {value: 4, message: 'Password must be at least 6 characters'}
                        })}
                        className="w-full" id="password" autoFocus />
                    {
                        errors.password && (
                            <div className="text-red-500">
                                {errors.password.message}
                            </div>
                        )
                    }
                    
                </div>
                <div className="mb-4 text-center">
                    <button className="secondary-button">Register</button>
                </div>
        </form>
      </div>
    </Layout>
  );
}

