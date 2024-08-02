import {
  Container,
  Modal,
  IconButton,
  Typography,
  Button,
  TextField,
  Backdrop,
  LinearProgress,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import { useDispatch } from "react-redux";
import CustomaizedButton from "../components/Button";
import React, { useCallback, useState, useEffect } from "react";
import axiosConfig from "../utils/axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: "auto",
  maxHeight: 700,
  borderRadius: "5px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "overlay",
  "@media (max-width:600px)": {
    width: "100%",
    maxHeight: "520px",
  },
  "@media (max-height:700px)": {
    maxHeight: "400px",
  },
};

export default function ModalWorkoutCategory({
  open,
  handleClose,
  modalWorkoutCategoryRefreshRef,
}) {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState([]);
  const [fields, setFields] = useState([]);
  const [workoutsCategorysArray, setWorkoutsCategorysArray] = useState([]);
  const [workoutsCategorys, setWorkoutsCategorys] = useState({});

  const getWorkoutCategorys = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/category/categorys`, {
        withCredentials: true,
      });

      if (response.data.length > 0) {
        setWorkoutsCategorys(response.data);

        setWorkoutsCategorysArray(response.data[0].categoryItems);
      } else {
        setWorkoutsCategorysArray([]);
      }
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    }
  }, []);

  useEffect(() => {
    getWorkoutCategorys();
  }, [getWorkoutCategorys]);

  const refreshModalRef = () => {
    modalWorkoutCategoryRefreshRef();
  };

  const submitCategory = async (e) => {
    setLoading(true);

    const request = { categoryItems: fields };

    try {
      const response = await axiosInterceptor.post(
        `/api/category/categorys`,
        request,
        { withCredentials: true }
      );

      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      setLoading(false);
      getWorkoutCategorys();
      setFields([]);
      setInputValues([""]);
      refreshModalRef();
    }
  };

  const udpateCategory = async (e) => {
    setLoading(true);
    const categoryItemsId = workoutsCategorys[0]._id;
    const request = { categoryItems: fields };
    try {
      const response = await axiosInterceptor.put(
        `/api/category/update/${categoryItemsId}`,
        request,
        { withCredentials: true }
      );
      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      setLoading(false);
      getWorkoutCategorys();
      setFields([]);
      setInputValues([""]);
      refreshModalRef();
    }
  };

  const deleteCategory = async (e) => {
    setLoading(true);
    const categoryItemsId = workoutsCategorys[0]._id;
    try {
      const response = await axiosInterceptor.delete(
        `/api/category/categorys/${categoryItemsId}/categoryItems/${e}`,
        { withCredentials: true }
      );
      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      setLoading(false);
      getWorkoutCategorys();
      setFields([]);
      setInputValues([""]);
      refreshModalRef();
    }
  };

  const handleChange = (e, index) => {
    const newValues = [...inputValues];
    newValues[index] = e.target.value;
    setInputValues(newValues);

    const newCategoryItems = [...fields];
    newCategoryItems[index].name = e.target.value;
    setFields(newCategoryItems);
  };

  const categoryAdd = () => {
    setFields([...fields, { name: "" }]);
  };
  const categoryRemove = () => {
    setFields(fields.slice(0, -1));
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => {
        handleClose();
        setFields([]);
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          position: "relative",
        },
      }}
    >
      <Box sx={style}>
        <IconButton
          onClick={() => {
            handleClose();
            setFields([]);
          }}
          size="large"
          sx={{
            position: "absolute",
            top: "5px",
            right: "10px",
            zIndex: "999",
          }}
          aria-label="back"
          color="primary"
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>

        {loading ? (
          <LinearProgress
            sx={{
              width: "100%",
              position: "sticky",
              top: 0,
            }}
          />
        ) : (
          false
        )}
        <Box
          className="boxDad"
          sx={{
            "&:hover > svg": {
              visibility: "visible",
              transition: "0.5s",
              opacity: 1,
            },
            display: "flex",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "40px 40px 0 40px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CustomaizedButton
                onClick={categoryAdd}
                color="#491290"
                text="Adicionar categoria"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                paddingTop: "50px",
                flexDirection: "row",
                "@media (max-width:600px)": {
                  flexDirection: "column",
                  alignItems: "center",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "50%",
                  padding: "15px",
                  flexDirection: "column",
                  alignItems: "initial",
                  justifyContent: "flex-start",
                  borderTop: "1px solid #00000061",
                  borderLeft: "1px solid #00000061",
                  borderBottom: "1px solid #00000061",
                  borderRight: "1px solid #00000017",
                  "@media (max-width:600px)": {
                    alignItems: "initial",
                    minHeight: "125px",
                    minWidth: "230px",
                    borderTop: "1px solid #00000061",
                    borderLeft: "1px solid #00000061",
                    borderBottom: "1px solid #00000017",
                    borderRight: "1px solid #00000061",
                  },
                }}
              >
                {fields.map((item, index) => (
                  <TextField
                    key={index}
                    onChange={(e) => handleChange(e, index)}
                    type="text"
                    required
                    id={`field-${index}`}
                    label="Nome"
                    variant="filled"
                    autoComplete="on"
                    sx={{
                      width: "80%",
                      my: "10px",
                      "& input": {
                        padding: "24px 10px 3px 13px",
                      },
                      "& .MuiInputLabel-shrink": { top: "-3px" },
                      "@media (max-width:600px)": {
                        marginRight: "0",
                        marginLeft: "16px",
                        width: "75%",
                      },
                    }}
                    value={inputValues[index] || ""}
                  />
                ))}

                {fields.length > 0 ? (
                  <Button
                    sx={{
                      position: "relative",
                      bottom: "50px",
                      minWidth: "auto",
                      backgroundColor: "#bb0000",
                      color: "white",
                      borderRadius: "50%",
                      left: "200px",
                      width: "25px",
                      height: "25px",
                      "&:hover": { backgroundColor: "rgb(4 4 4 / 96%)" },
                      "@media (max-width:600px)": {
                        left: "140px",
                      },
                    }}
                    onClick={categoryRemove}
                  >
                    X
                  </Button>
                ) : (
                  false
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "50%",
                  padding: "15px",
                  flexDirection: "column",
                  alignItems: "normal",
                  justifyContent: "flex-start",
                  borderTop: "1px solid #00000061",
                  borderRight: "1px solid #00000061 ",
                  borderBottom: "1px solid #00000061",

                  "@media (max-width:600px)": {
                    minHeight: "125px",
                    minWidth: "230px",
                    borderTop: "1px solid #00000017",
                    borderLeft: "1px solid #00000061",
                    borderBottom: "1px solid #00000061",
                    borderRight: "1px solid #00000061",
                  },
                }}
              >
                {workoutsCategorysArray.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      p: "10px 15px 10px 15px",
                      my: "10px",
                      borderRadius: "3px",
                      border: "solid 2px",
                      height: "50px",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      type="text"
                      required
                      variant="standard"
                      autoComplete="on"
                      sx={{
                        width: "26%",
                      }}
                    >
                      {item.name}
                    </Typography>

                    <CustomaizedButton
                      onClick={() => deleteCategory(item._id)}
                      color="#bb0000"
                      text="Deletar"
                      fontSize=" 0.7rem"
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {workoutsCategorysArray.length > 0 ? (
            <CustomaizedButton
              onClick={udpateCategory}
              color="#3a9906"
              text="Salvar"
              width="150px"
              margin="30px 0 30px 0"
            />
          ) : (
            <CustomaizedButton
              onClick={submitCategory}
              color="#3a9906"
              text="Salvar"
              width="150px"
              margin="30px 0 30px 0"
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
}
