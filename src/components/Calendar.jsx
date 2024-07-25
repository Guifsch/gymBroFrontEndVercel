import React, { useState, useRef, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Modal,
  TextField,
  CardMedia,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import ImageWithPlaceholder from "../utils/imagePlaceHolderUntilLoad";
import axiosConfig from "../utils/axios";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";
import { useDispatch } from "react-redux";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";

import { v4 as uuidv4 } from "uuid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  padding: "20px",
  transform: "translate(-50%, -50%)",
  borderRadius: "2%",
  overflow: "overlay",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  minWidth: "500px",
  maxWidth: "1000px",
  maxHeight: "500px",
  "@media (max-width:600px)": {
    width: "100%",
    minWidth: 0,
  },
  "@media (max-height:700px)": {
    maxHeight: "400px",
    pb: 3,
  },
};

const Calendar = ({ sets }) => {
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const axiosInterceptor = axiosConfig();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [externalEvents, setExternalEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [draggableShowContent, setDraggableShowContent] = useState(null);
  const [draggableShowContentBack, setDraggableShowContentBack] =
    useState(null);
  const [selectedEventBack, setSelectedEventBack] = useState(null);
  const [image, setImage] = useState(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [openToolTip, setOpenToolTip] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openEventModal, setOpenEventModal] = useState(false);

  useEffect(() => {
    if (sets) {
      setExternalEvents(sets);
    }
  }, [sets]);

  // Função para lidar com a recepção de um evento

  const handleEventReceive = (info) => {
    const { start, extendedProps } = info.event;
    const newEvent = {
      id: uuidv4(),
      name: info.event.extendedProps.name,
      start,
      ...extendedProps,
    };

    setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  // Função para lidar com a movimentação de um evento
  const handleEventDrop = (info) => {
    const updatedEvents = calendarEvents.map((event) =>
      event.id === info.event.id ? { ...event, start: info.event.start } : event
    );
    setCalendarEvents(updatedEvents);
  };

  const getCalendar = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/calendar/calendar`, {
        withCredentials: true,
      });
      const events = response.data[0].calendarItems.map((event) => ({
        ...event,
        id: event._id, // Ensure the ID is consistent
        start: new Date(event.start),
      }));
      setCalendarEvents(events);
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    }
  }, []);

  const handleSaveCalendar = async () => {
    dispatch(loadingTrue());
    let calendarItems = calendarEvents.map((event) => ({
      ...event,
      selectedItems: event.selectedItems.map((selected) => ({
        _id: selected._id,
      })),
    }));

    try {
      const response = await axiosInterceptor.post(
        `/api/calendar/calendar`,
        { calendarItems },
        { withCredentials: true }
      );

      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      dispatch(loadingFalse());
      getCalendar();
    }
  };

  useEffect(() => {
    getCalendar();
  }, [getCalendar]);

  // Configura a funcionalidade de arrastar e soltar para os eventos externos
  useEffect(() => {
    const draggableEl = document.getElementById("external-events");
    if (draggableEl && externalEvents.length > 0) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: (eventEl) => {
          const eventId = eventEl.getAttribute("data-event-id");
          const event = externalEvents.find((event) => event._id === eventId);
          return {
            id: event._id,
            name: event.name,
            extendedProps: event,
          };
        },
      });
    }
  }, [externalEvents]);

  // Atualiza a data do calendário quando o mês ou ano é alterado
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      setTimeout(() => {
        calendarApi.gotoDate(new Date(currentYear, currentMonth));
      }, 0);
    }
  }, [currentMonth, currentYear]);

  const handleMonthChange = (event) => {
    setCurrentMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setCurrentYear(event.target.value);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setOpenModal(true);
  };

  const handleDraggableShowContent = (info) => {
    setDraggableShowContent(info);
    setDraggableShowContentBack(info);
    setOpenModal(true);
  };

  const handleDeleteEvent = (e) => {
    let updatedEvents = {};
    if (e) {
      updatedEvents = calendarEvents.filter((event) => event.id !== e.id);
    } else {
      updatedEvents = calendarEvents.filter(
        (event) => event.id !== selectedEvent.id
      );
    }
    setCalendarEvents(updatedEvents);
    setSelectedEvent(null);
    setOpenModal(false);
  };

  const handleClose = () => {
    setImage(undefined);
    setOpenModal(false);
    setSelectedEventBack(null);
    setSelectedEvent(null);
    setDraggableShowContent(null);
    setDraggableShowContentBack(null);
  };

  const handleGoBack = () => {
    setImage(undefined);
    setSelectedEvent(selectedEventBack);
    setDraggableShowContent(draggableShowContentBack);
  };

  const handleSetImage = (e) => {
    setDraggableShowContent(null);
    setSelectedEventBack(selectedEvent);
    setSelectedEvent(null);
    setImage(e);
  };

  const handleAddEvent = (event) => {
    const newEvent = {
      id: uuidv4(),
      name: event.name,
      start: selectedDate,
      ...event,
    };

    setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
    setOpenEventModal(false);
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.date);
    setOpenEventModal(true);
  };

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const years = [];
  for (let i = 2020; i <= 2030; i++) {
    years.push(i);
  }

  const handleTooltipClose = () => {
    setOpenToolTip(false);
  };

  const deleteCalendar = () => {
    setCalendarEvents([]);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 2, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingX: "16px",
          "@media (max-width:1000px)": {
            width: "100%",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "@media (max-width:1000px)": {
              flexDirection: "column",
            },
          }}
        >
          <Box position="relative">
            <Button
              variant="contained"
              onClick={() => setOpenToolTip((prev) => !prev)}
              sx={{
                "@media (max-width:1000px)": {
                  my: 3,
                },
              }}
            >
              Instruções
            </Button>
            {openToolTip && (
              <Paper
                elevation={3}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: "120%",
                  transform: "translateX(-50%)",
                  mt: 1,
                  mb: 5,
                  p: 2,
                  width: 300,
                  backgroundColor: "#000000e3;",
                  color: "#fff",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  zIndex: 10,
                  "@media (max-width:650px)": {
                    top: "75%",
                    left: "50%",
                  },
                }}
                onClick={handleTooltipClose}
              >
                <IconButton
                  onClick={handleTooltipClose}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    color: "#fff",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  <strong>Tutorial: Como Organizar Seus Treinos</strong>
                </Typography>
                <ol>
                  <li>
                    <strong>Adicionar Treino:</strong>
                    <ul>
                      <li>Vá para a seção "Adicionar Treino".</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Criar Categorias:</strong>
                    <ul>
                      <li>
                        Em seguida, acesse a opção "Criar Categorias" para criar
                        categorias relacionadas às áreas dos músculos que serão
                        treinadas.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Adicionar Treinos:</strong>
                    <ul>
                      <li>
                        Depois de criar suas categorias, adicione seus treinos
                        correspondentes a cada categoria, adicionando peso,
                        repetições, séries e até mesmo comentários, caso ache
                        necessário.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Registrar Treinos:</strong>
                    <ul>
                      <li>
                        Vá para a aba "Registrar Treinos" para montar seus sets
                        de treino. Aqui, você pode agrupar os exercícios para
                        que eles fiquem mais organizados.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Finalizar e Retornar ao Início:</strong>
                    <ul>
                      <li>
                        Após terminar de montar seus sets, retorne à página
                        inicial.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Arrastar e Soltar Sets:</strong>
                    <ul>
                      <li>
                        Por fim, arraste seus sets do canto esquerdo para as
                        respectivas datas no calendário, organizando assim sua
                        rotina de treinos. Também é possível clicar nas datas do
                        calendário para adicionar treinos diretamente. Se você
                        estiver usando um dispositivo móvel, a única opção
                        disponível será clicar nas datas do calendário.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Salvar:</strong>
                    <ul>
                      <li>
                        Não se esqueça de salvar todas as suas alterações para
                        garantir que seus treinos estejam registrados
                        corretamente.
                      </li>
                    </ul>
                  </li>
                </ol>
              </Paper>
            )}
          </Box>
          <Button
            sx={{
              ml: 3,
              "@media (max-width:1000px)": {
                ml: 0,
                mb: 3,
              },
            }}
            variant="contained"
            onClick={deleteCalendar}
          >
            Deletar todo calendário
          </Button>
          <Typography
            sx={{
              boxShadow:
                "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
              padding: "6px 16px",
              ml: 3,
              borderRadius: "4px",
              backgroundColor: "#1976d2",
              color: "white",
              "@media (max-width:1000px)": {
                mb: 3,
                ml: 0,
              },
            }}
          >
            Sets no calendário: {calendarEvents.length}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            sx={{ marginLeft: "20px", marginY: 0 }}
            variant="contained"
            color="primary"
            onClick={handleSaveCalendar}
          >
            Salvar
          </Button>

          <FormControl
            variant="outlined"
            margin="normal"
            sx={{ marginLeft: "20px", marginY: 0 }}
          >
            <InputLabel>Mês</InputLabel>
            <Select
              value={currentMonth}
              onChange={handleMonthChange}
              label="Mês"
            >
              {months.map((month, index) => (
                <MenuItem key={index} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            margin="normal"
            sx={{ marginLeft: "20px", marginY: 0 }}
          >
            <InputLabel>Ano</InputLabel>
            <Select value={currentYear} onChange={handleYearChange} label="Ano">
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 2,
          overflow: "overlay",
          "@media (max-width:1200px)": {
            flexDirection: "column",
          },
        }}
      >
        <Box
          id="external-events"
          sx={{
            p: 2,
            bgcolor: "#f4f4f4",
            borderRadius: 2,
            "@media (max-width:1200px)": {
              display: "none",
            },
          }}
        >
          <Typography
            sx={{ display: "flex", justifyContent: "center" }}
            variant="h6"
            gutterBottom
          >
            Sets
          </Typography>
          {externalEvents.map((event) => (
            <Box
              onClick={() => {
                handleDraggableShowContent(event);
              }}
              key={event._id}
              className="fc-event"
              data-event-id={event._id}
              sx={{
                "&:hover": {
                  background: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {event.name}
              </Typography>
              <Typography>{event.comment}</Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            flex: 1,
            ml: 2,
            "@media (max-width:650px)": {
              "& .fc-toolbar": { flexDirection: "column" },
              "& .fc-toolbar-title": { mb: 1 },
            },
          }}
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locales={[ptBrLocale]}
            locale="pt-br"
            droppable={true}
            editable={true}
            events={calendarEvents}
            eventClick={handleEventClick}
            eventReceive={handleEventReceive}
            eventDrop={handleEventDrop}
            dateClick={handleDateClick}
            eventContent={(arg) => (
              <Box>
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: "5px",
                    width: "20px",
                    height: "20px",
                    right: "5px",
                    zIndex: 99999,
                    color: "red",
                    background: "white",
                  }}
                  onClick={() => handleDeleteEvent(arg.event)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Typography
                  variant="body1"
                  className="fc-event-title"
                  sx={{ maxWidth: "95px" }}
                >
                  {arg.event.extendedProps.name}
                </Typography>
              </Box>
            )}
          />
        </Box>
      </Box>

      {/* Itens da esquerda do Draggable objects */}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleClose}
      >
        <Box sx={style}>
          <IconButton
            onClick={handleClose}
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

          {draggableShowContent ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {image && (
                <>
                  <Button onClick={handleGoBack}>Voltar</Button>
                  <CardMedia
                    component="img"
                    sx={{
                      objectFit: "contain",
                      maxHeight: "500px",
                      maxWidth: "500px",
                      height: "100%",
                      width: "100%",
                    }}
                    image={image}
                  />
                </>
              )}
              {draggableShowContent && (
                <>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ paddingTop: "30px" }}
                  >
                    <b>{draggableShowContent.name}</b>
                  </Typography>

                  {draggableShowContent.comment !== "" ? (
                    <TextField
                      id="comment"
                      label="Comentário"
                      multiline
                      type="comment"
                      value={draggableShowContent.comment}
                      maxRows={4}
                      sx={{
                        "& > div": { height: "100px" },
                        "& > label": { fontWeight: "bold", paddingX: "25px" },
                        width: "100%",
                        paddingX: "2%",
                      }}
                    />
                  ) : (
                    <div>teste</div>
                  )}

                  {/* Agrupe os itens por categoria */}
                  {Object.entries(
                    draggableShowContent.selectedItems.reduce((acc, item) => {
                      const category = item.category[0].name;
                      if (!acc[category]) {
                        acc[category] = [];
                      }
                      acc[category].push(item);
                      return acc;
                    }, {})
                  ).map(([category, items]) => (
                    <Box key={category} sx={{ width: "100%", marginBottom: 4 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          paddingX: "2%",
                          paddingTop: "2%",
                          fontWeight: "bold",
                        }}
                      >
                        {category}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {items.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              marginBottom: 2,
                              width: "33.3%",
                              paddingX: "2%",
                              paddingTop: "2%",
                              display: "flex",
                              flexWrap: "wrap",
                              flexDirection: "column",
                              "@media (max-width:600px)": {
                                width: "100%",
                              },
                            }}
                          >
                            <TextField
                              value={item.name}
                              label="Exercício"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.rep}
                              label="Repetições"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.serie}
                              label="Serie"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.weight}
                              label="Peso"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />

                            {item.comment ? (
                              <TextField
                                value={item.comment}
                                label="Comentário"
                                maxRows={4}
                                type="comment"
                                multiline
                                autoComplete="on"
                                sx={{
                                  marginY: "3%",
                                  marginRight: "5px",
                                  "& > label": { fontWeight: "bold" },
                                }}
                              />
                            ) : (
                              false
                            )}

                            {item.exercisePicture ? (
                              <Button
                                onClick={() => {
                                  handleSetImage(item.exercisePicture);
                                }}
                                variant="contained"
                              >
                                <b>Imagem</b>
                              </Button>
                            ) : (
                              false
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          ) : (
            // Itens do calendário
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {image && (
                <>
                  <Button onClick={handleGoBack}>Voltar</Button>

                  <ImageWithPlaceholder
                    src={image}
                    alt="Imagem do treino"
                    width="100%"
                    maxWidth="1000px"
                    height="500px"
                  />
                </>
              )}
              {selectedEvent && (
                <>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ paddingTop: "30px" }}
                  >
                    <b>{selectedEvent.extendedProps.name}</b>
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteEvent(selectedEvent)}
                    sx={{ marginBottom: "20px" }}
                  >
                    Excluir Set
                  </Button>

                  {selectedEvent.extendedProps.comment !== "" ? (
                    <TextField
                      id="comment"
                      label="Comentário"
                      type="comment"
                      value={selectedEvent.extendedProps.comment}
                      maxRows={4}
                      sx={{
                        "& > div": { height: "100px" },
                        "& > label": { fontWeight: "bold", paddingX: "25px" },
                        width: "100%",
                        paddingX: "2%",
                      }}
                    />
                  ) : (
                    false
                  )}

                  {/* Agrupe os itens por categoria */}
                  {Object.entries(
                    selectedEvent.extendedProps.selectedItems.reduce(
                      (acc, item) => {
                        const category = item.category[0].name;
                        if (!acc[category]) {
                          acc[category] = [];
                        }
                        acc[category].push(item);
                        return acc;
                      },
                      {}
                    )
                  ).map(([category, items]) => (
                    <Box key={category} sx={{ width: "100%", marginBottom: 4 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          paddingX: "2%",
                          paddingTop: "2%",
                          fontWeight: "bold",
                        }}
                      >
                        {category}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {items.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              marginBottom: 2,
                              width: "33.3%",
                              paddingX: "2%",
                              paddingTop: "2%",
                              display: "flex",
                              flexWrap: "wrap",
                              flexDirection: "column",
                              "@media (max-width:600px)": {
                                width: "100%",
                              },
                            }}
                          >
                            <TextField
                              value={item.name}
                              label="Exercício"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.rep}
                              label="Repetições"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.serie}
                              label="Serie"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.weight}
                              label="Peso"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />

                            {item.comment ? (
                              <TextField
                                multiline
                                label="Comentário"
                                value={item.comment}
                                maxRows={4}
                                type="comment"
                                autoComplete="on"
                                sx={{
                                  marginY: "3%",
                                  marginRight: "5px",
                                  "& > label": { fontWeight: "bold" },
                                }}
                              />
                            ) : (
                              false
                            )}

                            {item.exercisePicture ? (
                              <Button
                                onClick={() => {
                                  handleSetImage(item.exercisePicture);
                                }}
                                variant="contained"
                              >
                                <b>Imagem</b>
                              </Button>
                            ) : (
                              false
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          )}
        </Box>
      </Modal>
      <Modal open={openEventModal} onClose={() => setOpenEventModal(false)}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Selecione um Set
          </Typography>
          {externalEvents.map((event) => (
            <Box
              key={event._id}
              onClick={() => handleAddEvent(event)}
              sx={{
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #ddd",
                background: "#3788d8",
                color: "white",
                marginBottom: "20px",
                wordBreak: "break-all",
              }}
            >
              <Typography
                sx={{ display: "flex", justifyContent: "center" }}
                variant="h4"
              >
                {event.name}
              </Typography>
              <Typography variant="body1">{event.comment}</Typography>
            </Box>
          ))}
        </Box>
      </Modal>
    </Box>
  );
};

export default Calendar;
