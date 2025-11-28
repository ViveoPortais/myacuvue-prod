import { IoIosInformationCircle, IoIosList } from "react-icons/io";
import { LuAlarmClock, LuCalendarCheck } from "react-icons/lu";
import CalendarECPTwo from "../calendarEcp/CalendarECPTwo";
import NewSelected from "../select/NewSelected";
import { useState } from "react";
import { PiPencilSimpleLineLight } from "react-icons/pi";
import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import dataCalendar from "./dataCalendar";
import useOpenModalSheduling from "@/hooks/useOpenModalSheduling";
import ModalSheduling from "../modals/ModalSheduling";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import InputModal from "../input/InputModal";
import Button from "../button/Button";
import useOpenModalShedulingCancel from "@/hooks/useOpenModalShedulingCancel";
import CustomSelect from "../select/Select";
import ModalShedulingCancel from "../modals/ModalShedulingCancel";
import ModalShedulingReschedule from "../modals/ModalShedulingReschedule";
import useOpenModalReschedule from "@/hooks/useOpenModalReschedule";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, TextFieldProps, ThemeProvider } from "@mui/material";
import InputSheduling from "../input/InputSheduling";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/pt-br";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  cancelVisittoClinic,
  confirmVisitAttendance,
  editVisittoClinic,
  listVisitiClinicIndInvidual,
  listVisitiClinicTwo,
  patientNotAttended,
} from "@/services/diagnostic";
import useLogin from "@/hooks/useLogin";
import { toast } from "react-toastify";

dayjs.locale("pt-br");
dayjs.extend(isSameOrAfter);
dayjs.extend(localizedFormat);

type Appointment = {
  id: string;
  name: string;
  status: string;
  date: string;
  time: string;
  phone: string;
  friendlyCode: string;
  emailAddress: string;
  mobilePhone: string;
  scheduleDateStart: string;
  statusStringMapName: string;
};

const SchedulingPartinerTwo = () => {
  const shedulingModal = useOpenModalSheduling();
  const shedulingModalCancel = useOpenModalShedulingCancel();
  const reschedulingModal = useOpenModalReschedule();
  const idSheduling = useLogin();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [dataIndividual, setDataIndividual] =
    React.useState<Appointment | null>(null);
  const [parsedObservation, setParsedObservation] = React.useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const holidays = [
    "2025-01-01",
    "2025-03-03", // Carnaval
    "2025-03-04", // Carnaval
    "2025-04-18", // Sexta-feira Santa
    "2025-04-21", // Dia de Tiradentes
    "2025-05-01", // Dia do Trabalho
    "2025-06-19", // Corpus Christi
    "2025-09-07", // Independência do Brasil
    "2025-10-12", // Dia de Nossa Senhora Aparecida
    "2025-11-02", // Dia de Finados
    "2025-11-15", // Proclamação da República
    "2025-11-20", // Dia Nacional de Zumbi e da Consciência Negra
    "2025-12-25", // Natal
  ];

  const ITEMS_PER_PAGE = 7;
  const itemsToShow = filteredData.length > 0 ? filteredData : data;
  const totalPages = Math.max(
    1,
    Math.ceil(itemsToShow.length / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = itemsToShow.slice(startIndex, endIndex);

  const scheduleDate = dayjs(dataIndividual?.scheduleDateStart);
  const now = dayjs();
  const canShowButtons =
    now.isSameOrAfter(scheduleDate) &&
    dataIndividual?.statusStringMapName === "Aguardando";
  const isPastSchedule = now.isAfter(scheduleDate);
  const canShowCancelButton =
    (dataIndividual?.statusStringMapName === "Confirmado" ||
      dataIndividual?.statusStringMapName === "Aguardando") &&
    now < scheduleDate;

  const isHoliday = (date: dayjs.Dayjs) => {
    return holidays.includes(date.format("YYYY-MM-DD"));
  };
  const [cancelAgendamento, setCancelAgendamento] = React.useState({
    OriginEntityId: idSheduling.idSheduling || "",
    Reason: "",
    ProgramCode: "073",
  });
  const [visitAttendance, setVisitAttendance] = React.useState({
    OriginEntityId: idSheduling.idSheduling || "",
    ProgramCode: "073",
  });
  const [notAttendedVisit, setNotAttendedVisit] = React.useState({
    OriginEntityId: idSheduling.idSheduling || "",
    ProgramCode: "073",
  });

  const [editVisit, setEditVisit] = React.useState({
    ScheduleDateStart: "",
    OriginEntityId: idSheduling.idSheduling || "",
    ProgramCode: "073",
  });

  const handleFilterChange = () => {
    let filtered = [...data];

    const statusToSearch = selectedStatus ? String(selectedStatus).trim() : "";

    if (statusToSearch && statusToSearch !== "Todos") {
      filtered = filtered.filter(
        (item) =>
          item.statusStringMapName?.toLowerCase().trim() ===
          statusToSearch.toLowerCase().trim()
      );
    }

    if (selectedOrder === "Data") {
      filtered.sort((a, b) => {
        const dateA = a.scheduleDateStart
          ? dayjs(a.scheduleDateStart).unix()
          : 0;
        const dateB = b.scheduleDateStart
          ? dayjs(b.scheduleDateStart).unix()
          : 0;
        return dateB - dateA;
      });
    } else if (selectedOrder === "Nome") {
      filtered.sort((a, b) => {
        const nameA =
          a.name
            ?.trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase() || "";
        const nameB =
          b.name
            ?.trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase() || "";

        console.log("Comparando:", nameA, "vs", nameB);

        return nameA.localeCompare(nameB, "pt-BR", { sensitivity: "base" });
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData, totalPages]);

  React.useEffect(() => {
    handleFilterChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus, selectedOrder]);

  React.useEffect(() => {
    listVisitiClinicTwo().then((response) => {
      if (Array.isArray(response)) {
        // Ordena os dados do mais novo para o mais antigo antes de salvar no estado
        const sortedData = response.sort((a, b) => {
          const dateA = a.scheduleDateStart
            ? dayjs(a.scheduleDateStart).unix()
            : 0;
          const dateB = b.scheduleDateStart
            ? dayjs(b.scheduleDateStart).unix()
            : 0;
          return dateB - dateA; // Inverte a ordem para do mais novo para o mais antigo
        });
        setData(sortedData);
      } else {
        setData([response]);
      }
    });

    if (idSheduling.idSheduling) {
      visitiClinicIndInvidual();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idSheduling.idSheduling]);

  React.useEffect(() => {
    if (shedulingModalCancel.isOpen && idSheduling.idSheduling) {
      setCancelAgendamento((prevState: any) => ({
        ...prevState,
        OriginEntityId: idSheduling.idSheduling,
      }));
    }
    if (shedulingModal.isOpen && idSheduling.idSheduling) {
      setVisitAttendance((prevState: any) => ({
        ...prevState,
        OriginEntityId: idSheduling.idSheduling,
      }));
      setNotAttendedVisit((prevState: any) => ({
        ...prevState,
        OriginEntityId: idSheduling.idSheduling,
      }));
    }

    if (reschedulingModal.isOpen && idSheduling.idSheduling) {
      setEditVisit((prevState: any) => ({
        ...prevState,
        OriginEntityId: idSheduling.idSheduling,
      }));
    }
  }, [
    shedulingModalCancel.isOpen,
    idSheduling.idSheduling,
    shedulingModal.isOpen,
    reschedulingModal.isOpen,
  ]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedObservation]);

  const visitiClinicIndInvidual = async () => {
    listVisitiClinicIndInvidual(idSheduling.idSheduling).then((response) => {
      setDataIndividual(response[0]);
      if (response[0]?.observation) {
        try {
          setParsedObservation(JSON.parse(response[0].observation));
          console.log("Observation:", JSON.parse(response[0].observation));
        } catch (error) {
          console.error("Erro ao converter observation:", error);
        }
      }
    });
  };

  const cancelVisitClinic = async () => {
    cancelVisittoClinic(cancelAgendamento as any)
      .then((res) => {
        toast.success(res.value);
        shedulingModalCancel.onClose();
        shedulingModal.onClose();
        idSheduling.setIdSheduling("");
        setCancelAgendamento({
          OriginEntityId: idSheduling.idSheduling || "",
          Reason: "",
          ProgramCode: "073",
        });
      })
      .catch(() => {
        toast.error("Erro ao cancelar o agendamento!");
      });
  };

  const confirmVisitAttendancee = async () => {
    confirmVisitAttendance(visitAttendance as any)
      .then((res) => {
        toast.success(res.value);
        shedulingModal.onClose();
        idSheduling.setIdSheduling("");
        setVisitAttendance({
          OriginEntityId: idSheduling.idSheduling || "",
          ProgramCode: "073",
        });
      })
      .catch(() => {
        toast.error("Erro ao confirmar o agendamento!");
      });
  };

  const notAttendedVisitClinicc = async () => {
    patientNotAttended(notAttendedVisit as any)
      .then((res) => {
        toast.success(res.value);
        shedulingModal.onClose();
        idSheduling.setIdSheduling("");
        setNotAttendedVisit({
          OriginEntityId: idSheduling.idSheduling || "",
          ProgramCode: "073",
        });
      })
      .catch(() => {
        toast.error("Erro ao confirmar o agendamento!");
      });
  };

  const formatDateTimeForAPI = () => {
    if (!selectedDate || !selectedTime) return "";
    return (
      dayjs(selectedDate).format("YYYY-MM-DD") + "T" + selectedTime + ":00"
    );
  };

  const editVisittoClinicc = async () => {
    const formattedDateTime = formatDateTimeForAPI();
    if (!formattedDateTime) {
      toast.error("Por favor, selecione uma data e um horário.");
      return;
    }

    setEditVisit((prev) => ({ ...prev, ScheduleDateStart: formattedDateTime }));

    editVisittoClinic({ ...editVisit, ScheduleDateStart: formattedDateTime })
      .then((res) => {
        toast.success(res.value);
        reschedulingModal.onClose();
        shedulingModal.onClose();
        idSheduling.setIdSheduling("");
        setEditVisit({
          ScheduleDateStart: "",
          OriginEntityId: idSheduling.idSheduling || "",
          ProgramCode: "073",
        });
      })
      .catch(() => {
        toast.error("Erro ao reagendar. Tente novamente.");
      });
  };

  const closeModalAlldDate = () => {
    shedulingModal.onClose();
    idSheduling.setIdSheduling("");
  };

  const newTheme = (theme: any) =>
    createTheme({
      ...theme,
      components: {
        MuiPickersCalendarHeader: {
          styleOverrides: {
            root: {
              color: "#007cc4",
            },
            switchViewButton: {
              display: "none",
            },
          },
        },
      },
    });

  return (
    <div className="w-full h-full pr-5">
      <div className="flex flex-col w-[83%] md:w-full">
        <span className="text-careBlue">
          Visualize aqui todos os agendamentos solicitados. Após a confirmação,
          você os verá na aba &quot;Confirmação de agendamentos&quot;.
        </span>

        <div className="flex flex-col md:flex md:flex-row md:justify-between md:items-center mt-4 mb-5">
          <div className="flex flex-col md:flex md:flex-row md:items-center gap-5 mb-[20px] md:mb-0">
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-careBlue mt-1">Ordenar por:</span>
              <NewSelected
                options={[
                  { value: "Todos", id: "Todos" },
                  { value: "Data", id: "Data" },
                  { value: "Nome", id: "Nome" },
                ]}
                placeholder="Mais recentes"
                customClass="rounded-full w-38 h-8 bg-blue-200 text-careLightBlue text-sm"
                disabled={view === "calendar"}
                onChange={(e: any) => {
                  const selectedValue = e.target.value;
                  setSelectedOrder(selectedValue);
                }}
                value={selectedOrder}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-careBlue mt-1">Exibir status:</span>
              <NewSelected
                options={[
                  { value: "Todos", id: "Todos" },
                  { value: "Confirmado", id: "Confirmado" },
                  { value: "Cancelado", id: "Cancelado" },
                  { value: "Aguardando", id: "Aguardando" },
                  { value: "Não Compareceu", id: "Não Compareceu" },
                  { value: "Compareceu", id: "Compareceu" },
                ]}
                placeholder="Mais recentes"
                customClass="rounded-full w-38 h-8 bg-blue-200 text-careLightBlue text-sm"
                disabled={view === "calendar"}
                onChange={(e: any) => {
                  const selectedValue = e.target.value;
                  setSelectedStatus(selectedValue);
                }}
                value={selectedStatus}
              />
            </div>
          </div>

          <div className="flex flex-row items-center gap-5">
            <button
              onClick={() => setView("list")}
              className={`flex flex-row items-center gap-1 px-3 py-1 rounded-full 
                ${
                  view === "list"
                    ? "bg-blue-300 text-careLightBlue"
                    : " text-gray-400"
                }`}
            >
              <IoIosList size={22} />
              <span className="text-xs">Lista</span>
            </button>

            <button
              onClick={() => setView("calendar")}
              className={`flex flex-row items-center gap-1 px-3 py-1 rounded-full 
                ${
                  view === "calendar"
                    ? "bg-blue-300 text-careLightBlue"
                    : " text-gray-400"
                }`}
            >
              <LuCalendarCheck size={22} />
              <span className="text-xs">Calendário</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-[83%] md:w-full mb-5">
        {view === "calendar" ? (
          <CalendarECPTwo />
        ) : (
          <div className="w-full">
            <div className="hidden md:grid grid-cols-6 font-semibold text-careBlue py-3 px-5">
              <span>Nome</span>
              <span>ID</span>
              <span>Status</span>
              <span>Data</span>
              <span>Horário</span>
              <span>Telefone</span>
            </div>

            <div className="flex flex-col gap-2 w-[23.5rem] md:w-full">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center md:grid md:grid-cols-6 py-3.5 px-5 border border-careLightBlue bg-gray-50 md:bg-white rounded-lg"
                >
                  <span className="md:hidden text-gray-500 text-sm">Nome:</span>
                  <span className="text-careLightBlue flex items-center gap-2">
                    {item.name}
                    <span
                      onClick={() => {
                        shedulingModal.onOpen();
                        idSheduling.setIdSheduling(item.visitId);
                      }}
                      className="cursor-pointer"
                    >
                      <PiPencilSimpleLineLight />
                    </span>
                  </span>

                  <span className="md:hidden text-gray-500 text-sm">ID:</span>
                  <span className="text-careBlue">{item.friendlyCode}</span>

                  <span className="md:hidden text-gray-500 text-sm">
                    Status:
                  </span>
                  <span
                    className={`${
                      item.statusStringMapName === "Confirmado"
                        ? "text-green-600 bg-[#E5F1EC] border border-[#E5F1EC] w-40 text-center rounded-full py-2"
                        : item.statusStringMapName === "Cancelado"
                        ? "text-yellow-600 bg-[#FFF0EB] border border-[#FFF0EB] w-40 text-center rounded-full py-2"
                        : item.statusStringMapName === "Aguardando"
                        ? "text-gray-500 bg-[#E8E8E8] border border-[#E8E8E8] w-40 text-center rounded-full py-2"
                        : item.statusStringMapName === "Não Compareceu"
                        ? "text-pink-500 bg-[#F1E5EC] border border-[#F1E5EC] w-40 text-center rounded-full py-2"
                        : item.statusStringMapName === "Compareceu"
                        ? "text-purple-500 bg-[#F1EBF8] border border-[#F1EBF8] w-40 text-center rounded-full py-2"
                        : ""
                    }`}
                  >
                    {item.statusStringMapName}
                  </span>

                  <span className="md:hidden text-gray-500 text-sm">Data:</span>
                  <span className="text-careBlue">
                    {dayjs(item.scheduleDateStart).format("DD/MM/YYYY")}
                  </span>

                  <span className="md:hidden text-gray-500 text-sm">Hora:</span>
                  <span className="text-careBlue">
                    {dayjs(item.scheduleDateStart).format("HH:mm")}
                  </span>

                  <span className="md:hidden text-gray-500 text-sm">
                    Telefone:
                  </span>
                  <span className="text-careBlue">{item.mobilePhone}</span>
                </div>
              ))}

              <div className="flex justify-center mt-5">
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, value) => setCurrentPage(value)}
                    color="primary"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "#051F4A",
                        fontSize: "15px",
                        backgroundColor: "transparent",
                        borderRadius: "5px",
                      },
                      "& .MuiPaginationItem-page.Mui-selected": {
                        backgroundColor: "#E6F2F9",
                        color: "#051F4A",
                        borderRadius: "5px",
                        padding: "18px 14px",
                      },
                    }}
                  />
                </Stack>
              </div>
            </div>

            {/* modal de detalhes do agendamento */}
            <ModalSheduling
              isOpen={shedulingModal.isOpen}
              onClose={closeModalAlldDate}
              title="Dados do(a) paciente:"
              customClass="md:w-[40%]"
            >
              <div className="flex gap-2 items-center text-careLightBlue">
                <FaRegUser />
                <span>{dataIndividual?.name}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-careLightBlue">ID</span>
                <span className="text-careBlue">
                  {dataIndividual?.friendlyCode}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="text-careLightBlue font-bold mt-5">
                  <span>Contato</span>
                </div>
                <div className="flex flex-col md:flex md:flex-row gap-2 md:gap-7 md:items-center">
                  <span className="flex gap-1 items-center">
                    <MdOutlineEmail className="text-careLightBlue" />
                    <span className="text-careBlue">
                      {dataIndividual?.emailAddress}
                    </span>
                  </span>
                  <span className="flex gap-1 items-center">
                    <FiPhone className="text-careLightBlue" />
                    <span className="text-careBlue">
                      {dataIndividual?.mobilePhone}
                    </span>
                  </span>
                </div>
              </div>
              <div className="bg-[#F4F5F7] rounded-lg mt-5 p-5">
                <div className="flex items-center gap-2">
                  <span className="text-careBlue font-bold">Prescrição:</span>
                  <span className="text-careLightBlue">
                    {parsedObservation?.PrescriptionType === 1 &&
                      "Miopia e Astigmatismo"}
                    {parsedObservation?.PrescriptionType === 2 &&
                      "Miopia e Astigmatismo +Astigmatismo"}
                    {parsedObservation?.PrescriptionType === 3 && "Presbiopia"}
                  </span>
                </div>
                {parsedObservation?.PrescriptionType === 1 &&
                  parsedObservation?.Refraction[0].Type !== 3 && (
                    <div className="flex flex-col mt-4">
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <span className=""></span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Grau esférico{" "}
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Grau esférico:
                                </span>
                                É o grau das lentes de contato para a correção
                                de miopia e hipermetropia. No caso da miopia, o
                                grau é negativo. Se for hipermetropia, o grau é
                                positivo.
                              </span>
                            </span>
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                        <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                          O.D. (olho direito)
                        </span>
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[1]?.Degree || "0.00"
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                        <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                          O.E. (olho esquerdo)
                        </span>
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Degree || "0.00"
                          }
                        />
                      </div>
                    </div>
                  )}
                {parsedObservation?.PrescriptionType === 1 &&
                  parsedObservation?.Refraction[0].Type === 3 && (
                    <div className="flex flex-col mt-10">
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span className=""></span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Grau esférico{" "}
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Grau esférico:
                                </span>
                                É o grau das lentes de contato para a correção
                                de miopia e hipermetropia. No caso da miopia, o
                                grau é negativo. Se for hipermetropia, o grau é
                                positivo.
                              </span>
                            </span>
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 items-center">
                        <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                          A.O. (ambos os olhos)
                        </span>
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Degree || "0.00"
                          }
                        />
                      </div>
                    </div>
                  )}

                {parsedObservation?.PrescriptionType === 2 &&
                  parsedObservation?.Refraction[0].Type !== 3 && (
                    <div className="flex flex-col mt-4">
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <span className=""></span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Grau esférico{" "}
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Grau esférico:
                                </span>
                                É o grau das lentes de contato para a correção
                                de miopia e hipermetropia. No caso da miopia, o
                                grau é negativo. Se for hipermetropia, o grau é
                                positivo.
                              </span>
                            </span>
                          </span>
                        </span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Cilindro
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Cilindro:
                                </span>
                                É o grau das lentes de contato para a correção
                                de astigmatismo.
                              </span>
                            </span>
                          </span>
                        </span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Eixo
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Eixo:
                                </span>
                                É o posicionamento das lentes de contato nos
                                olhos para a correção do astigmatismo. É
                                definido pelo médico e o valor consta na
                                receita.
                              </span>
                            </span>
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                        <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                          O.D. (olho direito)
                        </span>
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[1]?.Degree || "0.00"
                          }
                        />
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[1]?.Cylinder || "0.00"
                          }
                        />
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[1]?.Axis || "0.00"
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                        <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                          O.E. (olho esquerdo)
                        </span>
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Degree || "0.00"
                          }
                        />
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Cylinder || "0.00"
                          }
                        />
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Axis || "0.00"
                          }
                        />
                      </div>
                    </div>
                  )}
                {parsedObservation?.PrescriptionType === 2 &&
                  parsedObservation?.Refraction[0].Type === 3 && (
                    <div className="flex flex-col mt-10">
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <span className=""></span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Grau esférico{" "}
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Grau esférico:
                                </span>
                                É o grau das lentes de contato para a correção
                                de miopia e hipermetropia. No caso da miopia, o
                                grau é negativo. Se for hipermetropia, o grau é
                                positivo.
                              </span>
                            </span>
                          </span>
                        </span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Cilindro
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Cilindro:
                                </span>
                                É o grau das lentes de contato para a correção
                                de astigmatismo.
                              </span>
                            </span>
                          </span>
                        </span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Eixo
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Eixo:
                                </span>
                                É o posicionamento das lentes de contato nos
                                olhos para a correção do astigmatismo. É
                                definido pelo médico e o valor consta na
                                receita.
                              </span>
                            </span>
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                        <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                          A.O. (ambos os olhos)
                        </span>
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Degree || "0.00"
                          }
                        />

                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Cylinder || "0.00"
                          }
                        />
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Axis || "0.00"
                          }
                        />
                      </div>
                    </div>
                  )}

                {parsedObservation?.PrescriptionType === 3 &&
                  parsedObservation?.Refraction[0].Type !== 3 && (
                    <div className="flex flex-col mt-4">
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <span className=""></span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Grau esférico{" "}
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Grau esférico:
                                </span>
                                É o grau das lentes de contato para a correção
                                de miopia e hipermetropia. No caso da miopia, o
                                grau é negativo. Se for hipermetropia, o grau é
                                positivo.
                              </span>
                            </span>
                          </span>
                        </span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Cilindro
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Cilindro:
                                </span>
                                É o grau das lentes de contato para a correção
                                de astigmatismo.
                              </span>
                            </span>
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                        <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                          O.D. (olho direito)
                        </span>
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[1]?.Degree || "0.00"
                          }
                        />
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[1]?.Cylinder || "0.00"
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                        <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                          O.E. (olho esquerdo)
                        </span>
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Degree || "0.00"
                          }
                        />
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Cylinder || "0.00"
                          }
                        />
                      </div>
                    </div>
                  )}
                {parsedObservation?.PrescriptionType === 3 &&
                  parsedObservation?.Refraction[0].Type === 3 && (
                    <div className="flex flex-col mt-10">
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span className=""></span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Grau esférico{" "}
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Grau esférico:
                                </span>
                                É o grau das lentes de contato para a correção
                                de miopia e hipermetropia. No caso da miopia, o
                                grau é negativo. Se for hipermetropia, o grau é
                                positivo.
                              </span>
                            </span>
                          </span>
                        </span>
                        <span className="text-careBlue text-sm flex items-center gap-1">
                          Adição
                          <span className=" md:block tooltip text-careDarkBlue cursor-pointer">
                            <IoIosInformationCircle
                              className="text-gray-400"
                              size={18}
                            />
                            <span className="tooltiptext">
                              <span className="md:text-sm xl:text-xs 2xl:text-base">
                                <span className="text-careDarkBlue mr-1">
                                  {" "}
                                  Adição:
                                </span>
                                É o grau das lentes de contato para a correção
                                de astigmatismo.
                              </span>
                            </span>
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 items-center">
                        <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                          A.O. (ambos os olhos)
                        </span>
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Degree || "0.00"
                          }
                        />
                        <InputModal
                          disabled
                          value={
                            parsedObservation?.Refraction[0]?.Cylinder || "0.00"
                          }
                        />
                      </div>
                    </div>
                  )}
              </div>
              <div className="flex items-center gap-3 md:gap-10 mt-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        isPastSchedule ? "text-gray-400" : "text-careBlue"
                      }`}
                    >
                      Agendamento
                    </span>
                    <span
                      onClick={
                        !isPastSchedule ? reschedulingModal.onOpen : undefined
                      }
                      className={`cursor-pointer ${
                        isPastSchedule
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-careLightBlue"
                      }`}
                    >
                      <PiPencilSimpleLineLight size={20} />
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <LuCalendarCheck
                      size={20}
                      className={`${
                        isPastSchedule ? "text-gray-400" : "text-careLightBlue"
                      }`}
                    />
                    <span
                      className={`${
                        isPastSchedule ? "text-gray-400" : "text-careBlue"
                      } text-sm`}
                    >
                      {dayjs(dataIndividual?.scheduleDateStart)
                        .locale("pt-br")
                        .format("DD [de] MMMM [de] YYYY")}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <LuAlarmClock
                      size={20}
                      className={`${
                        isPastSchedule ? "text-gray-400" : "text-careLightBlue"
                      }`}
                    />
                    <span
                      className={`${
                        isPastSchedule ? "text-gray-400" : "text-careBlue"
                      } text-sm`}
                    >
                      {dayjs(dataIndividual?.scheduleDateStart).format("HH:mm")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-careBlue font-bold">
                      Status da consulta
                    </span>
                  </div>
                  <span
                    className={`${
                      dataIndividual?.statusStringMapName === "Confirmado"
                        ? "text-green-600 bg-[#E5F1EC] border border-[#E5F1EC] w-40 text-center rounded-full py-2"
                        : dataIndividual?.statusStringMapName === "Cancelado"
                        ? "text-yellow-600 bg-[#FFF0EB] border border-[#FFF0EB] w-40 text-center rounded-full py-2"
                        : dataIndividual?.statusStringMapName === "Aguardando"
                        ? "text-gray-500 bg-[#E8E8E8] border border-[#E8E8E8] w-40 text-center rounded-full py-2"
                        : dataIndividual?.statusStringMapName ===
                          "Não Compareceu"
                        ? "text-pink-500 bg-[#F1E5EC] border border-[#F1E5EC] w-40 text-center rounded-full py-2"
                        : dataIndividual?.statusStringMapName === "Compareceu"
                        ? "text-purple-500 bg-[#F1EBF8] border border-[#F1EBF8] w-40 text-center rounded-full py-2"
                        : ""
                    }`}
                  >
                    {dataIndividual?.statusStringMapName}
                  </span>
                </div>
              </div>

              {canShowCancelButton && (
                <>
                  {/* Botao para cancelar */}
                  <div className="flex flex-col gap-3 items-center mt-10 md:mt-5">
                    <span className="text-careBlue font-bold">
                      Deseja cancelar o agendamento?
                    </span>
                    <Button
                      onClick={shedulingModalCancel.onOpen}
                      customClass="w-full md:w-48 bg-careLightBlue border-careLightBlue py-2 mb-2"
                      label="Cancelar"
                    />
                  </div>
                </>
              )}

              {canShowButtons && (
                <>
                  {/* Botao para informar se compareceu ou nao */}
                  <div className="flex flex-col gap-3 items-center mt-10 md:mt-5">
                    <span className="text-careBlue font-bold">
                      O(a) compareceu à consulta?
                    </span>
                    <div className="flex gap-3 w-full items-center justify-center">
                      <Button
                        onClick={notAttendedVisitClinicc}
                        customClass="w-full md:w-60 bg-careBlue border-careBlue py-2 mb-2"
                        label="Não compareceu"
                      />
                      <Button
                        onClick={confirmVisitAttendancee}
                        customClass="w-full md:w-60 bg-careLightBlue border-careLightBlue py-2 mb-2"
                        label="Compareceu"
                      />
                    </div>
                  </div>
                </>
              )}
            </ModalSheduling>

            {/* modal de cancelar agendamento */}
            <ModalShedulingCancel
              isOpen={shedulingModalCancel.isOpen}
              onClose={shedulingModalCancel.onClose}
              customClass="md:w-[45%] h-full md:h-auto"
            >
              <div className="flex flex-col gap-3">
                <span className="text-careLightBlue text-3xl font-bold text-center">
                  Cancelar agendamento
                </span>
                <span className="text-careBlue font-bold text-center">
                  Após o cancelamento, não será possível desfazer a ação e o(a)
                  paciente será notificado(a) por e-mail.
                </span>
                <div className="mt-8">
                  <span className="text-careBlue font-bold">
                    Motivo do cancelamento:
                  </span>
                  <CustomSelect
                    fullWidth
                    onChange={(e) =>
                      setCancelAgendamento({
                        ...cancelAgendamento,
                        Reason: e.target.value,
                      })
                    }
                    value={cancelAgendamento.Reason}
                    name="reason"
                    options={[
                      {
                        value: "O motivo não poderá comparecer",
                        id: "O motivo não poderá comparecer",
                      },
                      {
                        value:
                          "Ajustes na agenda e necessidade de realocar consultas",
                        id: "Ajustes na agenda e necessidade de realocar consultas",
                      },
                      {
                        value:
                          "Falha em equipamento, sistema ou falta de energia elétrica",
                        id: "Falha em equipamento, sistema ou falta de energia elétrica",
                      },
                      {
                        value: "O(a) pacientes não poderá comparecer",
                        id: "O(a) pacientes não poderá comparecer",
                      },
                      { value: "Outros", id: "Outros" },
                    ]}
                    placeholder="Selecione o motivo"
                  />
                </div>
                <div className="flex flex-col gap-3 items-center mt-10 md:mt-5">
                  <span className="text-careBlue font-bold">
                    Deseja confirmar essa ação?
                  </span>
                  <div className="flex gap-3 w-full items-center justify-center">
                    <Button
                      onClick={shedulingModalCancel.onClose}
                      customClass="w-full md:w-60 bg-careBlue border-careBlue py-2 mb-2"
                      label="Voltar"
                    />
                    <Button
                      disabled={!cancelAgendamento.Reason}
                      onClick={cancelVisitClinic}
                      customClass="w-full md:w-60 bg-careLightBlue border-careLightBlue py-2 mb-2"
                      label="Sim, cancelar"
                    />
                  </div>
                </div>
              </div>
            </ModalShedulingCancel>

            {/* modal de reagendamento */}
            <ModalShedulingReschedule
              isOpen={reschedulingModal.isOpen}
              onClose={reschedulingModal.onClose}
              customClass="md:w-[48%] h-full md:h-auto"
            >
              <div className="flex flex-col ml-5 mb-5">
                <span className="text-careLightBlue text-lg font-bold">
                  Reagendar data da consulta
                </span>
                <span className="text-careBlue text-base">
                  Após o reagendaento, da data, o(a) paciente será notificado(a)
                  e precisará confirmar a nova data proposta.
                </span>
                <span className="text-careBlue text-base">
                  Recomendamos que você entre em contato diretamente por
                  telefone ou e-mail para garantir a confirmação
                </span>
                <span className="text-careBlue text-base">
                  do novo agendamento.
                </span>
              </div>
              <div className="flex">
                <div className="flex">
                  <div className="md:flex md:flex-row flex flex-col gap-5">
                    <div>
                      <span className="text-careBlue font-bold ml-5">
                        Escolha o mês e o dia:
                      </span>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <ThemeProvider theme={newTheme}>
                          <StaticDatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            renderInput={(props: TextFieldProps) => (
                              <InputSheduling {...props} />
                            )}
                            shouldDisableDate={(date: dayjs.Dayjs) =>
                              date.day() === 0 || isHoliday(date)
                            }
                            displayStaticWrapperAs="desktop"
                            minDate={dayjs()}
                          />
                        </ThemeProvider>
                      </LocalizationProvider>
                    </div>
                    <div className="hidden md:block h-80 w-[2px] mt-1 bg-careLightBlue"></div>
                    <div className="block md:hidden h-[2px] w-full bg-careLightBlue"></div>

                    <div>
                      <span className="text-careBlue font-bold ml-5">
                        Escolha um horário:
                      </span>
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {[
                          "08:00",
                          "09:00",
                          "09:30",
                          "10:00",
                          "11:00",
                          "11:30",
                          "13:00",
                          "13:30",
                          "14:00",
                          "15:00",
                          "15:30",
                          "16:00",
                          "16:30",
                          "17:00",
                          "17:30",
                        ].map((time) => (
                          <span
                            key={time}
                            className={`border-2 rounded-lg py-2 px-4 text-center text-careBlue cursor-pointer ${
                              selectedTime === time
                                ? "bg-careLightBlue border-careLightBlue text-white font-bold"
                                : "border-gray-300"
                            }`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex md:flex-row gap-3 w-full items-center justify-center mt-5">
                <Button
                  onClick={reschedulingModal.onClose}
                  customClass="w-full md:w-60 bg-careBlue border-careBlue py-2 mb-2"
                  label="cancelar"
                />
                <Button
                  onClick={editVisittoClinicc}
                  customClass="w-full md:w-60 bg-careLightBlue border-careLightBlue py-2 mb-2"
                  label="confirmar"
                />
              </div>
            </ModalShedulingReschedule>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulingPartinerTwo;
