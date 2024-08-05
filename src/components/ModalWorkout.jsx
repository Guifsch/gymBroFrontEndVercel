import {
  Box,
  Modal,
  IconButton,
  Typography,
  CardMedia,
  TextField,
  Backdrop,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  LinearProgress,
} from "@mui/material";
import ImageWithPlaceholder from "../utils/imagePlaceHolderUntilLoad";
import CloseIcon from "@mui/icons-material/Close";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import { useNavigate } from "react-router-dom";
import CustomaizedButton from "../components/Button";
import { validateInputPost } from "../utils/validateInputPost";
import { useSelector, useDispatch } from "react-redux";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { app } from "../firebase";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import axiosConfig from "../utils/axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    sx: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 247.31,
    },
  },
};

const style = {
  position: "absolute",
  width: " 100%",
  top: "50%",
  borderRadius: "5px",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 1000,
  maxHeight: 650,
  height: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  overflowY: "overlay",
  boxShadow: 24,
  "@media (max-width:600px)": {
    width: " 100%",
  },
  "@media (max-height:550px)": {
    maxHeight: "400px",
  },
};

export default function ModalWorkout({
  open,
  handleClose,
  getWorkoutRef,
  modalContentUpdate,
  modalImageShow,
  refreshModalRefCategory,
  categoryInputClean,
  calendarWorkoutUpdate,
}) {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  let history = useNavigate();
  const [content, setContent] = useState({
    name: "",
    rep: "",
    serie: "",
    weight: "",
    exercisePicture: "",
    comment: "",
    category: [],
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(undefined);
  const [workoutsCategorys, setWorkoutsCategorys] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  useEffect(() => {
    try {
      if (modalContentUpdate.category && modalContentUpdate.category.length > 0)
        setSelectedOption(modalContentUpdate.category[0]._id);
    } catch (e) {
      console.log(e);
    }
    setContent(modalContentUpdate);
  }, [modalContentUpdate]);

  useEffect(() => {
    try {
      setSelectedOption(null);
    } catch (e) {
      console.log(e);
    }
  }, [categoryInputClean]);

  const getWorkoutCategorys = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/category/categorys`, {
        withCredentials: true,
      });

      if (response.data.length > 0) {
        setWorkoutsCategorys(response.data[0].categoryItems);
      } else {
        setWorkoutsCategorys([]);
      }
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    }
  }, []);

  useEffect(() => {
    getWorkoutCategorys();
  }, [refreshModalRefCategory, getWorkoutCategorys]);

  const getWorkoutRefValue = () => {
    getWorkoutRef((prevCount) => prevCount + 1);
  };

  const handleChange = (e) => {
    setContent({ ...content, [e.target.id]: e.target.value });
  };

  const handleChangeCategory = (event) => {
    const selectedId = event.target.value;
    setSelectedOption(selectedId);

    // Verificar se selectedId não é uma string vazia
    if (selectedId !== "") {
      // Encontrar o objeto correspondente ao selectedId no array de workoutsCategorys
      const selectedOptionObject = workoutsCategorys.find(
        (option) => option._id === selectedId
      );

      // Verificar se selectedOptionObject foi encontrado
      if (selectedOptionObject) {
        // Atualizar o conteúdo com a nova selectedOption e category
        setContent((prevContent) => ({
          ...prevContent,
          category: selectedOptionObject,
        }));
      } else {
        // Caso selectedOptionObject não seja encontrado, limpar o conteúdo relacionado à opção selecionada
        setContent((prevContent) => ({
          ...prevContent,
          category: "", // Limpa category
        }));
      }
    } else {
      // Caso selecionado "Nenhum", limpar o conteúdo relacionado à opção selecionada
      setContent((prevContent) => ({
        ...prevContent,
        category: "", // Limpa category
      }));
    }
  };

  const profileImage = async (e) => {
    const image = e.target.files[0];

    if (image && image.type.startsWith("image/")) {
      setImage(image);
      let fileReader;
      if (image) {
        fileReader = new FileReader();
        fileReader.onload = (e) => {
          const { result } = e.target;
          if (result) {
            setImagePreview(result);
          }
        };
        fileReader.readAsDataURL(image);
      }
    } else {
      if (fileRef.current) {
        fileRef.current.value = ""; // Resetar o valor do input do tipo file
      }
      setImagePreview(null);
      setImage(null);
      dispatch(snackBarMessageError("Formato ou tamanho incorreto da imagem!"));
    }
  };

  const handleFileUpload = async (image) => {
    try {
      const storage = getStorage(app);
      const newDirectory = currentUser.username;
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, `${newDirectory}/${fileName}`);
      // const storageRef = ref(storage, fileName);

      const uploadTaskPromise = (fileRef, file) => {
        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(fileRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => {
              reject(error);
              dispatch(
                snackBarMessageError("Formato ou tamanho incorreto da imagem!")
              );
              setLoading(false);
            },
            () => {
              resolve(uploadTask.snapshot.ref);
            }
          );
        });
      };

      const fileRef = await uploadTaskPromise(storageRef, image);
      const downloadURL = await getDownloadURL(fileRef);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const submitWorkout = async (e) => {
    setLoading(true);

    try {
      let updatedContent = { ...content };
      //Validação para evitar que o firabase registre a imagem mesmo tendo campos vazios
      validateInputPost(updatedContent, ["exercisePicture", "comment"]);

      if (imagePreview) {
        const imageUrl = await handleFileUpload(image);
        updatedContent = { ...updatedContent, exercisePicture: imageUrl };
      }

      const response = await axiosInterceptor.post(
        `/api/workout/workouts`,
        updatedContent,
        { withCredentials: true }
      );

      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      setLoading(false);
      getWorkoutRefValue();
      if (fileRef.current) {
        fileRef.current.value = ""; // Resetar o valor do input do tipo file
      }
    }
  };

  const submitWorkoutUpdate = async () => {
    setLoading(true);
    try {
      let workoutUpdated = { ...content };
      validateInputPost(workoutUpdated, ["exercisePicture", "comment"]);
      if (imagePreview) {
        await removeImageFirebase(modalContentUpdate.exercisePicture);
        const imageUrl = await handleFileUpload(image);
        workoutUpdated = { ...workoutUpdated, exercisePicture: imageUrl };
      }

      const response = await axiosInterceptor.post(
        `/api/workout/update/${workoutUpdated._id}`,
        workoutUpdated,
        { withCredentials: true }
      );
      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      getWorkoutRefValue();
      setLoading(false);
    }
  };

  const removeImageFirebase = async (img) => {
    try {
      const storage = getStorage(app);
      const imageRef = ref(storage, img);
      deleteObject(imageRef);
    } catch (e) {
      console.log(e);
    }
  };

  const isEmpty = (value) => {
    // Verifica se o valor é uma string vazia ou um array vazio variar o botão salvar ou atualizar
    return (
      (typeof value === "string" && value === "") ||
      (Array.isArray(value) && value.length === 0)
    );
  };

  const allValuesAreEmpty = Object.values(modalContentUpdate).every(isEmpty);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => {
        handleClose();
        setImagePreview(undefined);
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
            setImagePreview(undefined);
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
        {modalImageShow ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                objectFit: "contain",
                maxHeight: "700px",
                maxWidth: "700px",
                height: "100%",
                width: "100%",
              }}
              image={modalImageShow}
            />
          </Box>
        ) : (
          <Box
            className="boxDad"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              height: "100%",
              padding: "40px 40px 0 40px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                margin: "10px 0 27px 0",
              }}
            >
              {calendarWorkoutUpdate ? (
                <CustomaizedButton
                  onClick={() => history(-1)}
                  color="#ff6f00"
                  text=" Voltar"
                />
              ) : (
                false
              )}
            </Box>
            <Box
              sx={{
                "&:hover > svg": {
                  visibility: "visible",
                  transition: "0.5s",
                  opacity: 1,
                },
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                "@media (max-width:1000px)": {
                  flexDirection: "column",
                  "& > div": {
                    width: "100%",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  width: "60%",
                  "@media (max-width:1000px)": {
                    flexDirection: "column",
                    pb: 5,
                    "& > div": {
                      width: "100%",
                    },
                  },
                }}
              >
                <TextField
                  onChange={handleChange}
                  type="name"
                  required
                  id="name"
                  value={content.name}
                  label="Nome"
                  variant="filled"
                  autoComplete="on"
                  sx={{
                    width: "45.001%",
                    marginRight: "5%",
                  }}
                />
                <TextField
                  onChange={handleChange}
                  type="rep"
                  value={content.rep}
                  required
                  id="rep"
                  label="Repetições"
                  variant="filled"
                  autoComplete="on"
                  sx={{
                    width: "45.001%",
                    marginRight: "5%",
                    "@media (max-width:1000px)": {
                      marginTop: "5%",
                    },
                  }}
                />
                <TextField
                  onChange={handleChange}
                  type="serie"
                  required
                  id="serie"
                  value={content.serie}
                  label="Series"
                  variant="filled"
                  autoComplete="on"
                  sx={{
                    width: "45.001%",
                    marginRight: "5%",
                    marginTop: "5%",
                  }}
                />

                <TextField
                  onChange={handleChange}
                  type="weight"
                  required
                  id="weight"
                  label="Peso"
                  value={content.weight}
                  variant="filled"
                  autoComplete="on"
                  sx={{
                    width: "45.001%",
                    marginRight: "5%",
                    marginTop: "5%",
                  }}
                />
                <Box
                  sx={{
                    width: "45.001%",
                    marginRight: "5%",
                    marginTop: "5%",
                  }}
                >
                  <FormControl variant="filled" sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Categoria
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={selectedOption || ""}
                      onChange={handleChangeCategory}
                      autoWidth
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">
                        <em>Nenhum</em>
                      </MenuItem>
                      {workoutsCategorys.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <TextField
                  id="comment"
                  label="Comentário"
                  multiline
                  type="comment"
                  value={content.comment || ""}
                  onChange={handleChange}
                  maxRows={4}
                  sx={{
                    "& > div": { height: "100px" },
                    width: "45.001%",
                    marginRight: "5%",
                    marginTop: "5%",
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "40%",
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/png, image/jpeg"
                  onChange={(e) => profileImage(e)}
                  ref={fileRef}
                />

                <CustomaizedButton
                  onClick={() => fileRef.current.click()}
                  color="#491290"
                  text=" Escolher arquivo"
                />

                {imagePreview || content.exercisePicture ? (
                  <ImageWithPlaceholder
                    src={imagePreview || content.exercisePicture}
                    alt="Imagem do treino"
                    width="300px"
                    height="300px"
                    marginTop="30px"
                  />
                ) : (
                  <Typography
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      my: 5,
                    }}
                    variant="h5"
                  >
                    Selecione sua imagem*
                  </Typography>
                )}
              </Box>
            </Box>
            <Box>
              {allValuesAreEmpty ? (
                <CustomaizedButton
                  onClick={submitWorkout}
                  color="#3a9906"
                  text="Salvar"
                  width="150px"
                  margin="40px 0 40px 0"
                />
              ) : (
                <CustomaizedButton
                  onClick={submitWorkoutUpdate}
                  color="#3a9906"
                  text=" Atualizar"
                  width="150px"
                  margin="40px 0 40px 0"
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
