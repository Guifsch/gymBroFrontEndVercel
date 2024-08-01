import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

function Loading({ top, width }) {
  const { loading } = useSelector((state) => state.loading);

  return (
    <Box
      sx={{
        position: "absolute",
        width: width ? width : "100%",
        zIndex: 1,
        top: { top },
      }}
    >
      {loading ? <LinearProgress /> : false}
    </Box>
  );
}

export default Loading;
