import { React, useRef, useState, useEffect, useCallback } from "react";
import { Button, TextField, Box, Container, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axiosConfig from "../utils/axios";
import { deleteUserSuccess, updateUserSuccess } from "../redux/user/userSlice";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CreateIcon from "@mui/icons-material/Create";
import Loading from "../components/Loading";
import LogoAvatarStandard from "../assets/icons/logo_standard.jpg";
import ImageWithPlaceholder from "../utils/imagePlaceHolderUntilLoad";

// --FIREBASE STORAGE--
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "../firebase";

function Profile() {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  // --FIREBASE STORAGE--
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreviewImage] = useState(null);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const { currentUser } = useSelector((state) => state.user);

  const getUserProfile = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(
        `/api/user/user/${currentUser._id}`,
        { withCredentials: true }
      );
      setFormData(response.data);
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    }
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const profileImage = async (e) => {
    const image = e.target.files[0];
    setImage(image);
    let fileReader;

    if (image && image.type.startsWith("image/")) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result) {
          setImagePreviewImage(result);
        }
      };
      fileReader.readAsDataURL(image);
    } else {
      if (fileRef.current) {
        fileRef.current.value = ""; // Resetar o valor do input do tipo file
      }
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
              dispatch(loadingFalse());
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loadingTrue());
    try {
      let updatedFormData = { ...formData };

      if (imagePreview) {
        if (formData.profilePicture.includes("firebasestorage")) {
          await removeImageFirebase(formData.profilePicture);
        }

        const imageUrl = await handleFileUpload(image);
        updatedFormData = { ...updatedFormData, profilePicture: imageUrl };
      }

      const response = await axiosInterceptor.post(
        `/api/user/update/${currentUser._id}`,
        updatedFormData,
        { withCredentials: true }
      );
      dispatch(updateUserSuccess(response.data));
      dispatch(snackBarMessageSuccess("Atualização completa"));
      setImagePreviewImage(null);
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      getUserProfile();
      dispatch(loadingFalse());
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      await removeImageFirebase(formData.profilePicture);
      const response = await axiosInterceptor.delete(
        `/api/user/delete/${currentUser._id}`,
        { withCredentials: true }
      );
      dispatch(deleteUserSuccess(response.data)); //loading, error para false e o envio do action.payload vindo do userSlice
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    }
  };

  const removeImageFirebase = async (img) => {
    try {
      const storage = getStorage(app);
      const imageRef = ref(storage, img);
      deleteObject(imageRef);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen pageMarginTopNavFix">
      <Loading top="64px" width="100%" />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="start"
        onSubmit={handleSubmit}
        flexDirection="column"
        component="form"
        sx={{
          height: "600px",
          width: "450px",
          backgroundColor: "white",
          zIndex: 1,
          overflow: "overlay",
          boxShadow: "5px 5px 15px 1px",
          position: "relative",
          pt: 5,
          borderRadius: "5%",
          "@media (max-width:600px)": {
            width: "100%",
            height: "550px", // Ajuste para telas menores
          },
          "@media (max-height:700px)": {
            maxHeight: "300px",
          },
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          PERFIL
        </Typography>

        <Box
          sx={{
            position: "relative",
          }}
        >
          <Box
            className="boxDad"
            onClick={() => fileRef.current.click()}
            sx={{
              cursor: "pointer",
              "&:hover > svg": {
                visibility: "visible",
                transition: "0.5s",
                opacity: 1,
              },
            }}
          >
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={(e) => profileImage(e)}
            />

            {imagePreview || formData.profilePicture ? (
              <ImageWithPlaceholder
                src={imagePreview || formData.profilePicture}
                alt="Imagem não encontrada"
                width="100px"
                height="100px"
                borderRadius="50%"
              />
            ) : (
              <ImageWithPlaceholder
                src={imagePreview || LogoAvatarStandard}
                alt="Imagem não encontrada"
                width="100px"
                height="100px"
                borderRadius="50%"
              />
            )}
            <CreateIcon
              sx={{
                position: "absolute",
                top: "40%",
                left: "40%",
                transition: "0.5s",
                visibility: "hidden",
                opacity: 0,
                cursor: "pointer",
                color: "#fff",
              }}
            />
          </Box>
        </Box>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              onChange={handleChange}
              value={formData.username}
              type="username"
              required
              id="username"
              label="Nome"
              variant="standard"
              autoComplete="on"
            />
          </Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <EmailIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              onChange={handleChange}
              value={formData.email}
              type="email"
              required
              id="email"
              label="Email"
              variant="standard"
              autoComplete="on"
            />
          </Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <LockIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              onChange={handleChange}
              type="password"
              id="password"
              label="Senha"
              variant="standard"
              autoComplete="off"
            />
          </Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-evenly",
            mt: 3,
          }}
        >
          <Button
            sx={{
              mb: 3,
              mt: 3,
            }}
            variant="contained"
            type="submit"
          >
            Atualizar
          </Button>
          <Button
            sx={{
              mb: 3,
              mt: 3,
            }}
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
          >
            Excluir
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default Profile;
