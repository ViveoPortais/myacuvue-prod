import { Checkbox } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Button from "../button/Button";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Image from "next/image";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getCalendar } from "@/services/calendar";
import useLogin from "@/hooks/useLogin";
import { toast } from "react-toastify";

const CalendarPatient = () => {
  const dataStorage = useLogin();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeSelected, setTimeSelected] = useState("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [postalCode, setPostalCode] = useState("");
  const [locationData, setLocationData] = useState([]);
  const [isLocationClicked, setIsLocationClicked] = useState(false);
  const [surveyData, setSurveyData] = useState<any>([]);
  const [calendarData, setCalendarData] = useState([]);
  const [calendarHour, setCalendarHour] = useState(0);
  const [postData, setPostData] = useState<any>({
    name: dataStorage?.userDataPatient[0]?.namePatient,
    scheduleDateStart: "",
    eyePrescription: {
      refraction: {
        spheric: {
          left: {
            far: 0,
            near: 0,
          },
          right: {
            far: 0,
            near: 0,
          },
        },
        cilindric: {
          left: {
            far: 0,
            near: 0,
          },
          right: {
            far: 0,
            near: 0,
          },
        },
        axis: {
          left: {
            far: 0,
            near: 0,
          },
          right: {
            far: 0,
            near: 0,
          },
        },
      },
    },
    accountId: "",
  });

  useEffect(() => {
    async function fetchCalendarData() {
      if (postData.accountId === "") return;
      const filters = {
        accountId: postData.accountId,
        month: dayjs().format("MM"),
      };
      getCalendar(filters)
        .then((response) => {
          setCalendarData(response);
        })
        .catch((error) => {
          toast.error("Erro ao buscar dados de calendário");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    fetchCalendarData();
  }, [postData.accountId]);

  const handleTimeSelected = (time: any) => {
    setTimeSelected(time);
  };

  return (
    <div>
      <div className="flex justify-start rounded-xl border border-careGrey bg-white">
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* <DateCalendar className="" /> */}
          </LocalizationProvider>
        </div>

        {/* <div className=" flex flex-col lg:border-l border-careGrey">
          <span className="text-lg text-careLightBlue p-4 border-b-2 border-careGrey">
            Selecione um horario
          </span>
          <div className="flex flex-row items-center mt-2">
            <Checkbox
              sx={{
                color: "#007cc4",
                "&.Mui-checked": {
                  color: "#03014C",
                },
              }}
              icon={
                <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checkedIcon={
                <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checked={timeSelected === "09 horas da manhã"}
              onClick={() => {
                handleTimeSelected("09 horas da manhã");
                setCalendarHour(9);
              }}
            />
            <span
              className={`text-sm text-careBlue ${
                timeSelected === "09 horas da manhã"
                  ? "text-selected-color"
                  : ""
              }`}
            >
              09:00
            </span>
            <Checkbox
              sx={{
                color: "#007cc4",
                "&.Mui-checked": {
                  color: "#03014C",
                },
              }}
              icon={
                <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checkedIcon={
                <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checked={timeSelected === "10 horas da manhã"}
              onClick={() => {
                handleTimeSelected("10 horas da manhã");
                setCalendarHour(10);
              }}
            />
            <span
              className={`text-sm text-careBlue ${
                timeSelected === "10 horas da manhã"
                  ? "text-selected-color"
                  : ""
              }`}
            >
              10:00
            </span>
            <Checkbox
              sx={{
                color: "#007cc4",
                "&.Mui-checked": {
                  color: "#03014C",
                },
              }}
              icon={
                <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checkedIcon={
                <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checked={timeSelected === "11 horas da manhã"}
              onClick={() => {
                handleTimeSelected("11 horas da manhã");
                setCalendarHour(11);
              }}
            />
            <span
              className={`text-sm text-careBlue ${
                timeSelected === "11 horas da manhã"
                  ? "text-selected-color"
                  : ""
              }`}
            >
              11:00
            </span>
            <Checkbox
              sx={{
                color: "#007cc4",
                "&.Mui-checked": {
                  color: "#03014C",
                },
              }}
              icon={
                <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checkedIcon={
                <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checked={timeSelected === "12 horas da tarde"}
              onClick={() => {
                handleTimeSelected("12 horas da tarde");
                setCalendarHour(12);
              }}
            />
            <span
              className={`text-sm text-careBlue ${
                timeSelected === "12 horas da manhã"
                  ? "text-selected-color"
                  : ""
              }`}
            >
              12:00
            </span>
          </div>
          <div className="flex flex-row items-center">
            <Checkbox
              sx={{
                color: "#007cc4",
                "&.Mui-checked": {
                  color: "#03014C",
                },
              }}
              icon={
                <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checkedIcon={
                <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checked={timeSelected === "13 horas da tarde"}
              onClick={() => {
                handleTimeSelected("13 horas da tarde");
                setCalendarHour(13);
              }}
            />
            <span
              className={`text-sm text-careBlue ${
                timeSelected === "13 horas da manhã"
                  ? "text-selected-color"
                  : ""
              }`}
            >
              13:00
            </span>
            <Checkbox
              sx={{
                color: "#007cc4",
                "&.Mui-checked": {
                  color: "#03014C",
                },
              }}
              icon={
                <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checkedIcon={
                <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checked={timeSelected === "14 horas da tarde"}
              onClick={() => {
                handleTimeSelected("14 horas da tarde");
                setCalendarHour(14);
              }}
            />
            <span
              className={`text-sm text-careBlue ${
                timeSelected === "14 horas da manhã"
                  ? "text-selected-color"
                  : ""
              }`}
            >
              14:00
            </span>
            <Checkbox
              sx={{
                color: "#007cc4",
                "&.Mui-checked": {
                  color: "#03014C",
                },
              }}
              icon={
                <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checkedIcon={
                <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checked={timeSelected === "15 horas da tarde"}
              onClick={() => {
                handleTimeSelected("15 horas da tarde");
                setCalendarHour(15);
              }}
            />
            <span
              className={`text-sm text-careBlue ${
                timeSelected === "15 horas da manhã"
                  ? "text-selected-color"
                  : ""
              }`}
            >
              15:00
            </span>
            <Checkbox
              sx={{
                color: "#007cc4",
                "&.Mui-checked": {
                  color: "#03014C",
                },
              }}
              icon={
                <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checkedIcon={
                <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checked={timeSelected === "16 horas da tarde"}
              onClick={() => {
                handleTimeSelected("16 horas da tarde");
                setCalendarHour(16);
              }}
            />
            <span
              className={`text-sm text-careBlue ${
                timeSelected === "16 horas da manhã"
                  ? "text-selected-color"
                  : ""
              }`}
            >
              16:00
            </span>
          </div>
          <div className="flex flex-row items-center">
            <Checkbox
              sx={{
                color: "#007cc4",
                "&.Mui-checked": {
                  color: "#03014C",
                },
              }}
              icon={
                <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checkedIcon={
                <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checked={timeSelected === "17 horas da tarde"}
              onClick={() => {
                handleTimeSelected("17 horas da tarde");
                setCalendarHour(17);
              }}
            />
            <span
              className={`text-sm text-careBlue ${
                timeSelected === "17 horas da manhã"
                  ? "text-selected-color"
                  : ""
              }`}
            >
              17:00
            </span>
            <Checkbox
              sx={{
                color: "#007cc4",
                "&.Mui-checked": {
                  color: "#03014C",
                },
              }}
              icon={
                <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checkedIcon={
                <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
              }
              checked={timeSelected === "18 horas da noite"}
              onClick={() => {
                handleTimeSelected("18 horas da noite");
                setCalendarHour(18);
              }}
            />
            <span
              className={`text-sm text-careBlue ${
                timeSelected === "18 horas da manhã"
                  ? "text-selected-color"
                  : ""
              }`}
            >
              18:00
            </span>
          </div>
        </div>
        <div className="mt-4 ml-2 flex flex-col ">
          <span className="text-sm whitespace-nowrap text-careLightBlue">
            Seu agendamento
          </span>
          <div className="flex items-center gap-2">
            <span className="text-careBlue my-2">
              <Image src="/date-calendar.png" width={20} height={20} alt="" />
            </span>
            {selectedDate && (
              <span className="text-careBlue text-xs whitespace-nowrap">
                {calendarData &&
                  selectedDate.toDate().toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-careBlue my-2">
              <Image src="/alarm.png" width={20} height={20} alt="" />
            </span>
            {timeSelected && (
              <span className="text-careBlue text-xs whitespace-nowrap">
                {timeSelected}
              </span>
            )}
          </div>
        </div> */}
        {/* <div className="flex justify-end lg:mt-10 lg:mr-3 mt-3 mb-3 mr-2">
          <Button
            customClass="bg-careGreen border-careGreen py-2 lg:w-40 w-20"
            label="Salvar"
          />
        </div> */}
      </div>
    </div>
  );
};

export default CalendarPatient;
