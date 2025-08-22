import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  backgroundColor: string;
  textColor: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "BUY 2",
    subtitle: "OVERSIZED T-SHIRTS",
    description: "AT ₹999",
    buttonText: "",
    buttonLink: "/products",
    backgroundImage: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    backgroundColor: "bg-gradient-to-r from-orange-400 to-pink-500",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "Design Your Tee With",
    subtitle: "GOOGLE AI",
    description: "Experience Endless Imagination",
    buttonText: "",
    buttonLink: "/ai-design",
    backgroundImage: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    backgroundColor: "bg-gradient-to-r from-blue-400 to-purple-600",
    textColor: "text-white"
  },
  {
    id: 3,
    title: "BUY 3",
    subtitle: "CLASSIC FIT T-SHIRTS", 
    description: "AT ₹999",
    buttonText: "",
    buttonLink: "/products",
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    backgroundColor: "bg-gradient-to-r from-pink-400 to-red-500",
    textColor: "text-white"
  }
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-300 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full h-full ${slide.backgroundColor} relative cursor-pointer`}
            onClick={() => window.location.href = slide.buttonLink}
          >
            <div className="absolute inset-0 flex items-center justify-between px-8 md:px-16">
              <div className={`${slide.textColor} z-10`}>
                <h2 className="text-2xl md:text-4xl font-black mb-1">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <h3 className="text-xl md:text-3xl font-black mb-2">
                    {slide.subtitle}
                  </h3>
                )}
                <p className="text-lg md:text-2xl font-bold">
                  {slide.description}
                </p>
              </div>
              <div className="hidden md:block relative z-10">
                <img 
                  src={slide.backgroundImage}
                  alt="Product showcase"
                  className="w-48 h-32 md:w-64 md:h-40 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-90 p-1.5 rounded-full transition-all z-20"
        data-testid="carousel-prev"
      >
        <i className="fas fa-chevron-left text-gray-800 text-sm"></i>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-90 p-1.5 rounded-full transition-all z-20"
        data-testid="carousel-next"
      >
        <i className="fas fa-chevron-right text-gray-800 text-sm"></i>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index
                ? "bg-white"
                : "bg-white bg-opacity-40 hover:bg-opacity-70"
            }`}
            data-testid={`carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}