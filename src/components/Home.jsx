import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Our Website</h1>
      <video 
        controls
        src="/assets/Knit-Fabric.mp4"
        width="600"
        height="400"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Home;