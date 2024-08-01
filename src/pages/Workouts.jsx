import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import axiosConfig from "../utils/axios";
import ModalWorkout from "../components/ModalWorkout";
import WorkoutSet from "../components/WorkoutSet";
import GenericImage from "../assets/generic-image.png";
import ImageWithPlaceholder from "../utils/imagePlaceHolderUntilLoad";
import ModalWorkoutCategory from "../components/ModalWorkoutCategory";
import { Tab, IconButton, Box, Container } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CustomaizedButton from "../components/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import React, { useCallback, useState, useEffect } from "react";

import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";

import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../firebase";

export default function Workouts() {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  const [valueTab, setValueTab] = React.useState("1");
  const [modalWorkoutCategoryRefreshRef, setModalWorkoutCategoryRefreshRef] =
    React.useState(1);
  const [openWorkoutModal, setOpenWorkoutModal] = React.useState(false);
  const [openCategoryModal, setOpenCategoryModal] = React.useState(false);
  const [categoryInputClean, setCategoryInputClean] = React.useState(1);
  const [imageTableShow, setImageTableShow] = useState(undefined);
  const [modalContentUpdate, setModalContentUpdate] = useState({
    name: "",
    rep: "",
    serie: "",
    weight: "",
    exercisePicture: "",
    comment: "",
    category: [],
  });
  const [workouts, setWorkouts] = useState([]);
  const [getWorkoutRefUpdate, setGetWorkoutRefUpdate] = useState(1);

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const getWorkout = useCallback(async () => {
    dispatch(loadingTrue());
    try {
      const response = await axiosInterceptor.get(`/api/workout/workouts`, {
        withCredentials: true,
      });
      setWorkouts(response.data.workouts);
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      dispatch(loadingFalse());
    }
  }, []);

  //Refresh na lista do workout quando o modal é atualizado e na lista de category quando são adicionados novos

  const getWorkoutRef = useCallback(async (e) => {
    setGetWorkoutRefUpdate(e);
  }, []);

  const refreshModalRefCategory = useCallback(async (e) => {
    setModalWorkoutCategoryRefreshRef((prevCount) => prevCount + 1);
  }, []);

  useEffect(() => {
    getWorkoutRef();
    getWorkout();
  }, [getWorkout, getWorkoutRefUpdate]);

  //--------------------------------------
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nome",
        size: 150,
      },
      {
        accessorKey: "rep",
        header: "Repetições",
        size: 150,
      },
      {
        accessorKey: "serie",
        header: "Series",
        size: 150,
      },
      {
        accessorKey: "weight",
        header: "Peso",
        size: 150,
      },
      {
        accessorKey: "category",
        header: "Categoria",
        size: 150,
        Cell: ({ row }) => {
          // Função de renderização personalizada para a célula
          const categories = row.original.category; // Acessa a propriedade 'category' do objeto original da linha
          if (Array.isArray(categories)) {
            // Verifica se 'category' é um array
            const categoryNames = categories
              .map((category) => category.name)
              .join(", "); // Mapeia os objetos do array para obter os nomes e junta em uma string separada por vírgulas
            return <span>{categoryNames}</span>; // Retorna os nomes das categorias como conteúdo da célula
          }
          return null; // Retorna null se 'category' não for um array, ou você pode colocar um valor padrão aqui
        },
      },

      {
        accessorKey: "exercisePicture",
        header: "Imagem",
        size: 150,
        Cell: ({ row }) => (
          <Box
            onClick={() => handleShowImage(row.original.exercisePicture)}
            sx={{
              display: "flex",
              cursor: "pointer",
              alignItems: "center",
              gap: "1rem",
              transition: "0.2s",
              "&:hover": {
                filter: "contrast(0.5)",
                transition: "0.2s",
              },
            }}
          >
            {row.original.exercisePicture ? (
              <ImageWithPlaceholder
                src={row.original.exercisePicture}
                alt="Imagem do treino"
                width="100px"
                height="100px"
              />
            ) : (
              <img
                alt="avatar"
                src={GenericImage}
                loading="lazy"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            )}
          </Box>
        ),
      },
      {
        header: "Ações",
        enableColumnActions: false,
        size: 50,
        Cell: ({ row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "initial",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <IconButton
              sx={{ borderRadius: 0 }}
              onClick={() => handleOpenUpdate(row.original)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              sx={{ borderRadius: 0 }}
              onClick={() => handleDeleteExercisePicture(row.original)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: workouts,
    muiTableBodyCellProps: {
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        fontSize: "1rem",
      },
    },
    muiTableBodyProps: {
      //simple styling with the `sx` prop, works just like a style prop in this example

      sx: {
        "& tr:nth-of-type(2n)": {
          backgroundColor: "#eeeeee!important",
        },
      },
    },
    muiTableHeadCellProps: {
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        fontSize: "1.1rem",
      },
    },
    muiTablePaperProps: {
      sx: {
        borderRadius: "5px",
      },
    },
  });

  const handleDeleteExercisePicture = async (e) => {
    dispatch(loadingTrue());

    try {
      await removeImageFirebase(e.exercisePicture);
      const response = await axiosInterceptor.delete(
        `/api/workout/workouts/${e._id}`,
        { withCredentials: true }
      );
      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      getWorkout();
      dispatch(loadingFalse());
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

  const handleOpenUpdate = (e) => {
    setModalContentUpdate(e);
    setOpenWorkoutModal(true);
  };

  const handleOpenWorkoutModal = () => {
    setOpenWorkoutModal(true);
  };

  const handleCloseWorkoutModal = () => {
    setOpenWorkoutModal(false);
    setCategoryInputClean((prevCount) => prevCount + 1);
    setModalContentUpdate({
      name: "",
      rep: "",
      serie: "",
      weight: "",
      comment: "",
      exercisePicture: "",
      category: [],
    });
    setImageTableShow(undefined);
  };

  const handleShowImage = (e) => {
    if (e) {
      setImageTableShow(e);
      setOpenWorkoutModal(true);
    } else {
      return;
    }
  };

  //Category modal

  const handleOpenCategoryModal = () => {
    setOpenCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false);
  };

  return (
    <Box className="flex flex-col justify-initial items-center pageMarginTopNavFix">
      <Loading top="64px" />
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginTop: 5 }}>
          <TabList onChange={handleChangeTab} aria-label="Workouts">
            <Tab
              label="Registrar Exercícios"
              value="1"
              sx={{
                "@media (max-width:600px)": {
                  fontSize: "0.7rem",
                },
              }}
            />
            <Tab
              label="Registrar Treinos"
              value="2"
              sx={{
                "@media (max-width:600px)": {
                  fontSize: "0.7rem",
                },
              }}
            />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ width: "100%", maxWidth: "1200px" }}>
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              "@media (max-width:500px)": {
                flexDirection: "column",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mr: 5,
                "@media (max-width:500px)": {
                  mb: 2,
                  mr: 0,
                },
              }}
            >
              <CustomaizedButton
                onClick={handleOpenCategoryModal}
                color="#491290"
                text="Criar categorias"
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CustomaizedButton
                onClick={handleOpenWorkoutModal}
                color="#ff6f00"
                text="Enviar Treino"
              />
            </Box>
          </Container>
          <Box
            sx={{
              pb: 10,
              py: 5,
              width: "100%",
              "@media (max-width:500px)": {
                p: 3,
              },
            }}
          >
            <MaterialReactTable table={table} />
          </Box>
        </TabPanel>
        <TabPanel value="2" sx={{ width: "100%", maxWidth: "1200px" }}>
          <WorkoutSet />
        </TabPanel>
      </TabContext>
      <ModalWorkoutCategory
        open={openCategoryModal}
        handleClose={handleCloseCategoryModal}
        getWorkoutRef={getWorkoutRef}
        modalWorkoutCategoryRefreshRef={refreshModalRefCategory}
      />
      <ModalWorkout
        open={openWorkoutModal}
        handleClose={handleCloseWorkoutModal}
        getWorkoutRef={getWorkoutRef}
        modalContentUpdate={modalContentUpdate}
        modalImageShow={imageTableShow}
        refreshModalRefCategory={modalWorkoutCategoryRefreshRef}
        categoryInputClean={categoryInputClean}
      />
    </Box>
  );
}
