import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Box,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  ListSubheader,
  Checkbox,
  ListItemText,
  TextField,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Chrome from "@uiw/react-color-chrome";
import { GithubPlacement } from "@uiw/react-color-github";
import CustomaizedButton from "../components/Button";
import { useTheme } from "@mui/material/styles";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import axiosConfig from "../utils/axios";
import { useDispatch } from "react-redux";

// Estilo do modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  borderRadius: "5px",
  height: 750,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "overlay",
  "@media (max-width:600px)": {
    width: "100%",
  },
  "@media (max-height:750px)": {
    maxHeight: "400px",
    pb: 3,
  },
};

// Função para determinar o estilo de um item na lista com base na sua seleção
function getStyles(name, selectedItems, theme) {
  return {
    fontWeight:
      selectedItems.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    backgroundColor:
      selectedItems.indexOf(name) === -1
        ? "inherit"
        : theme.palette.action.selected,
  };
}

export default function ModalWorkoutSerie({
  openSerieModal,
  handleCloseSerieModal,
  modalContentUpdate,
  modalSetRefreshRef,
}) {
  const theme = useTheme(); // Hook do tema do Material-UI para usar estilos do tema
  const [selectedItems, setSelectedItems] = useState([]); // Estado para armazenar os itens selecionados
  const [groupedWorkouts, setGroupedWorkouts] = useState({}); // Estado para armazenar os exercícios agrupados por categoria
  const [loading, setLoading] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const [cardColor, setCardColor] = useState("#000000");
  const [filterText, setFilterText] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    comment: "",
    cardColor: "",
    textColor: "",
    selectedItems: [],
  });
  const dispatch = useDispatch();
  const axiosInterceptor = axiosConfig(); // Configuração do axios para fazer requisições

  const filteredWorkouts = Object.keys(groupedWorkouts).reduce((result, category) => {
    const lowerCaseFilter = filterText.toLowerCase();

    // Verifica se o texto do filtro corresponde à categoria
    if (category.toLowerCase().includes(lowerCaseFilter)) {
      result[category] = groupedWorkouts[category]; // Exibe todos os treinos da categoria
    } else {
      // Filtra os treinos que correspondem ao texto do filtro
      const filteredItems = groupedWorkouts[category].filter(workout =>
        workout.name.toLowerCase().includes(lowerCaseFilter)
      );
      if (filteredItems.length > 0) {
        result[category] = filteredItems;
      }
    }
    return result;
  }, {});

  useEffect(() => {
    try {
      if (
        modalContentUpdate.selectedItems &&
        modalContentUpdate.selectedItems.length > 0
      ) {
        setSelectedItems(
          modalContentUpdate.selectedItems.map((e) => {
            return e._id;
          })
        );
      } else {
        setSelectedItems([]);
      }
    } catch (e) {
      console.log(e);
    }
    setFormValues(modalContentUpdate);
    setTextColor(modalContentUpdate.textColor);
    setCardColor(modalContentUpdate.cardColor);
  }, [modalContentUpdate]);

  // Função para buscar os exercícios da API e agrupar por categoria
  const getWorkout = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/workout/workouts`, {
        withCredentials: true,
      });
      const workouts = response.data.workouts;
      // Agrupando os exercícios por categoria
      const groupedByCategory = workouts.reduce((acc, workout) => {
        const categoryName = workout.category[0].name;
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(workout);
        return acc;
      }, {});

      setGroupedWorkouts(groupedByCategory); // Atualiza o estado com os exercícios agrupados
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    }
  }, []);

  useEffect(() => {
    getWorkout();
  }, [getWorkout]);

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      selectedItems: selectedItems,
    }));
  }, [selectedItems]);

  // Função para lidar com o clique em um item da lista
  const handleItemClick = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        // Remove o item se ele já estiver selecionado
        return prev.filter((item) => item !== id);
      } else {
        // Adiciona o item se ele não estiver selecionado
        return [...prev, id];
      }
    });
  };

  const getWorkoutNameById = (id) => {
    for (const category of Object.values(groupedWorkouts)) {
      for (const workout of category) {
        if (workout._id === id) {
          return workout.name;
        }
      }
    }
    return "";
  };

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      selectedItems: selectedItems,
    }));
  }, [selectedItems]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const submitSet = async (e) => {
    setLoading(true);
    try {
      const response = await axiosInterceptor.post(
        `/api/set/sets`,
        formValues,
        { withCredentials: true }
      );
      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      getSetsRef();
      setLoading(false);
    }
  };

  const submitSetUpdate = async () => {
    setLoading(true);
    try {
      const response = await axiosInterceptor.post(
        `/api/set/update/${formValues._id}`,
        formValues,
        { withCredentials: true }
      );
      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      getSetsRef();
      setLoading(false);
    }
  };

  const getSetsRef = () => {
    modalSetRefreshRef();
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openSerieModal} // Controla se o modal está aberto ou fechado
      onClose={handleCloseSerieModal} // Função para fechar o modal
    >
      <Box sx={style}>
        <IconButton
          onClick={handleCloseSerieModal} // Fecha o modal ao clicar no botão
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
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "50px",
            }}
          >
            <TextField
              onChange={handleChange}
              required
              id="name"
              value={formValues.name}
              label="Nome"
              variant="filled"
              autoComplete="on"
              sx={{
                width: "50%",
              }}
            />
            <TextField
              id="comment"
              label="Comentário"
              multiline
              type="comment"
              value={formValues.comment}
              onChange={handleChange}
              maxRows={4}
              sx={{
                "& > div": { height: "100px" },
                width: "60%",
                marginTop: "5%",
              }}
            />
            <Box
              sx={{
                marginTop: "3%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <FormControl sx={{ m: 1, width: "60%" }} variant="filled">
                <InputLabel id="select-label">Treinos*</InputLabel>
                <Select
                  labelId="select-label"
                  multiple
                  value={selectedItems}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => (
                        <Chip
                          key={id}
                          label={getWorkoutNameById(id)}
                          sx={{ margin: "2px" }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {/* Campo de entrada para o filtro */}
                  <Box sx={{ p: "8px" }}>
                    <TextField
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      placeholder="Filtrar treinos..."
                      fullWidth
                    />
                  </Box>

                  <Box sx={{ overflow: "overlay", height: "250px" }}>
                    <MenuItem
                      value=""
                      onClick={() => setSelectedItems([])} // Limpa todos os itens selecionados
                    >
                      <ListItemText primary="Nenhum" />
                    </MenuItem>
                    {Object.keys(filteredWorkouts).map((category) => (
                      <div key={category}>
                        <ListSubheader
                          sx={{
                            backgroundColor: "black",
                            color: "white",
                            fontWeight: "bold",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {category}
                        </ListSubheader>
                        {filteredWorkouts[category].map((workout) => (
                          <MenuItem
                            key={workout._id}
                            value={workout._id}
                            style={getStyles(workout._id, selectedItems, theme)}
                            onClick={() => handleItemClick(workout._id)}
                          >
                            <Checkbox
                              checked={selectedItems.indexOf(workout._id) > -1}
                              tabIndex={-1}
                              disableRipple
                            />
                            <ListItemText primary={workout.name} />
                          </MenuItem>
                        ))}
                      </div>
                    ))}
                  </Box>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                paddingTop: "30px",
                "@media (max-width:600px)": {
                  flexDirection: "column",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ paddingBottom: "10px" }}>
                  Cor do texto
                </Typography>
                <Chrome
                  color={textColor}
                  style={{ float: "left" }}
                  placement={GithubPlacement.Top}
                  onChange={(color) => {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      textColor: color.hex,
                    }));
                    setTextColor(color.hex);
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  "@media (max-width:600px)": {
                    pt: 3,
                  },
                }}
              >
                <Typography sx={{ paddingBottom: "10px" }}>
                  Cor do card
                </Typography>
                <Chrome
                  color={cardColor}
                  style={{ float: "left" }}
                  placement={GithubPlacement.Top}
                  onChange={(color) => {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      cardColor: color.hex,
                    }));
                    setCardColor(color.hex);
                  }}
                />
              </Box>
            </Box>
          </Container>

          {modalContentUpdate.name === "" ? (
            <CustomaizedButton
              onClick={submitSet}
              color="#3a9906"
              text="Salvar"
              width="150px"
              margin="30px 0 30px 0"
            />
          ) : (
            <CustomaizedButton
              onClick={submitSetUpdate}
              color="#3a9906"
              text="Atualizar"
              width="150px"
              margin="30px 0 30px 0"
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
}
