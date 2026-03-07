import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import "./Banner.css";

const slides = [
  {
    image: "/images/image1.webp",
    heading: "Glow Up Your Style",
    subtext: "Discover trending beauty and skincare essentials.",
    btnText: "Shop Now",
  },
  {
    image: "/images/image2.webp",
    heading: "Cook with Confidence",
    subtext: "Top-quality kitchen tools delivered to your door.",
    btnText: "Explore Collection",
  },
  {
    image: "/images/image3.webp",
    heading: "Fast & Secure Delivery",
    subtext: "Your favorite products, shipped with care.",
    btnText: "Start Shopping",
  },
];

const Banner = () => {

    const [current, setCurrent] = useState(0);
    const navigate = useNavigate()

    useEffect(() =>{

        const interval = setInterval(() =>{
            setCurrent((prev) => prev === slides.length - 1 ? 0 : prev + 1);
        }, 4000)

        return () => clearInterval(interval);

    },[])

  return (
    <div className='banner'>
              {slides.map((slide, index) => (
        <div
          className={`slide ${index === current ? "active-dot" : ""}`}
          key={index}
        >
          <img src={slide.image} loading='lazy' alt={slide.heading} />
          <div className="overlay">
            <h1>{slide.heading}</h1>
            <p>{slide.subtext}</p>
            <button type="button" onClick={() => navigate("/products")}>{slide.btnText}</button>
          </div>
        </div>
      ))}

      <div className="dots" role="tablist" aria-label="Carousel slides">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-label={index === current ? `Slide ${index + 1}, current` : `Go to slide ${index + 1}`}
            aria-selected={index === current}
            className={current === index ? "dot active-dot" : "dot"}
            onClick={() => setCurrent(index)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrent(index); } }}
          />
        ))}
      </div>
    </div>
  )
}

export default Banner