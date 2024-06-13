"use client";

interface errorInterface {
  message: string;
}

export default function ErrorList(props: { errors: errorInterface[] }) {
  const { errors } = props;
  return (
    <div className="w-full bg-red-300">
      {errors.map((err, index) => (
        <li key={index} className="text-red-700 text-xs font-semibold italic">
          {err.message}
        </li>
      ))}
    </div>
  );
}
