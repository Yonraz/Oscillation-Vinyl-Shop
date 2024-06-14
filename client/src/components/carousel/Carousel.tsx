import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "react-feather";

interface CarouselProps {
  children: React.ReactNode[];
}

enum Direction {
  UP = 1,
  DOWN = -1,
}

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    animateCarousel(Direction.DOWN);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
    }, 500);
  };

  const handlePrev = () => {
    animateCarousel(Direction.UP);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + children.length) % children.length
      );
    }, 500);
  };

  const animateCarousel = (direction: Direction) => {
    const sign = direction === Direction.UP ? "" : "-";
    const carousel = document.getElementById("carousel-item");
    if (carousel) {
      carousel.style.transform = `translateY(${sign}100%)`;
      carousel.style.opacity = "0";
      carousel.style.transition = "all 0.2s ease-in-out";
      setTimeout(() => {
        carousel.style.transform = "translateY(0)";
        carousel.style.opacity = "1";
        carousel.style.transition = "all 0.5s ease-in-out";
      }, 500);
    }
  };

  return (
    <div className="h-72 flex flex-col justify-between items-center p-6">
      <ChevronUp onClick={handlePrev} className="chevron">
        Previous
      </ChevronUp>
      <div id="carousel-item">{children[currentIndex]}</div>
      <ChevronDown onClick={handleNext} className="chevron">
        Next
      </ChevronDown>
    </div>
  );
};

export default Carousel;
