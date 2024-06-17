"use client";
import { Genre } from "@/types/genre";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFile } from "@/utils/aws";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import FormInput from "@/components/ui/FormInput";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import FileInput from "@/components/ui/FileUpload/FileUpload";

const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0.01, "Price must be greater than 0")
  ),
  genre: z.nativeEnum(Genre, { message: "Genre is required" }),
  description: z
    .string()
    .max(250, "Description must be less than 250 characters"),
});
type FormSchemaType = z.infer<typeof formSchema>;
const NewVinylForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(formSchema) });
  const router = useRouter();
  const { currentUser } = useUser();
  // useEffect(() => {
  //   if (!currentUser) {
  //     router.push("/auth/signin");
  //   }
  // }, []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { sendRequest, isLoading } = useRequest();

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadFile(file);
      return url;
    } catch (error) {
      console.error("Error uploading file: ", error);
      return null;
    }
  };

  const onSubmit = async (data: FormSchemaType) => {
    if (!imageFile) {
      alert("Please select an image");
      return;
    }
    const imageUrl = await handleImageUpload(imageFile);
    if (!imageUrl) {
      alert("Image upload failed. Please try again.");
      return;
    }

    const newVinyl = {
      title: data.title,
      price: data.price,
      genre: data.genre,
      description: data.description,
      imageUrl,
    };

    try {
      await sendRequest({
        url: "/api/vinyls",
        method: "post",
        body: newVinyl,
        onSuccess: () => router.push("/"),
      });
      alert("Vinyl added successfully!");
      reset();
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("Error submitting form. Please try again.");
    }
  };

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  }

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
              register={register}
              validation={formSchema.shape.title}
              name="title"
              label="Title"
              type="text"
              placeholder="Title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs italic">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <FormInput
              register={register}
              validation={formSchema.shape.price}
              name="price"
              label="Price"
              placeholder="Price"
              type="number"
              step="0.01"
            />
            {errors.price && (
              <p className="text-red-500 text-xs italic">
                A price must be selected
              </p>
            )}
          </div>
          <div className="mb-4">
            <Select
              register={register}
              name="genre"
              validation={{ required: true }}
              label="Genre"
            >
              <option value="">Select a genre</option>
              {Object.keys(Genre).map((key) => (
                <option key={key} value={key}>
                  {/* @ts-ignore */}
                  {Genre[key]}
                </option>
              ))}
            </Select>
            {errors.genre && (
              <p className="text-red-500 text-xs italic">
                {errors.genre.message}
              </p>
            )}
          </div>
          <div className="mb-8 flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              maxLength={250}
              className="border-2 rounded-md"
              {...register("description", { required: true })}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <FileInput
              label="Upload Image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageFile && (
              <p className=" overflow-ellipsis">{imageFile.name}</p>
            )}
          </div>
          <Button className="button-primary" type="submit">
            Add Vinyl
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewVinylForm;
