import Image from "next/image";
import { ReactNode, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
interface image {
  src: string;
  title: string;
}
const images = [
  {
    src: "/images/banners/jazz.jpeg",
    title: "Jazz",
  },
  {
    src: "/images/banners/pop.jpeg",
    title: "Pop",
  },
  {
    src: "/images/banners/rock.jpeg",
    title: "Rock",
  },
  {
    src: "/images/banners/hiphop.jpeg",
    title: "Hiphop",
  },
  {
    src: "/images/banners/classical.jpeg",
    title: "Classical",
  },
  {
    src: "/images/banners/reggae.jpeg",
    title: "Reggae",
  },
  {
    src: "/images/banners/soul.jpeg",
    title: "Soul",
  },
  {
    src: "/images/banners/latin.jpeg",
    title: "Latin",
  },
];

const DRAG_BUFFER = 50;

export default function SlidingCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const router = useRouter();

  const navigate = (routeName: string) => {
    router.push(`/vinyls?genre=${routeName}`);
  };

  const dragX = useMotionValue(0);

  const onDragStart = () => {
    setDragging(true);
  };
  const onDragEnd = () => {
    setDragging(false);

    const dragDistance = dragX.get();
    if (dragDistance <= -DRAG_BUFFER) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else if (dragDistance >= DRAG_BUFFER) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-neutral-800  py-8">
      <motion.div
        className="flex items-center cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        animate={{ translateX: `-${currentImageIndex * 100}%` }}
        style={{ x: dragX }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <Cards
          images={images}
          imageIndex={currentImageIndex}
          handleClick={(routeName) => navigate(routeName)}
        />
      </motion.div>
    </div>
  );
}

const Cards = ({
  images,
  imageIndex,
  handleClick,
}: {
  images: image[];
  imageIndex: number;
  handleClick: (route: string) => void;
}) => {
  return (
    <>
      {images.map((image: image, i) => (
        <motion.div
          className="aspect-video w-full h-screen py-0 px-0 shrink-0 rounded-lg bg-neutral-800 object-cover "
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          animate={{ scale: imageIndex === i ? 0.8 : 0.7 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 70,
            mass: 3,
          }}
          key={i}
          onTap={() => handleClick(image.title)}
          onPan={() => {}}
        >
          <h1 className="text-white font-bold text-[4rem] p-0 m-0 bg-neutral-900 px-6 rounded-sm">
            {image.title}
          </h1>
        </motion.div>
      ))}
    </>
  );
};
