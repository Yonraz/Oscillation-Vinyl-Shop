"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { z } from "zod";
import ErrorList from "@/components/errors/ErrorList";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/ui/FormInput";
import Link from "next/link";
import Button from "@/components/ui/Button";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, "Password must be between 6 and 20 characters")
    .max(20, "Password must be between 6 and 20 characters"),
});
type FormSchemaType = z.infer<typeof formSchema>;

export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(formSchema) });
  const { requestErrors, sendRequest, isLoading } = useRequest();
  const router = useRouter();
  const { setCurrentUser } = useUser();
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
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
        onSuccess: (value: any) => {
          setCurrentUser(value);
          router.push("/");
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
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
              name="password"
              label="Password"
              register={register}
              validation={formSchema.shape.password}
              type="password"
              placeholder="*******"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-2">
            <Button
              className="button-secondary"
              type="submit"
              disabled={isSubmitting}
            >
              Sign In
            </Button>
          </div>
          <Link
            className="font-bold text-sm text-neutral-500 hover:text-neutral-800"
            href={"/auth/signup"}
          >
            Don't have an account?
          </Link>
          {requestErrors && <ErrorList errors={requestErrors} />}
        </form>
      </div>
    </div>
  );
}
