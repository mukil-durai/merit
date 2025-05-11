import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const ImageWithFallback = ({ src, alt, style, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => {
    if (!src) return "https://via.placeholder.com/250";
    if (src.startsWith("http") || src.startsWith("data:image")) {
      return src;
    }
    return `data:image/jpeg;base64,${src}`;
  });

  return (
    <div style={{ position: 'relative', ...style }}>
      {!loaded && <Skeleton height={style?.height || 250} />}
      <img
        src={imgSrc}
        alt={alt}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
          position: loaded ? "static" : "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }}
        className={className}
        onError={() => setImgSrc("https://via.placeholder.com/250")}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default ImageWithFallback;
