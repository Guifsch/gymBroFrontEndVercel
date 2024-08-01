import React, { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import CardMedia from "@mui/material/CardMedia";

const ImageWithPlaceholder = ({
  src,
  alt,
  width,
  maxWidth,
  height,
  marginTop,
  borderRadius,
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleImageLoad = () => {
    setLoaded(true);
  };

  return (
    <div
      style={{
        width,
        height,
        maxWidth,
        position: "relative",
        marginTop,
        "& > img ": {
          borderRadius,
        },
      }}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0, borderRadius }}
        />
      )}
      <CardMedia
        component="img"
        image={src}
        alt={alt}
        onLoad={handleImageLoad}
        style={{
          width: "100%",
          height: "100%",
          borderRadius,
          objectFit: "contain",
          display: loaded ? "block" : "none",
        }}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
