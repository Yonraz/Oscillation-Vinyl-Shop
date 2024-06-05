"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/navigation";

interface FormFields {
  email: string;
  password: string;
}

export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const { requestErrors, sendRequest, isLoading } = useRequest();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      if (errors.email || errors.password) return;
      const { email, password } = data;

      await sendRequest({
        url: "/api/users/signin",
        method: "post",
        body: {
          email,
          password,
        },
        onSuccess: (value: any) => router.push("/"),
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      {(isSubmitting || isLoading) && <LoadingSpinner />}
      <div className="max-w-sm w-full max-h-sm">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-10 mb-4 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
              type="text"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password must have between 4 and 20 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Password must have between 4 and 20 characters",
                },
              })}
              type="password"
              placeholder="*********"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isSubmitting}
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              onClick={() => router.push("/auth/signup")}
            >
              Do not have an account?
            </a>
          </div>
          {requestErrors && (
            <div className="w-full">
              {requestErrors.map((err, index) => (
                <li
                  key={index}
                  className="text-red-700 text-xs font-semibold italic"
                >
                  {err.message}
                </li>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
