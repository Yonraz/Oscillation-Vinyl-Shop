"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import ErrorList from "@/components/errors/ErrorList";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, "Password must be between 6 and 20 characters")
    .max(20, "Password must be between 6 and 20 characters"),
});
type FormSchemaType = z.infer<typeof formSchema>;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(formSchema) });
  const { requestErrors, sendRequest, isLoading } = useRequest();
  const { setCurrentUser } = useUser();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      if (errors.email || errors.password) return;
      const { email, password } = data;

      await sendRequest({
        url: "/api/users/signup",
        method: "post",
        body: {
          email,
          password,
        },
        onSuccess: (value: any) => {
          setCurrentUser(value);
          router.push("/");
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-start w-full min-h-screen overflow-hidden bg-neutral-800">
      {(isSubmitting || isLoading) && <LoadingSpinner />}
      <div className="max-w-lg max-h-lg mt-8">
        <form
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-10 mb-4 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <FormInput
              validation={formSchema.shape.email}
              register={register}
              label="Email Address"
              name="email"
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
            <FormInput
              validation={formSchema.shape.password}
              register={register}
              label="Password"
              name="password"
              type="password"
              placeholder="*******"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mb-2">
            <Button
              className="button-primary"
              type="submit"
              disabled={isSubmitting}
            >
              Sign Up
            </Button>
          </div>
          <Link
            className="font-bold text-sm text-neutral-500 hover:text-neutral-800"
            href="/auth/signin"
          >
            Already have an account?
          </Link>
          {requestErrors && <ErrorList errors={requestErrors} />}
        </form>
      </div>
    </div>
  );
}
