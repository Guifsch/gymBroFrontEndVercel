import React from "react";
import { Button } from "@mui/material";

function Loading({
  color,
  text,
  onClick,
  width,
  height,
  margin,
  padding,
  fontSize,
  disabled,
  type,
}) {
  return (
    <Button
      sx={{
        backgroundColor: color,
        transition: "0.2s",
        width: width,
        height: height,
        margin: margin,
        disabled: disabled,
        fontSize: fontSize,
        padding: padding,
        "&:hover ": {
          filter: "brightness(0.8)",
          backgroundColor: color,
          boxShadow:
            "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
        },
      }}
      variant="contained"
      onClick={onClick}
      type={type}
    >
      {text}
    </Button>
  );
}

export default Loading;
