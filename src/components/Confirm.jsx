import React from "react";
import CustomaizedButton from "./Button";
import { Button, Modal, Box, Typography } from "@mui/material";

const Confirm = ({
  confirmDeleteOpen,
  handleConfirmClose,
  handleConfirmDelete,
  text
}) => {
  return (
    <div>
      <Modal
        open={confirmDeleteOpen}
        onClose={handleConfirmClose}
        aria-labelledby="confirm-delete-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "300px",
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography id="confirm-delete-modal" variant="h6" component="h2">
            {text}
          </Typography>

          <Box mt={2} display="flex" justifyContent="space-between">
            <CustomaizedButton
              onClick={handleConfirmClose}
              color="#bb0000"
              text="Cancelar"
              width="100%"
              height="40px"
              margin="24px 30px 20px 0"
            />

            <CustomaizedButton
              onClick={handleConfirmDelete}
              color="#3a9906"
              text="Confirmar"
              width="100%"
              height="40px"
              margin="24px 0 20px 0"
            />
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Confirm;
