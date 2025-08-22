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
    buttonText: "Shop Now",
    buttonLink: "/products",
    backgroundImage: "/api/placeholder/800/400",
    backgroundColor: "from-purple-400 to-pink-400",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "Design Your Tee With",
    subtitle: "GOOGLE AI",
    description: "Experience Endless Imagination",
    buttonText: "Try Now",
    buttonLink: "/ai-design",
    backgroundImage: "/api/placeholder/800/400",
    backgroundColor: "from-blue-500 to-cyan-400",
    textColor: "text-white"
  },
  {
    id: 3,
    title: "BUY 3",
    subtitle: "CLASSIC FIT T-SHIRTS", 
    description: "AT ₹999",
    buttonText: "Explore",
    buttonLink: "/products",
    backgroundImage: "/api/placeholder/800/400",
    backgroundColor: "from-green-400 to-blue-500",
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
    <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-2xl bg-gray-100">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full h-full bg-gradient-to-r ${slide.backgroundColor} flex items-center justify-between px-8 md:px-16`}
          >
            <div className={`${slide.textColor} max-w-md`}>
              <h2 className="text-3xl md:text-5xl font-bold mb-2">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  {slide.subtitle}
                </h3>
              )}
              <p className="text-xl md:text-2xl font-bold mb-6">
                {slide.description}
              </p>
              <Button
                className="bg-white text-gray-800 hover:bg-gray-100 font-bold px-8 py-3 rounded-full text-lg"
                onClick={() => window.location.href = slide.buttonLink}
              >
                {slide.buttonText}
              </Button>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Product showcase"
                className="rounded-xl shadow-xl"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
        data-testid="carousel-prev"
      >
        <i className="fas fa-chevron-left text-gray-700"></i>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
        data-testid="carousel-next"
      >
        <i className="fas fa-chevron-right text-gray-700"></i>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index
                ? "bg-white scale-110"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            data-testid={`carousel-dot-${index}`}
          />
        ))}
      </div>

      {/* Auto-play Toggle */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
        data-testid="carousel-play-pause"
      >
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-gray-700`}></i>
      </button>
    </div>
  );
}