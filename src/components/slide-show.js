import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

// Import local product banner images from src/assets/
import banner1 from '../assets/banner1.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';

// Slideshow Component showing Trending Products with Rupee ₹ Pricing
function IndividualIntervalsExample() {
  return (
    <div className="container mt-3">
      <Carousel fade interval={3000}>
        
        {/* Slide 1: Premium Headphones */}
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-img"
            src={banner1}
            alt="Wireless Headphones"
          />
          <Carousel.Caption className="custom-caption">
            <span className="badge bg-danger mb-2">🔥 Hot Deal</span>
            <h3>Premium Wireless Headphones</h3>
            <p>Immersive sound with active noise cancellation. <strong>Flat 40% OFF - Now ₹9,999</strong></p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2: Urban Sneakers */}
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-img"
            src={banner2}
            alt="Urban Sneakers"
          />
          <Carousel.Caption className="custom-caption">
            <span className="badge bg-warning text-dark mb-2">⚡ New Arrival</span>
            <h3>Urban Elite Streetwear Sneakers</h3>
            <p>Top trending fashion for maximum comfort and style. <strong>Starting at ₹4,999</strong></p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 3: Smartwatch Tech */}
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-img"
            src={banner3}
            alt="Smartwatch Tech"
          />
          <Carousel.Caption className="custom-caption">
            <span className="badge bg-info text-dark mb-2">✨ Trending</span>
            <h3>Smart Fitness & Tech Watch</h3>
            <p>Track workouts, sleep & health in real-time. <strong>Special Discount ₹3,499</strong></p>
          </Carousel.Caption>
        </Carousel.Item>

      </Carousel>
    </div>
  );
}

export default IndividualIntervalsExample;