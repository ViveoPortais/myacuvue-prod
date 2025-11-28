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
import Button from "../button/Button";
import { listEditCalendar } from "@/services/account";
import { blockDateTimeVisit } from "@/services/diagnostic";
import { toast } from "react-toastify";

const feriadosNacionais = new Set([
  "2025-01-01", // Confraternização Universal
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
]);

const CalendarECPEdit: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedAppointments, setSelectedAppointments] = React.useState<any[]>(
    []
  );
  const [blockedTimes, setBlockedTimes] = React.useState<
    Record<string, string[]>
  >({});

  // Função para gerar horários para o mês atual (exceto domingos e feriados)
  const generateAppointments = (currentDate: Date): any[] => {
    const startHour = 8; // 8h30
    const endHour = 21; // 18h30
    const appointments: any[] = [];
    const year = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Calcula o número total de dias (mês atual + 15 dias)
    const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
    const daysInRange = daysInMonth + 15; // Mês atual + 15 dias

    for (let day = 1; day <= daysInRange; day++) {
      const date = new Date(year, currentMonth, day);
      const dayOfWeek = date.getDay();
      const formattedDate = date.toISOString().split("T")[0];

      if (dayOfWeek !== 0 && !feriadosNacionais.has(formattedDate)) {
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            // Intervalo de 30 minutos
            if (hour === 19 && minute === 30) {
              appointments.push({
                id: `${year}-${currentMonth + 1}-${day}-${hour}-${minute}`,
                startDate: new Date(year, currentMonth, day, hour, minute),
                endDate: new Date(year, currentMonth, day, 20, 0), // 20h
              });
            } else if (hour < 20 || (hour === 20 && minute < 30)) {
              appointments.push({
                id: `${year}-${currentMonth + 1}-${day}-${hour}-${minute}`,
                title: "Disponível",
                startDate: new Date(year, currentMonth, day, hour, minute),
                endDate: new Date(year, currentMonth, day, hour, minute + 30),
                status: "Disponível",
              });
            }
          }
        }
      }
    }

    return appointments;
  };

  const listEditCalendarr = async () => {
    listEditCalendar().then((response) => {
      const blockedDates = response[0]?.blockedDates;
      if (blockedDates && typeof blockedDates === "string") {
        try {
          const blockedData = JSON.parse(blockedDates);

          if (Array.isArray(blockedData)) {
            const blockedTimesMap: Record<string, string[]> = {};
            blockedData.forEach((block: { Date: string; Times: string[] }) => {
              const date = block.Date.split("T")[0];
              blockedTimesMap[date] = block.Times;
            });
            setBlockedTimes(blockedTimesMap);
          }
        } catch (error) {
          console.error("Erro ao fazer JSON.parse:", error);
        }
      }
    });
  };

  React.useEffect(() => {
    listEditCalendarr();
  }, []);

  // Memoize the appointments data based on the current month
  const data = React.useMemo(() => {
    const appointments = generateAppointments(currentDate); // Passa a data atual, não o mês

    // Bloquear os horários com base nos dados processados
    return appointments.map((appointment) => {
      const date = appointment.startDate.toISOString().split("T")[0];
      const time = `${appointment.startDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${appointment.startDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      if (blockedTimes[date]?.includes(time)) {
        appointment.status = "Indisponível";
      }
      return appointment;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, blockedTimes]); // Observa `currentDate` e `blockedTimes`

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointments((prevSelected) => {
      const updatedSelection = prevSelected.includes(appointment.id)
        ? prevSelected.filter((id) => id !== appointment.id) // Remove se já estiver selecionado
        : [...prevSelected, appointment.id]; // Adiciona se não estiver selecionado

      return updatedSelection;
    });
  };

  const blockDateTimeVisitt = () => {
    const blockedDatesMap: Record<string, string[]> = {};

    selectedAppointments.forEach((appointmentId) => {
      const appointment = data.find((a) => a.id === appointmentId);
      if (appointment) {
        const date = new Date(appointment.startDate)
          .toISOString()
          .split("T")[0];
        const time = new Date(appointment.startDate)
          .toTimeString()
          .split(" ")[0]
          .slice(0, 5);

        if (!blockedDatesMap[date]) {
          blockedDatesMap[date] = [];
        }

        blockedDatesMap[date].push(time);
      }
    });

    const blockedDates = Object.entries(blockedDatesMap).map(
      ([date, times]) => ({
        date,
        times,
      })
    );

    blockDateTimeVisit({
      programCode: "073",
      blockedDates,
      isBlockedDate: true,
    })
      .then((res) => {
        listEditCalendarr(); // Atualiza os horários bloqueados
        setSelectedAppointments([]); // Limpa as seleções
        toast.success("Agenda editada com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao bloquear horário", error);
        toast.error("Erro ao editar a agenda");
      });
  };

  const unlockDateTimeVisitt = () => {
    const blockedDatesMap: Record<string, string[]> = {};

    selectedAppointments.forEach((appointmentId) => {
      const appointment = data.find((a) => a.id === appointmentId);
      if (appointment) {
        const date = new Date(appointment.startDate)
          .toISOString()
          .split("T")[0];
        const time = new Date(appointment.startDate)
          .toTimeString()
          .split(" ")[0]
          .slice(0, 5);

        if (!blockedDatesMap[date]) {
          blockedDatesMap[date] = [];
        }

        blockedDatesMap[date].push(time);
      }
    });

    const blockedDates = Object.entries(blockedDatesMap).map(
      ([date, times]) => ({
        date,
        times,
      })
    );

    blockDateTimeVisit({
      programCode: "073",
      blockedDates,
      isBlockedDate: false,
    })
      .then((res) => {
        listEditCalendarr(); // Atualiza os horários bloqueados
        setSelectedAppointments([]); // Limpa as seleções
        toast.success("Agenda editada com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao bloquear horário", error);
        toast.error("Erro ao editar a agenda");
      });
  };

  return (
    <>
      <Paper>
        <Scheduler data={data} locale="pt-BR" height={630}>
          <ViewState defaultCurrentDate={currentDate} />
          <WeekView
            startDayHour={8}
            endDayHour={21}
            timeScaleLayoutComponent={() => null} // Remove a escala de horários na lateral
            timeTableCellComponent={(props) => (
              <WeekView.TimeTableCell
                {...props}
                style={{ borderBottom: "none", height: 60 }} // Altere o valor de altura aqui para espaçar mais
              />
            )}
          />
          <Toolbar />
          <DateNavigator />
          <Appointments
            appointmentComponent={(props: any) => {
              const isSelected = selectedAppointments.includes(props.data.id);

              // Garantindo que startDate é um objeto Date
              const appointmentDateObj = new Date(props.data.startDate);
              const appointmentDate = appointmentDateObj
                .toISOString()
                .split("T")[0]; // "YYYY-MM-DD"
              const appointmentTime = appointmentDateObj
                .toTimeString()
                .substring(0, 5); // "HH:mm"

              // Verifica se a data e o horário estão bloqueados
              const isBlocked =
                blockedTimes[appointmentDate]?.includes(appointmentTime);

              return (
                <Appointments.Appointment
                  {...props}
                  className={`mb-4 rounded-md md:mt-7 md:ml-1 md:h-12 border-2 flex justify-center items-center shadow-LG cursor-pointer ${
                    isSelected
                      ? "bg-careLightBlue border-careLightBlue" // Se estiver selecionado, sempre azul
                      : isBlocked
                      ? "bg-gray-300 border-gray-300 opacity-50 hover:opacity-100 hover:bg-careLightBlue hover:border-careLightBlue"
                      : "bg-white border-gray-300 hover:bg-careLightBlue hover:border-careLightBlue"
                  }`}
                  onClick={() => handleAppointmentClick(props.data)} // Permite clicar em horários bloqueados
                />
              );
            }}
            appointmentContentComponent={(props: any) => {
              const isSelected = selectedAppointments.includes(props.data.id);
              return (
                <Appointments.AppointmentContent
                  {...props}
                  data={props.data}
                  recurringIconComponent={() => null}
                  type="vertical"
                  formatDate={() => ""}
                  durationType="short"
                  resources={[]}
                >
                  <div className="flex justify-center items-center gap-1">
                    <span
                      className={`text-sm ${
                        isSelected
                          ? "text-careBlue font-bold"
                          : "text-careBlue font-bold"
                      }`}
                    >
                      {new Date(props.data.startDate)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}
                      :
                      {new Date(props.data.startDate)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </div>
                </Appointments.AppointmentContent>
              );
            }}
          />
          <TodayButton
            buttonComponent={(props: any) => {
              return <TodayButton.Button {...props} className="md:ml-[33%]" />;
            }}
            messages={{ today: "Hoje" }}
          />
        </Scheduler>
      </Paper>
      <div className="flex gap-3 w-full items-center justify-center mt-10">
        <Button
          onClick={unlockDateTimeVisitt}
          customClass="w-full md:w-60 bg-careBlue border-careBlue py-2 mb-2"
          label="Desbloquear"
        />
        <Button
          onClick={blockDateTimeVisitt}
          customClass="w-full md:w-60 bg-careLightBlue border-careLightBlue py-2 mb-2"
          label="Salvar"
        />
      </div>
    </>
  );
};

export default CalendarECPEdit;
