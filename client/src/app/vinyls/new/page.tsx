"use client";
import { Genre } from "@/types/genre";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/user-context";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string(),
  price: z.number().min(0.01, "Price must be greater than 0"),
  genre: z.nativeEnum(Genre),
  description: z.string(),
});
type FormSchemaType = z.infer<typeof formSchema>;
const NewVinylForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({ resolver: zodResolver(formSchema) });
  const router = useRouter();
  const { currentUser } = useUser();
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/signin");
    }
  }, []);
  const imageFile = watch("image");
  const { sendRequest } = useRequest();

  const handleImageUpload = async (file: File) => {
    try {
      const response = await axios.get("/s3-presigned-url", {
        params: {
          fileName: file.name,
          fileType: file.type,
        },
      });

      const { url, fields } = response.data;
      const formData = new FormData();

      for (const key in fields) {
        formData.append(key, fields[key]);
      }

      formData.append("file", file);

      await axios.post(url, formData);
      return `${url}/${file.name}`;
    } catch (error) {
      console.error("Error uploading file: ", error);
      return null;
    }
  };

  const onSubmit = async (data: FormSchemaType) => {
    // const imageUrl = await handleImageUpload(data.image[0]);
    //TODO: upload to s3
    const imageUrl = "placeholder";

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title:</label>
        <input type="text" {...register("title", { required: true })} />
        {errors.title && <span>This field is required</span>}
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          {...register("price", { required: true, valueAsNumber: true })}
        />
        {errors.price && <span>This field is required</span>}
      </div>
      <div>
        <label>Genre:</label>
        <select {...register("genre", { required: true })}>
          <option value="">Select a genre</option>
          {Object.keys(Genre).map((key) => (
            <option key={key} value={key}>
              {/* @ts-ignore */}
              {Genre[key]}
            </option>
          ))}
        </select>
        {errors.genre && <span>This field is required</span>}
      </div>
      <div>
        <label>Description:</label>
        <textarea {...register("description", { required: true })}></textarea>
        {errors.description && <span>This field is required</span>}
      </div>
      <div>
        <label>Image:</label>
        <input type="file" />
        {errors.image && <span>This field is required</span>}
      </div>
      <button type="submit">Add Vinyl</button>
    </form>
  );
};

export default NewVinylForm;
