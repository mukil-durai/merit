import React from 'react';
import "../css/Animation.css";

const AnimatedComponent = ({ children }) => {
  return (
    <div 
      data-aos="fade-up"
      data-aos-duration="800"
      data-aos-delay="100"
      data-aos-easing="ease-in-out"
    >
      {children}
    </div>
  );
};

export default AnimatedComponent;
