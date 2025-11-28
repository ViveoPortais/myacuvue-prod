import * as React from "react";
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { appointments } from "@/constants/appointments";
import { IoIosInformationCircle, IoMdSquare, IoMdTime } from "react-icons/io";
import { GiAlarmClock } from "react-icons/gi";
import useOpenModalSheduling from "@/hooks/useOpenModalSheduling";
import ModalSheduling from "../modals/ModalSheduling";
import InputModal from "../input/InputModal";
import { FiPhone } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { PiPencilSimpleLineLight } from "react-icons/pi";
import { LuAlarmClock, LuCalendarCheck } from "react-icons/lu";
import Button from "../button/Button";
import ModalShedulingCancel from "../modals/ModalShedulingCancel";
import CustomSelect from "../select/Select";
import useOpenModalShedulingCancel from "@/hooks/useOpenModalShedulingCancel";
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

const allDayLocalizationMessages = {
  "pt-BR": {
    allDay: "",
  },
};

const getAllDayMessages = (locale: "pt-BR"): { allDay: string } =>
  allDayLocalizationMessages[locale];

interface CalendarECPTwoState {
  data: typeof appointments;
  currentDate: Date;
  locale: "pt-BR";
  isModalOpen: boolean;
}

const CalendarECPTwo: React.FC = () => {
  const idSheduling = useLogin();
  const [data, setData] = React.useState(appointments);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [locale, setLocale] = React.useState<"pt-BR">("pt-BR");
  const shedulingModalCancel = useOpenModalShedulingCancel();
  const shedulingModal = useOpenModalSheduling();
  const reschedulingModal = useOpenModalReschedule();
  const [selectedDate, setSelectedDate] = React.useState<dayjs.Dayjs | null>(
    null
  );
  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const [dataIndividual, setDataIndividual] = React.useState<any>(null);
  const [parsedObservation, setParsedObservation] = React.useState<any>(null);
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
  const isHoliday = (date: dayjs.Dayjs) => {
    return holidays.includes(date.format("YYYY-MM-DD"));
  };
  const [cancelAgendamento, setCancelAgendamento] = React.useState({
    OriginEntityId: idSheduling.idSheduling || "",
    Reason: "",
    ProgramCode: "073",
  });
  const [visitAttendance, setVisitAttendance] = React.useState({
    OriginEntityId: idSheduling.idShedulingCalendar || "",
    ProgramCode: "073",
  });
  const [notAttendedVisit, setNotAttendedVisit] = React.useState({
    OriginEntityId: idSheduling.idShedulingCalendar || "",
    ProgramCode: "073",
  });

  const [editVisit, setEditVisit] = React.useState({
    ScheduleDateStart: "",
    OriginEntityId: idSheduling.idSheduling || "",
    ProgramCode: "073",
  });

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

  React.useEffect(() => {
    listVisitiClinicTwo().then((response) => {
      if (Array.isArray(response)) {
        const formattedData = response.map((item) => ({
          title: item.name,
          startDate: dayjs(item.scheduleDateStart).toDate(),
          endDate: dayjs(item.scheduleDateStart).add(1, "hour").toDate(),
          id: item.friendlyCode,
          status: item.statusStringMapName,
          visitId: item.visitId,
        }));
        setData(formattedData);
      }
    });

    if (idSheduling.idShedulingCalendar) {
      visitiClinicIndInvidual();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idSheduling.idShedulingCalendar]);

  React.useEffect(() => {
    if (shedulingModalCancel.isOpen && idSheduling.idShedulingCalendar) {
      setCancelAgendamento((prevState: any) => ({
        ...prevState,
        OriginEntityId: idSheduling.idShedulingCalendar,
      }));
    }
    if (shedulingModal.isOpen && idSheduling.idShedulingCalendar) {
      setVisitAttendance((prevState: any) => ({
        ...prevState,
        OriginEntityId: idSheduling.idShedulingCalendar,
      }));
      setNotAttendedVisit((prevState: any) => ({
        ...prevState,
        OriginEntityId: idSheduling.idShedulingCalendar,
      }));
    }

    if (reschedulingModal.isOpen && idSheduling.idShedulingCalendar) {
      setEditVisit((prevState: any) => ({
        ...prevState,
        OriginEntityId: idSheduling.idShedulingCalendar,
      }));
    }
  }, [
    shedulingModalCancel.isOpen,
    idSheduling.idShedulingCalendar,
    shedulingModal.isOpen,
    reschedulingModal.isOpen,
  ]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedObservation]);

  const visitiClinicIndInvidual = async () => {
    listVisitiClinicIndInvidual(idSheduling.idShedulingCalendar).then(
      (response) => {
        if (Array.isArray(response)) {
          const formattedData = response.map((item) => ({
            name: item.name,
            friendlyCode: item.friendlyCode,
            emailAddress: item.emailAddress,
            mobilePhone: item.mobilePhone,
            scheduleDateStart: item.scheduleDateStart,
            statusStringMapName: item.statusStringMapName,
            Refraction: item.Refraction,
          }));
          setDataIndividual(formattedData[0]);
        }

        if (response[0]?.observation) {
          try {
            setParsedObservation(JSON.parse(response[0].observation));
          } catch (error) {
            console.error("Erro ao converter observation:", error);
          }
        }
      }
    );
  };

  const cancelVisitClinic = async () => {
    console.log("Cancelamento ID:", cancelAgendamento.OriginEntityId);
    cancelVisittoClinic(cancelAgendamento as any)
      .then((res) => {
        toast.success(res.value);
        shedulingModalCancel.onClose();
        shedulingModal.onClose();
        idSheduling.setIdShedulingCalendar("");
        setCancelAgendamento({
          OriginEntityId: idSheduling.idShedulingCalendar || "",
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
        idSheduling.setIdShedulingCalendar("");
        setVisitAttendance({
          OriginEntityId: idSheduling.idShedulingCalendar || "",
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
        idSheduling.setIdShedulingCalendar("");
        setNotAttendedVisit({
          OriginEntityId: idSheduling.idShedulingCalendar || "",
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
        idSheduling.setIdShedulingCalendar("");
        shedulingModal.onClose();
        setEditVisit({
          ScheduleDateStart: "",
          OriginEntityId: idSheduling.idShedulingCalendar || "",
          ProgramCode: "073",
        });
      })
      .catch(() => {
        toast.error("Erro ao reagendar. Tente novamente.");
      });
  };

  const closeModalAlldDate = () => {
    shedulingModal.onClose();
    idSheduling.setIdShedulingCalendar("");
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
    <>
      <Paper>
        <Scheduler data={data} locale={locale} height={630}>
          <ViewState defaultCurrentDate={currentDate} />
          <WeekView startDayHour={7.5} endDayHour={20.5} />
          <Toolbar />
          <DateNavigator
            navigationButtonComponent={(props: any) => {
              const { type } = props;
              return (
                <DateNavigator.NavigationButton {...props} className={``} />
              );
            }}
          />
          <Appointments
            appointmentComponent={(props: any) => {
              const { data } = props;
              let bgColor = "bg-gray-300";

              switch (data.status) {
                case "Confirmado":
                  bgColor = "bg-[#E5F1EC]";
                  break;
                case "Cancelado":
                  bgColor = "bg-[#FCE8E2]";
                  break;
                case "Compareceu":
                  bgColor = "bg-[#F0EBF8]";
                  break;
                case "Não Compareceu":
                  bgColor = "bg-[#FAE7F7]";
                  break;
              }

              return (
                <Appointments.Appointment
                  {...props}
                  className={`${bgColor} text-careBlue rounded-md`}
                  onClick={() => {
                    shedulingModal.onOpen();
                    idSheduling.setIdShedulingCalendar(data.visitId);
                  }}
                />
              );
            }}
            appointmentContentComponent={({
              data,
              ...restProps
            }: {
              data: any;
            }) => (
              <Appointments.AppointmentContent
                {...restProps}
                data={data}
                recurringIconComponent={() => null}
                type="vertical"
                formatDate={() => ""}
                durationType="short"
                resources={[]}
              >
                <div className="flex flex-col">
                  <span className="text-careBlue font-bold">{data.title}</span>{" "}
                  <div className="flex items-center gap-1">
                    <GiAlarmClock
                      className={`${
                        data.status === "Confirmado"
                          ? "text-green-500"
                          : data.status === "Cancelado"
                          ? "text-red-500"
                          : data.status === "Compareceu"
                          ? "text-purple-500"
                          : data.status === "Não Compareceu"
                          ? "text-pink-500"
                          : "text-gray-500"
                      } text-lg`}
                    />{" "}
                    <span className="text-careBlue font-bold">
                      {new Date(data.startDate)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}
                      :
                      {new Date(data.startDate)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </Appointments.AppointmentContent>
            )}
          />
          <TodayButton
            buttonComponent={(props: any) => {
              return <TodayButton.Button {...props} className="md:ml-[33%]" />;
            }}
            messages={{ today: "Hoje" }}
          />{" "}
        </Scheduler>
      </Paper>
      <div className="grid grid-cols-2 md:flex md:flex-row gap-4 justify-center mt-3 mb-5 md:mb-0">
        <div className="flex items-center gap-1">
          <IoMdSquare size={24} className="text-green-600" />

          <span className="text-sm text-gray-500">Confirmado</span>
        </div>
        <div className="flex items-center gap-1">
          <IoMdSquare size={24} className="text-orange-600" />

          <span className="text-sm text-gray-500">Cancelado</span>
        </div>
        <div className="flex items-center gap-1">
          <IoMdSquare size={24} className="text-purple-600" />

          <span className="text-sm text-gray-500">Compareceu</span>
        </div>
        <div className="flex items-center gap-1">
          <IoMdSquare size={24} className="text-pink-600" />

          <span className="text-sm text-gray-500">Nao compareceu</span>
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
          <span className="text-careBlue">{dataIndividual?.friendlyCode}</span>
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
                          É o grau das lentes de contato para a correção de
                          miopia e hipermetropia. No caso da miopia, o grau é
                          negativo. Se for hipermetropia, o grau é positivo.
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
                    value={parsedObservation?.Refraction[1]?.Degree || "0.00"}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                  <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                    O.E. (olho esquerdo)
                  </span>
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[0]?.Degree || "0.00"}
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
                          É o grau das lentes de contato para a correção de
                          miopia e hipermetropia. No caso da miopia, o grau é
                          negativo. Se for hipermetropia, o grau é positivo.
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
                    value={parsedObservation?.Refraction[0]?.Degree || "0.00"}
                  />
                </div>
              </div>
            )}

          {parsedObservation?.PrescriptionType === 2 &&
            parsedObservation?.Refraction[0].Type !== 2 && (
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
                          É o grau das lentes de contato para a correção de
                          miopia e hipermetropia. No caso da miopia, o grau é
                          negativo. Se for hipermetropia, o grau é positivo.
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
                          É o grau das lentes de contato para a correção de
                          astigmatismo.
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
                          <span className="text-careDarkBlue mr-1"> Eixo:</span>
                          É o posicionamento das lentes de contato nos olhos
                          para a correção do astigmatismo. É definido pelo
                          médico e o valor consta na receita.
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
                    value={parsedObservation?.Refraction[1]?.Degree || "0.00"}
                  />
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[1]?.Cylinder || "0.00"}
                  />
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[1]?.Axis || "0.00"}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                  <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                    O.E. (olho esquerdo)
                  </span>
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[0]?.Degree || "0.00"}
                  />
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[0]?.Cylinder || "0.00"}
                  />
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[0]?.Axis || "0.00"}
                  />
                </div>
              </div>
            )}
          {parsedObservation?.PrescriptionType === 2 &&
            parsedObservation?.Refraction[0].Type === 2 && (
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
                          É o grau das lentes de contato para a correção de
                          miopia e hipermetropia. No caso da miopia, o grau é
                          negativo. Se for hipermetropia, o grau é positivo.
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
                          É o grau das lentes de contato para a correção de
                          astigmatismo.
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
                          <span className="text-careDarkBlue mr-1"> Eixo:</span>
                          É o posicionamento das lentes de contato nos olhos
                          para a correção do astigmatismo. É definido pelo
                          médico e o valor consta na receita.
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
                    value={parsedObservation?.Refraction[0]?.Degree || "0.00"}
                  />

                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[0]?.Cylinder || "0.00"}
                  />
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[0]?.Axis || "0.00"}
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
                          É o grau das lentes de contato para a correção de
                          miopia e hipermetropia. No caso da miopia, o grau é
                          negativo. Se for hipermetropia, o grau é positivo.
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
                          É o grau das lentes de contato para a correção de
                          astigmatismo.
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
                    value={parsedObservation?.Refraction[1]?.Degree || "0.00"}
                  />
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[1]?.Cylinder || "0.00"}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                  <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                    O.E. (olho esquerdo)
                  </span>
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[0]?.Degree || "0.00"}
                  />
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[0]?.Cylinder || "0.00"}
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
                          É o grau das lentes de contato para a correção de
                          miopia e hipermetropia. No caso da miopia, o grau é
                          negativo. Se for hipermetropia, o grau é positivo.
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
                          É o grau das lentes de contato para a correção de
                          astigmatismo.
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
                    value={parsedObservation?.Refraction[0]?.Degree || "0.00"}
                  />
                  <InputModal
                    disabled
                    value={parsedObservation?.Refraction[0]?.Cylinder || "0.00"}
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
                onClick={!isPastSchedule ? reschedulingModal.onOpen : undefined}
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
                  : dataIndividual?.statusStringMapName === "Não Compareceu"
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
            Após o reagendaento, da data, o(a) paciente será notificado(a) e
            precisará confirmar a nova data proposta.
          </span>
          <span className="text-careBlue text-base">
            Recomendamos que você entre em contato diretamente por telefone ou
            e-mail para garantir a confirmação
          </span>
          <span className="text-careBlue text-base">do novo agendamento.</span>
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
    </>
  );
};

export default CalendarECPTwo;
