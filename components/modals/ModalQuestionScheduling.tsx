import React, { use } from "react";
import {
  Checkbox,
  createTheme,
  TextFieldProps,
  ThemeProvider,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Button from "../button/Button";
import { useEffect, useState } from "react";
import Input from "../input/Input";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { responseSurvey } from "@/services/questions";
import { getLocation } from "@/services/location";
import { getCalendar } from "@/services/calendar";
import {
  blockDateTimeVisit,
  schedulevisittoclinic,
} from "@/services/diagnostic";
import { toast } from "react-toastify";
import { getAddressByCep } from "@/services/cep";
import useLogin from "@/hooks/useLogin";
import InputSheduling from "../input/InputSheduling";
import Image from "next/image";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { PiSmileySadFill } from "react-icons/pi";
import ClinicMap from "../maps/ClinicMap";
import { CiPhone } from "react-icons/ci";
import { IoArrowForwardOutline, IoMapSharp } from "react-icons/io5";
import { ImCheckboxChecked } from "react-icons/im";
import { ImCheckboxUnchecked } from "react-icons/im";
import NewSelect from "../select/NewSelect";
import { IoIosInformationCircle } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { AiOutlineGlobal } from "react-icons/ai";
import {
  logisticStuffAddition,
  logisticStuffAxle,
  logisticStuffCylinder,
  logisticStuffDegree,
} from "@/services/logistic";
import InputMask from "react-input-mask";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { showChats } from "../specialist/HuggyChat";
import { HiArrowLongLeft } from "react-icons/hi2";
import { HiArrowLongRight } from "react-icons/hi2";
import "dayjs/locale/pt-br";
dayjs.extend(localizedFormat);
dayjs.locale("pt-br");

interface ModalQuestionSchedulingProps {
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
}

interface Location {
  internalControl: string;
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const ModalQuestionScheduling: React.FC<ModalQuestionSchedulingProps> = ({
  currentQuestion,
  setCurrentQuestion,
}) => {
  const dataStorage = useLogin();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedResponseCheckbox, setSelectedResponseCheckbox] = useState<
    string | null
  >(null);
  const [clickStep2LocalProximo, setClickStep2LocalProximo] = useState(false);
  const [clickStep2LocalAnterior, setClickStep2LocalAnterior] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isTimeSelected, setIsTimeSelected] = useState(false);
  const [nameClinic, setNameClinic] = useState("");
  const [ruaClinic, setruaClinic] = useState("");
  const [numeroClinic, setnumeroClinic] = useState("");
  const [bairroClinic, setbairroClinic] = useState("");
  const [telefoneClinic, settelefoneClinic] = useState("");
  const shouldDisableButton = selectedResponseCheckbox === "Não";
  const [isLoading, setIsLoading] = useState(false);
  const [timeSelected, setTimeSelected] = useState("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | any>(null);
  const [maps, setMaps] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [locationData, setLocationData] = useState<Location[]>([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isLocationClicked, setIsLocationClicked] = useState(false);
  const [surveyData, setSurveyData] = useState<any>([]);
  const [calendarData, setCalendarData] = useState([]);
  const [calendarHour, setCalendarHour] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const [mapsOpen, setMapsOpen] = useState(false);
  const [internalControlMessage, setInternalControlMessage] = useState(false);
  const [miopiaHipermetropia, setMiopiaHipermetropia] = useState(false);
  const [miopiaHipermetropiaAstigmatismo, setMiopiaHipermetropiaAstigmatismo] =
    useState(false);
  const [presbiopia, setPresbiopia] = useState(false);
  const [indexClinicas, setIndexClicas] = useState<any>(null);
  const [mesmoGrauParaAmbos, setMesmoGrauParaAmbos] = useState(true);
  const [mesmoGrauParaAmbosPresbiopia, setMesmoGrauParaAmbosPresbiopia] =
    useState(true);
  const [mesmoGrauParaAmbosAstigmatismo, setMesmoGrauParaAmbosAstigmatismo] =
    useState(true);
  const [paraLonge, setParaLonge] = useState(true);
  const [paraPerto, setParaPerto] = useState(true);
  const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [prescricaoLonge, setPrescricaoLonge] = useState({
    olhoDireito: { Degree: 0, Cylinder: 0, Axis: 0 },
    olhoEsquerdo: { Degree: 0, Cylinder: 0, Axis: 0 },
  });
  const [prescricaoPerto, setPrescricaoPerto] = useState({
    olhoDireito: { Degree: 0, Cylinder: 0, Axis: 0 },
    olhoEsquerdo: { Degree: 0, Cylinder: 0, Axis: 0 },
  });

  const [grus, setGraus] = useState<any | null>([]);
  const [cylinders, setCylinders] = useState<any | null>([]);
  const [axes, setAxes] = useState<any | null>([]);
  const [grusEsquerdo, setGrausEsquerdo] = useState<any | null>([]);
  const [cylindersEsquerdo, setCylindersEsquerdo] = useState<any | null>([]);
  const [axesEsquerdo, setAxesEsquerdo] = useState<any | null>([]);
  const [selectedGrauOlhoDireitoEsferico, setSelectedGrauOlhoDireitoEsferico] =
    useState<any>("");
  const [
    selectedGrauOlhoDireitoCilindrico,
    setSelectedGrauOlhoDireitoCilindrico,
  ] = useState<any>("");
  const [selectedGrauOlhoDireitoEixo, setSelectedGrauOlhoDireitoEixo] =
    useState<any>("");
  const [
    selectedGrauOlhoEsquerdoEsferico,
    setSelectedGrauOlhoEsquerdoEsferico,
  ] = useState<any>("");
  const [
    selectedGrauOlhoEsquerdoCilindrico,
    setSelectedGrauOlhoEsquerdoCilindrico,
  ] = useState<any>("");
  const [selectedGrauOlhoEsquerdoEixo, setSelectedGrauOlhoEsquerdoEixo] =
    useState<any>("");

  const [postData, setPostData] = useState<any>({
    name: dataStorage?.userDataPatient[0]?.namePatient,
    scheduleDateStart: "",
    eyePrescription: {
      PrescriptionType: 0,
      refraction: [
        {
          Type: 1,
          Degree: 0,
          Cylinder: 0,
          Axis: 0,
          DegreeAway: false,
          DegreeToNear: false,
        },
        {
          Type: 2,
          Degree: 0,
          Cylinder: 0,
          Axis: 0,
          DegreeAway: false,
          DegreeToNear: false,
        },
      ],
    },
    accountId: "",
  });

  const [postDataBoth, setPostDataBoth] = useState<any>({
    name: dataStorage?.userDataPatient[0]?.namePatient,
    scheduleDateStart: "",
    eyePrescription: {
      PrescriptionType: 1,
      refraction: [
        {
          Type: 3,
          Degree: 0,
          Cylinder: 0,
          Axis: 0,
          DegreeAway: false,
          DegreeToNear: false,
        },
      ],
    },
    accountId: "",
  });

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  useEffect(() => {
    if (presbiopia && !mesmoGrauParaAmbosPresbiopia) {
      setPostDataBoth({
        ...postDataBoth,
        eyePrescription: {
          PrescriptionType: 3,
          refraction: [
            {
              Type: 3,
              Degree: parseFloat(
                selectedGrauOlhoDireitoEsferico.toString().replace(",", ".")
              ),
              Cylinder: parseFloat(
                selectedGrauOlhoDireitoCilindrico.toString().replace(",", ".")
              ),
              Axis: 0,
              DegreeAway: false,
              DegreeToNear: false,
            },
          ],
        },
      });
    }
    if (miopiaHipermetropia && !mesmoGrauParaAmbos) {
      setPostDataBoth({
        ...postDataBoth,
        eyePrescription: {
          PrescriptionType: 1,
          refraction: [
            {
              Type: 3,
              Degree: parseFloat(
                selectedGrauOlhoDireitoEsferico.toString().replace(",", ".")
              ),
              Cylinder: 0,
              Axis: 0,
              DegreeAway: false,
              DegreeToNear: false,
            },
          ],
        },
      });
    }

    if (miopiaHipermetropiaAstigmatismo && !mesmoGrauParaAmbosAstigmatismo) {
      setPostDataBoth({
        ...postDataBoth,
        eyePrescription: {
          PrescriptionType: 2,
          refraction: [
            {
              Type: 3,
              Degree: parseFloat(
                selectedGrauOlhoDireitoEsferico.toString().replace(",", ".")
              ),
              Cylinder: parseFloat(
                selectedGrauOlhoDireitoCilindrico.toString().replace(",", ".")
              ),
              Axis: parseFloat(
                selectedGrauOlhoDireitoEixo.toString().replace(",", ".")
              ),
              DegreeAway: false,
              DegreeToNear: false,
            },
          ],
        },
      });
    }
    if (presbiopia) {
      setPostData({
        ...postData,
        eyePrescription: {
          ...postData.eyePrescription,
          PrescriptionType: 3,
          refraction: [
            {
              Type: 1,
              Degree: parseFloat(
                prescricaoLonge.olhoEsquerdo.Degree.toString().replace(",", ".")
              ),
              Cylinder: parseFloat(
                prescricaoLonge.olhoEsquerdo.Cylinder.toString().replace(
                  ",",
                  "."
                )
              ),
              Axis: parseFloat(
                prescricaoLonge.olhoEsquerdo.Axis.toString().replace(",", ".")
              ),
              DegreeAway: false,
              DegreeToNear: false,
            },
            {
              Type: 2,
              Degree: parseFloat(
                prescricaoLonge.olhoDireito.Degree.toString().replace(",", ".")
              ),
              Cylinder: parseFloat(
                prescricaoLonge.olhoDireito.Cylinder.toString().replace(
                  ",",
                  "."
                )
              ),
              Axis: parseFloat(
                prescricaoLonge.olhoDireito.Axis.toString().replace(",", ".")
              ),
              DegreeAway: false,
              DegreeToNear: false,
            },
          ],
        },
      });
    } else if (miopiaHipermetropia) {
      setPostData({
        ...postData,
        eyePrescription: {
          ...postData.eyePrescription,
          PrescriptionType: 1,
          refraction: [
            {
              Type: 1,
              Degree: parseFloat(
                selectedGrauOlhoEsquerdoEsferico.toString().replace(",", ".")
              ),
              Cylinder: parseFloat(
                selectedGrauOlhoEsquerdoCilindrico.toString().replace(",", ".")
              ),
              Axis: parseFloat(
                selectedGrauOlhoEsquerdoEixo.toString().replace(",", ".")
              ),
              DegreeAway: false,
              DegreeToNear: false,
            },
            {
              Type: 2,
              Degree: parseFloat(
                selectedGrauOlhoDireitoEsferico.toString().replace(",", ".")
              ),
              Cylinder: parseFloat(
                selectedGrauOlhoDireitoCilindrico.toString().replace(",", ".")
              ),
              Axis: parseFloat(
                selectedGrauOlhoDireitoEixo.toString().replace(",", ".")
              ),
              DegreeAway: false,
              DegreeToNear: false,
            },
          ],
        },
      });
    } else if (miopiaHipermetropiaAstigmatismo) {
      setPostData({
        ...postData,
        eyePrescription: {
          ...postData.eyePrescription,
          PrescriptionType: 2,
          refraction: [
            {
              Type: 1,
              Degree: parseFloat(
                selectedGrauOlhoEsquerdoEsferico.toString().replace(",", ".")
              ),
              Cylinder: parseFloat(
                selectedGrauOlhoEsquerdoCilindrico.toString().replace(",", ".")
              ),
              Axis: parseFloat(
                selectedGrauOlhoEsquerdoEixo.toString().replace(",", ".")
              ),
              DegreeAway: false,
              DegreeToNear: false,
            },
            {
              Type: 2,
              Degree: parseFloat(
                selectedGrauOlhoDireitoEsferico.toString().replace(",", ".")
              ),
              Cylinder: parseFloat(
                selectedGrauOlhoDireitoCilindrico.toString().replace(",", ".")
              ),
              Axis: parseFloat(
                selectedGrauOlhoDireitoEixo.toString().replace(",", ".")
              ),
              DegreeAway: false,
              DegreeToNear: false,
            },
          ],
        },
      });
    } else {
      setPostData({
        ...postData,
        eyePrescription: {
          ...postData.eyePrescription,
          PrescriptionType: 0,
          refraction: [
            {
              Type: 1,
              Degree: 0,
              Cylinder: 0,
              Axis: 0,
              DegreeAway: false,
              DegreeToNear: false,
            },
            {
              Type: 2,
              Degree: 0,
              Cylinder: 0,
              Axis: 0,
              DegreeAway: false,
              DegreeToNear: false,
            },
          ],
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    presbiopia,
    paraLonge,
    paraPerto,
    miopiaHipermetropia,
    miopiaHipermetropiaAstigmatismo,
    prescricaoLonge,
    prescricaoPerto,
    selectedGrauOlhoEsquerdoEsferico,
    selectedGrauOlhoEsquerdoCilindrico,
    selectedGrauOlhoEsquerdoEixo,
    selectedGrauOlhoDireitoEsferico,
    selectedGrauOlhoDireitoCilindrico,
    selectedGrauOlhoDireitoEixo,
  ]);

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

  useEffect(() => {
    if (currentQuestion === 4) {
      if (
        miopiaHipermetropia ||
        miopiaHipermetropiaAstigmatismo ||
        presbiopia
      ) {
        logisticStuffDegree(postData.eyePrescription.PrescriptionType).then(
          (response) => {
            const grausFetched = response.value.map((item: any) => ({
              value: item.value,
              id: item.label,
            }));
            setGraus(grausFetched);
            setGrausEsquerdo(grausFetched);
          }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nameClinic,
    ruaClinic,
    numeroClinic,
    bairroClinic,
    telefoneClinic,
    currentQuestion,
    postData.eyePrescription.PrescriptionType,
  ]);

  useEffect(() => {
    if (selectedGrauOlhoDireitoEsferico) {
      const grauComPonto = selectedGrauOlhoDireitoEsferico.replace(",", ".");
      const grauComPontoCilindrico = selectedGrauOlhoDireitoCilindrico
        ? selectedGrauOlhoDireitoCilindrico.replace(",", ".")
        : null;

      logisticStuffCylinder(
        grauComPonto,
        postData.eyePrescription.PrescriptionType
      ).then((response) => {
        const cylindersFetched = response.value.map((item: any) => ({
          value: item.value,
          id: item.label,
        }));
        setCylinders(cylindersFetched);
      });

      if (grauComPontoCilindrico) {
        logisticStuffAxle(
          grauComPonto,
          grauComPontoCilindrico,
          postData.eyePrescription.PrescriptionType
        ).then((response) => {
          const axesFetched = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));
          setAxes(axesFetched);
        });
      }

      if (postData.eyePrescription.PrescriptionType === 3) {
        logisticStuffAddition(
          grauComPonto,
          postData.eyePrescription.PrescriptionType
        ).then((response) => {
          const cylindersFetched = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));
          setCylinders(cylindersFetched);
        });
      }
    }
  }, [
    selectedGrauOlhoDireitoEsferico,
    selectedGrauOlhoDireitoCilindrico,
    postData.eyePrescription.PrescriptionType,
  ]);

  useEffect(() => {
    if (selectedGrauOlhoEsquerdoEsferico) {
      const grauComPonto = selectedGrauOlhoEsquerdoEsferico.replace(",", ".");
      const grauComPontoCilindrico = selectedGrauOlhoEsquerdoCilindrico
        ? selectedGrauOlhoEsquerdoCilindrico.replace(",", ".")
        : null;

      logisticStuffCylinder(
        grauComPonto,
        postData.eyePrescription.PrescriptionType
      ).then((response) => {
        const cylindersFetched = response.value.map((item: any) => ({
          value: item.value,
          id: item.label,
        }));
        setCylindersEsquerdo(cylindersFetched);
      });

      if (grauComPontoCilindrico) {
        logisticStuffAxle(
          grauComPonto,
          grauComPontoCilindrico,
          postData.eyePrescription.PrescriptionType
        ).then((response) => {
          const axesFetched = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));
          setAxesEsquerdo(axesFetched);
        });
      }
    }
  }, [
    selectedGrauOlhoEsquerdoEsferico,
    selectedGrauOlhoEsquerdoCilindrico,
    postData.eyePrescription.PrescriptionType,
  ]);

  useEffect(() => {
    if (prescricaoLonge.olhoDireito.Degree) {
      const grauComPonto =
        prescricaoLonge.olhoDireito.Degree.toString().replace(",", ".");
      const grauComPontoCilindrico = prescricaoLonge.olhoDireito.Cylinder
        ? prescricaoLonge.olhoDireito.Cylinder.toString().replace(",", ".")
        : null;

      if (grauComPontoCilindrico) {
        logisticStuffAxle(
          grauComPonto,
          grauComPontoCilindrico,
          postData.eyePrescription.PrescriptionType
        ).then((response) => {
          const axesFetched = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));
          setAxes(axesFetched);
        });
      }

      if (postData.eyePrescription.PrescriptionType === 3) {
        logisticStuffAddition(
          grauComPonto,
          postData.eyePrescription.PrescriptionType
        ).then((response) => {
          const cylindersFetched = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));
          setCylinders(cylindersFetched);
        });
      }
    }
  }, [
    prescricaoLonge.olhoDireito.Degree,
    prescricaoLonge.olhoDireito.Cylinder,
    postData.eyePrescription.PrescriptionType,
  ]);

  useEffect(() => {
    if (prescricaoLonge.olhoEsquerdo.Degree) {
      const grauComPonto =
        prescricaoLonge.olhoEsquerdo.Degree.toString().replace(",", ".");
      const grauComPontoCilindrico = prescricaoLonge.olhoEsquerdo.Cylinder
        ? prescricaoLonge.olhoEsquerdo.Cylinder.toString().replace(",", ".")
        : null;

      if (grauComPontoCilindrico) {
        logisticStuffAxle(
          grauComPonto,
          grauComPontoCilindrico,
          postData.eyePrescription.PrescriptionType
        ).then((response) => {
          const axesFetched = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));
          setAxesEsquerdo(axesFetched);
        });
      }
      if (postData.eyePrescription.PrescriptionType === 3) {
        logisticStuffAddition(
          grauComPonto,
          postData.eyePrescription.PrescriptionType
        ).then((response) => {
          const cylindersFetched = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));
          setCylindersEsquerdo(cylindersFetched);
        });
      }
    }
  }, [
    prescricaoLonge.olhoEsquerdo.Degree,
    prescricaoLonge.olhoEsquerdo.Cylinder,
    postData.eyePrescription.PrescriptionType,
  ]);

  useEffect(() => {
    if (prescricaoPerto.olhoDireito.Degree) {
      const grauComPonto =
        prescricaoPerto.olhoDireito.Degree.toString().replace(",", ".");
      const grauComPontoCilindrico = prescricaoPerto.olhoDireito.Cylinder
        ? prescricaoPerto.olhoDireito.Cylinder.toString().replace(",", ".")
        : null;

      logisticStuffCylinder(
        grauComPonto,
        postData.eyePrescription.PrescriptionType
      ).then((response) => {
        const cylindersFetched = response.value.map((item: any) => ({
          value: item.value,
          id: item.label,
        }));
        setCylinders(cylindersFetched);
      });

      if (grauComPontoCilindrico) {
        logisticStuffAxle(
          grauComPonto,
          grauComPontoCilindrico,
          postData.eyePrescription.PrescriptionType
        ).then((response) => {
          const axesFetched = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));
          setAxes(axesFetched);
        });
      }
    }
  }, [
    prescricaoPerto.olhoDireito.Degree,
    prescricaoPerto.olhoDireito.Cylinder,
    postData.eyePrescription.PrescriptionType,
  ]);

  useEffect(() => {
    if (prescricaoPerto.olhoEsquerdo.Degree) {
      const grauComPonto =
        prescricaoPerto.olhoEsquerdo.Degree.toString().replace(",", ".");
      const grauComPontoCilindrico = prescricaoPerto.olhoEsquerdo.Cylinder
        ? prescricaoPerto.olhoEsquerdo.Cylinder.toString().replace(",", ".")
        : null;

      logisticStuffCylinder(
        grauComPonto,
        postData.eyePrescription.PrescriptionType
      ).then((response) => {
        const cylindersFetched = response.value.map((item: any) => ({
          value: item.value,
          id: item.label,
        }));
        setCylindersEsquerdo(cylindersFetched);
      });

      if (grauComPontoCilindrico) {
        logisticStuffAxle(
          grauComPonto,
          grauComPontoCilindrico,
          postData.eyePrescription.PrescriptionType
        ).then((response) => {
          const axesFetched = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));
          setAxesEsquerdo(axesFetched);
        });
      }
    }
  }, [
    prescricaoPerto.olhoEsquerdo.Degree,
    prescricaoPerto.olhoEsquerdo.Cylinder,
    postData.eyePrescription.PrescriptionType,
  ]);

  const handleNextClick = async () => {
    setSurveyData((prevSurveyData: any) => {
      const newSurveyData = [
        ...prevSurveyData,
        {
          surveyId: "6b7c2c11-3951-4b5d-89b4-2797f487b9b7",
          questionResponse: selectedResponseCheckbox,
          questionId: "25ba0262-2e06-4ed7-bda6-a009e78d05c0",
        },
      ];

      if (currentQuestion === 1) {
        responseSurvey(newSurveyData).then(() => {});
      }
      setClickStep2LocalProximo(true);
      setClickStep2LocalAnterior(true);
      return newSurveyData;
    });

    if (currentQuestion === 3) {
      const formattedDateTime = dayjs(
        `${dayjs(selectedDate).format("YYYY-MM-DD")}T${selectedTime}`
      ).format("YYYY-MM-DDTHH:mm:ss.SSS");

      setPostData({
        ...postData,
        scheduleDateStart: formattedDateTime,
      });

      setPostDataBoth({
        ...postDataBoth,
        scheduleDateStart: formattedDateTime,
      });
    }

    const maxQuestion = 5;
    if (currentQuestion < maxQuestion - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }

    if (currentQuestion === 4) {
      const dataToSend = !mesmoGrauParaAmbos ? postDataBoth : postData;
      try {
        setIsLoading(true);
        const response = await schedulevisittoclinic(dataToSend);
 
        if (response?.isValidData === false) {
          toast.error(
            response?.value
          );
 
          if (postalCode) {
            await getClinics(postalCode);
            setSelectedTime("");
          }
          
          return;
        } else if (response?.isValidData === true) {
          const maxQuestion = 6;
          if (currentQuestion < maxQuestion - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setClickStep2LocalProximo(false);
            setClickStep2LocalAnterior(false);
          }
        }
      } catch (error) {
        toast.error("Erro ao agendar a visita. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
 
      blockDateTimeVisitt();
    }
  };

  useEffect(() => {
    console.log("selectedDate", selectedDate);
    console.log("calendarHour", calendarHour);
  }, [selectedDate, calendarHour]);

  const handleReturnStep = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  const handlePostalCodeChange = async (e: any) => {
    setIsLoading(true);
    if (postalCode.length < 8) {
      toast.error("Favor inserir um CEP válido.");
      setLocationData([]);
      setIsLoading(false);
      setMaps(false);
      return;
    }
    if (postalCode.length >= 8) {
      getAddressByCep(postalCode)
        .then((response) => {
          getClinics(postalCode);
          setMaps(true);
        })
        .catch((error) => {
          setLocationData([]);
          setMaps(false);
          toast.error(
            "Falha ao buscar dados de localização, verifique o CEP inserido."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleValuePostalCode = (e: any) => {
    setPostalCode(e.target.value);
  };

  const getClinics = async (newPostalCode: string) => {
    const filters = { postalCode: newPostalCode };

    try {
      const response = await getLocation(filters);

      const validLocations = response.filter(
        (location: { internalControl: string }) =>
          parseFloat(location.internalControl) <= 100
      );
      setInternalControlMessage(
        validLocations.length === 0 && response.length > 0
      );

      setLocationData(validLocations);

      const blocked = response[indexClinicas as any]?.customString1;
      setBlockedTimes(JSON.parse(blocked));
      console.log(blocked);
    } catch (error) {
      console.error("Erro ao buscar dados de localização:", error);
    }
  };

  const selectedDateFormatted = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null;

  const blockedTimesForDate = selectedDateFormatted
    ? (() => {
        try {
          const parsedBlockedTimes = blockedTimes as any;

          if (!parsedBlockedTimes || parsedBlockedTimes.length === 0) {
            return [];
          }

          const blocked = parsedBlockedTimes.find(
            (blocked: any) =>
              dayjs(blocked.Date).startOf("day").format("YYYY-MM-DD") ===
              selectedDateFormatted
          );

          if (!blocked) {
            return [];
          }

          return blocked?.Times || [];
        } catch (error) {
          console.error("Erro ao parsear os horários bloqueados:", error);

          return [];
        }
      })()
    : [];

  const handleSpanClick = (
    locationId: any,
    latitude: any,
    longitude: any,
    index: number
  ) => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.error("Latitude ou Longitude inválidos");
      return;
    }

    setIsLocationClicked(locationId);
    setLatitude(lat);
    setLongitude(lng);
    setPostData({ ...postData, accountId: locationId });
    setPostDataBoth({ ...postDataBoth, accountId: locationId });
    setMapsOpen(true);
    setIndexClicas(index);
    console.log(index);
  };

  useEffect(() => {
    if (indexClinicas !== null) {
      getClinics(postalCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexClinicas]);

  const handleButtonClick = () => {
    showChats();
  };

  const blockDateTimeVisitt = () => {
    const formattedDate = selectedDateFormatted
      ? new Date(selectedDateFormatted).toISOString().split("T")[0] +
        "T00:00:00"
      : "";
    const blockedDates = [
      {
        Date: formattedDate,
        Times: [selectedTime],
      },
    ];
    blockDateTimeVisit({
      programCode: "073",
      isBlockedDate: true,
      blockedDates,
      AccountId: postData.accountId,
    })
      .then((res) => {})
      .catch((error) => {});
  };

  const isPastTime = (time: string) => {
    const [hour, minutes] = time.split(":").map(Number);
    const selectedDateObj = new Date(selectedDate);
    return (
      selectedDateObj.toDateString() === now.toDateString() &&
      (hour < currentHour || (hour === currentHour && minutes < currentMinutes))
    );
  };

  const holidays2025 = [
    "2025-01-01", // Confraternização Universal
    "2025-02-28", // Sexta-feira de Carnaval (data móvel, exemplo)
    "2025-03-02", // Segunda-feira de Carnaval
    "2025-03-05", // Quarta-feira de Cinzas
    "2025-04-18", // Sexta-feira Santa
    "2025-04-21", // Tiradentes
    "2025-05-01", // Dia do Trabalho
    "2025-06-19", // Corpus Christi (exemplo)
    "2025-09-07", // Independência
    "2025-10-12", // Nossa Senhora Aparecida
    "2025-11-02", // Finados
    "2025-11-15", // Proclamação da República
    "2025-12-25", // Natal
  ].map((date) => dayjs(date));

  const isHoliday = (date: Dayjs) => {
    return holidays2025.some((holiday) => holiday.isSame(date, "day"));
  };

  useEffect(() => {}, [clickStep2LocalProximo, clickStep2LocalAnterior]);

  return (
    <div className="w-full mt-6">
      {currentQuestion === 1 && (
        <div className="flex justify-center md:mt-28">
          <div className="flex flex-col items-center">
            <div className="hidden md:block">
              <span className="text-careDarkBlue font-bold">
                1. Você possui uma receita oftamológica emitida nos últimos 12
                meses?
              </span>
            </div>
            <div className="flex flex-col items-center md:hidden">
              <span className="text-careDarkBlue font-bold">
                1. Você possui uma receita oftamológica
              </span>
              <span className="text-careDarkBlue font-bold">
                emitida nos últimos 12 meses?
              </span>
            </div>
            <div className="flex items-center mt-5">
              <div className="flex items-center">
                <Checkbox
                  id="select_agendamento_pac_sim"
                  sx={{
                    color: "#007cc4",
                    "&.Mui-checked": {
                      color: "#007cc4",
                    },
                  }}
                  icon={
                    <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
                  }
                  checkedIcon={
                    <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
                  }
                  onClick={() => setSelectedResponseCheckbox("Sim")}
                  checked={selectedResponseCheckbox === "Sim"}
                />
                <span>Sim</span>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="select_agendamento_pac_nao"
                  sx={{
                    color: "#007cc4",
                    "&.Mui-checked": {
                      color: "#007cc4",
                    },
                  }}
                  icon={
                    <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
                  }
                  checkedIcon={
                    <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
                  }
                  checked={selectedResponseCheckbox === "Não"}
                  onClick={() => setSelectedResponseCheckbox("Não")}
                />
                <span>Não</span>
              </div>
            </div>
            {shouldDisableButton && (
              <div className="flex gap-3 items-center mt-5 border border-[#FDDFDF] bg-[#FDDFDF] rounded-md p-3">
                <div>
                  <PiSmileySadFill className="text-red-500" size={45} />
                </div>

                <div className="flex flex-col">
                  <span className="text-careDarkBlue">
                    Infelizmente, sem a prescrição oftalmológica válida não
                    conseguimos seguir com o agendamento.
                  </span>
                  <span className="text-careDarkBlue">
                    Por favor, consulte um oftalmologista. Em &quot;Onde
                    encontrar&quot;, você visualiza as clínicas próximas de seu
                    endereço.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {currentQuestion === 2 && (
        <div className="flex flex-col md:flex md:flex-row gap-5 p-5">
          <div className="w-full md:w-[70%]">
            <div className="flex flex-col md:flex md:flex-row gap-4 md:items-center">
              <div className="flex flex-col">
                <span className="text-careDarkBlue font-bold">
                  Digite seu CEP:
                </span>
                <InputMask
                  id="step2-input-cep"
                  onChange={handleValuePostalCode}
                  mask="99999-999"
                  maskChar={null}
                  value={postalCode}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      className="md:w-96 w-72 2xl:w-96 xl:w-72 xl:py-[1px]"
                      startIcon
                      imageSrc="/search-icon.png"
                    />
                  )}
                </InputMask>
              </div>

              <div
                id="click-step2-cep"
                onClick={handlePostalCodeChange}
                className="w-full md:w-14 p-4 rounded-lg md:rounded-full bg-careLightBlue flex justify-center items-center cursor-pointer hover:opacity-70 md:mt-8"
              >
                <IoArrowForwardOutline className="text-white" size={25} />
              </div>
            </div>

            {internalControlMessage && (
              <div className="md:w-[60%] flex gap-3 items-center border mt-5 border-[#FDDFDF] bg-[#FDDFDF] rounded-md p-3">
                <div>
                  <PiSmileySadFill className="text-red-500" size={45} />
                </div>

                <div className="flex flex-col">
                  <span className="text-careDarkBlue">
                    Programa indisponível na sua região.
                  </span>
                </div>
              </div>
            )}

            <div className="overflow-y-auto pr-2 max-h-[400px] mt-5">
              <div className="mt-5">
                <span className="text-sm text-careMenuGrey">
                  {locationData.length > 0
                    ? `1-${locationData.length} de ${locationData.length} resultados`
                    : ""}
                </span>
              </div>

              {locationData
                .filter((location) => {
                  const distance = parseFloat(location.internalControl);
                  if (distance > 100) {
                    return false;
                  }
                  return true;
                })
                .map((location: any, index: number) => (
                  <div key={location.id} className="mt-5">
                    <div
                      className={`flex flex-col w-full h-full p-5 border-2 rounded-lg mt-2 text-sm ${
                        isLocationClicked === true && "w-full"
                      } ${
                        isLocationClicked === location.id &&
                        "border-careLightBlue"
                      }`}
                    >
                      <div className="flex flex-col w-full cursor-pointer">
                        <div
                          id={`click-step2-clinica-${location.id}`}
                          onClick={() => {
                            handleSpanClick(
                              location.id,
                              location.latitude,
                              location.longitude,
                              index
                            );
                            setNameClinic(location.mainContact);
                            setruaClinic(location.addressName);
                            setnumeroClinic(location.addressNumber);
                            setbairroClinic(location.addressCity);
                            settelefoneClinic(location.mobilePhone);
                          }}
                          className="flex gap-3 items-center"
                        >
                          <div className="w-12 h-12 p-5 rounded-full md:rounded-full bg-careLightBlue flex justify-center items-center text-white">
                            {index + 1}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-careLightBlue">
                              {parseFloat(location.internalControl)
                                .toFixed(1)
                                .replace(".", ",")}{" "}
                              km
                            </span>
                            <span className="text-sm text-careDarkBlue font-bold">
                              {location.name}
                            </span>
                            <span className="flex flex-col md:flex md:flex-row md:items-center gap-4 text-sm text-careDarkBlue">
                              {location.addressName} {location.addressNumber}{" "}
                              {location.addressComplement &&
                                " - " + location.addressComplement}{" "}
                              - {location.addressCity}
                              <span className="flex gap-1 items-center text-sm">
                                <CiPhone
                                  size={25}
                                  className="text-careLightBlue"
                                />
                                {location.mobilePhone.replace("_", "")}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <hr />
                          <hr />
                        </div>
                        <div className="flex gap-3 items-center mt-3">
                          <div
                            onClick={() => {
                              const destination = `${location.addressName}+${
                                location.addressNumber
                              }+${location.addressCity.replace(
                                /\s+/g,
                                "+"
                              )},+${location.addressState.replace(
                                /\s+/g,
                                "+"
                              )},+${location.addressPostalCode}`;
                              const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=my_location&destination=${destination}`;
                              window.open(mapUrl, "_blank");
                            }}
                            className="flex gap-3 items-center"
                          >
                            <IoMapSharp
                              size={25}
                              className="text-careLightBlue"
                            />
                            <div className="text-sm text-careDarkBlue font-bold hover:text-careLightBlue cursor-pointer">
                              Como chegar
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              const portalUrl = location.customString7;
                              if (portalUrl) {
                                window.open(portalUrl, "_blank");
                              }
                            }}
                            className="flex gap-2 items-center"
                          >
                            <AiOutlineGlobal
                              size={25}
                              className={
                                location.customString7
                                  ? "text-careLightBlue"
                                  : "text-carePlaceholder"
                              }
                            />
                            <div
                              className={`text-sm font-bold cursor-pointer ${
                                location.customString7
                                  ? "text-careDarkBlue hover:text-careLightBlue"
                                  : "text-carePlaceholder"
                              }`}
                            >
                              Site
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {maps && mapsOpen && (
            <div className="flex flex-col items-center mt-5 w-full md:w-[50%]">
              <ClinicMap latitude={latitude} longitude={longitude} />
              <div className="flex flex-col md:flex md:flex-row md:justify-center gap-3 mt-20 w-full mb-5">
                <Button
                  id={clickStep2LocalAnterior}
                  label="Anterior"
                  customClass="w-full bg-careBlue border border-careBlue text-white rounded-full md:w-40 h-12 xl:h-9 2xl:h-14"
                  onClick={handleReturnStep}
                  leftIcon={HiArrowLongLeft}
                />

                <Button
                  id={clickStep2LocalProximo}
                  label="Próximo"
                  customClass="w-full bg-careLightBlue border border-careLightBlue text-white rounded-full md:w-40 h-12 xl:h-9 2xl:h-14"
                  onClick={handleNextClick}
                  disabled={
                    shouldDisableButton ||
                    locationData.length === 0 ||
                    !isLocationClicked
                  }
                  rightIcon={HiArrowLongRight}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {currentQuestion === 3 && (
        <div className="grid grid-cols-1 md:grid md:grid-cols-3 gap-10 w-full">
          <div className="flex flex-col border-b-2 md:border-b-0 md:border-r-2 border-[#7FBDE1]">
            <div className="md:ml-16">
              <span className="text-sm text-careBlue font-bold">
                Escolha o mês e o dia:
              </span>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div
                id={`click-step3-hora-${selectedDate}`}
                className="flex flex-col items-center"
              >
                <StaticDatePicker
                  value={selectedDate}
                  onChange={(newDate) => {
                    setSelectedDate(newDate);
                    setIsDateSelected(true);
                    setSelectedTime("");
                    setCalendarHour(null);
                    setIsTimeSelected(false);
                  }}
                  renderInput={(props: TextFieldProps) => (
                    <InputSheduling {...props} />
                  )}
                  displayStaticWrapperAs="desktop"
                  minDate={dayjs()}
                  shouldDisableDate={(date: Dayjs) =>
                    date.day() === 0 || isHoliday(date)
                  }
                />
              </div>
            </LocalizationProvider>
          </div>
          <div
            className={`flex flex-col  border-b-2 md:border-b-0 md:border-r-2 border-[#7FBDE1] md:pb-0 pb-10 md:pr-14 pr-0 ${
              !selectedDate ? "blur-sm" : ""
            }`}
          >
            <span className="text-sm text-careBlue font-bold">
              Escolha um horário:
            </span>
            <div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[
                  "08:00",
                  "09:00",
                  "09:30",
                  "10:00",
                  "11:00",
                  "11:30",
                  "12:00",
                  "12:30",
                  "13:00",
                  "13:30",
                  "14:00",
                  "14:30",
                  "15:00",
                  "15:30",
                  "16:00",
                  "16:30",
                  "17:00",
                  "17:30",
                  "18:00",
                  "18:30",
                  "19:00",
                  "19:30",
                  "20:00",
                ].map((time) => (
                  <span
                    id={`click-step3-data-${time}`}
                    key={time}
                    className={`border-2 rounded-lg py-2 px-4 text-center text-careBlue cursor-pointer hover:opacity-50 ${
                      selectedTime === time
                        ? "bg-careLightBlue border-careLightBlue text-white font-bold"
                        : blockedTimesForDate.includes(time) || isPastTime(time)
                        ? "bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed hover:opacity-100"
                        : "border-gray-300"
                    }`}
                    onClick={() => {
                      if (
                        !blockedTimesForDate.includes(time) &&
                        !isPastTime(time)
                      ) {
                        setSelectedTime(time);
                        setCalendarHour(parseInt(time.split(":")[0]));
                        setIsTimeSelected(true);
                      }
                    }}
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div
              className={`border border-[#EAF6FD] bg-[#EAF6FD] rounded-lg px-12 py-6 ${
                !selectedDate || !selectedTime ? "blur-sm" : ""
              }`}
            >
              <span className="text-lg font-bold whitespace-nowrap text-careLightBlue">
                Seu agendamento
              </span>
              <div className="flex items-center gap-2">
                <span className="text-careBlue my-2">
                  <Image
                    src="/date-calendar.png"
                    width={18}
                    height={18}
                    alt=""
                  />
                </span>
                {selectedDate && (
                  <span className="text-careBlue text-xs font-bold whitespace-nowrap">
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
                  <Image src="/alarm.png" width={18} height={18} alt="" />
                </span>
                {selectedTime && (
                  <span className="text-careBlue text-xs font-bold whitespace-nowrap">
                    {selectedTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentQuestion === 4 && (
        <div className="flex flex-col items-start md:items-center">
          <div className="flex flex-col md:flex md:flex-row gap-3  md:items-center">
            <div className="pl-3">
              <span className="text-careDarkBlue text-base font-bold">
                Prescrição:
              </span>
            </div>

            <div className="flex items-center">
              <div>
                <Checkbox
                  id="check-step4-miopia-hiper"
                  sx={{
                    color: "#007cc4",
                    "&.Mui-checked": {
                      color: "#007cc4",
                    },
                  }}
                  icon={
                    <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
                  }
                  checkedIcon={
                    <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
                  }
                  checked={miopiaHipermetropia}
                  onClick={() => {
                    setMesmoGrauParaAmbos(true);
                    setMesmoGrauParaAmbosPresbiopia(false);
                    setMiopiaHipermetropia(!miopiaHipermetropia);
                    setMiopiaHipermetropiaAstigmatismo(false);
                    setPresbiopia(false);
                    setParaLonge(true);
                    setParaPerto(true);
                    setPostData({
                      ...postData,
                      eyePrescription: {
                        ...postData.eyePrescription,
                        PrescriptionType: miopiaHipermetropia ? 0 : 1,
                      },
                    });
                  }}
                />
              </div>
              <div>
                <span className="text-careDarkBlue text-base">
                  Miopia/Hipermetropia
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div>
                <Checkbox
                  id="check-step4-miopia-hiper-astig"
                  sx={{
                    color: "#007cc4",
                    "&.Mui-checked": {
                      color: "#007cc4",
                    },
                  }}
                  icon={
                    <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
                  }
                  checkedIcon={
                    <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
                  }
                  checked={miopiaHipermetropiaAstigmatismo}
                  onClick={() => {
                    setMesmoGrauParaAmbosAstigmatismo(true);
                    setMiopiaHipermetropiaAstigmatismo(true);
                    setMiopiaHipermetropia(false);
                    setPresbiopia(false);
                    setParaLonge(true);
                    setParaPerto(true);
                    setMesmoGrauParaAmbos(true);
                    setMesmoGrauParaAmbosPresbiopia(true);
                    setPostData({
                      ...postData,
                      eyePrescription: {
                        ...postData.eyePrescription,
                        PrescriptionType: miopiaHipermetropiaAstigmatismo
                          ? 0
                          : 2,
                      },
                    });
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-careDarkBlue text-base md:mt-5">
                  Miopia/Hipermetropia
                </span>
                <span className="text-careDarkBlue text-base">
                  + Astigmatismo
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div>
                <Checkbox
                  id="check-step4-presbiopia"
                  sx={{
                    color: "#007cc4",
                    "&.Mui-checked": {
                      color: "#007cc4",
                    },
                  }}
                  icon={
                    <RadioButtonUncheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
                  }
                  checkedIcon={
                    <RadioButtonCheckedIcon className="text-lg xl:text-xl 2xl:text-2xl" />
                  }
                  checked={presbiopia}
                  onClick={() => {
                    setMesmoGrauParaAmbosPresbiopia(true);
                    setPresbiopia(true);
                    setMiopiaHipermetropiaAstigmatismo(false);
                    setMiopiaHipermetropia(false);
                    setMesmoGrauParaAmbos(true);
                    setPostData({
                      ...postData,
                      eyePrescription: {
                        ...postData.eyePrescription,
                        PrescriptionType: presbiopia ? 0 : 3,
                      },
                    });
                  }}
                />
              </div>
              <div>
                <span className="text-careDarkBlue text-base">Presbiopia</span>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div>
              <Checkbox
                id="check-step4-mesmo-grau"
                sx={{
                  "&.Mui-checked": {
                    color: "#007cc4",
                  },
                  "&.Mui-disabled": {
                    color: "#d3d3d3",
                  },
                }}
                icon={
                  <ImCheckboxChecked
                    className={`${
                      !miopiaHipermetropia &&
                      !presbiopia &&
                      !miopiaHipermetropiaAstigmatismo
                        ? "text-gray-400"
                        : "text-careLightBlue"
                    } border-careLightBlue text-lg 2xl:text-xl`}
                  />
                }
                checkedIcon={
                  <ImCheckboxUnchecked
                    className={`${
                      !miopiaHipermetropia &&
                      !presbiopia &&
                      !miopiaHipermetropiaAstigmatismo
                        ? "text-gray-400"
                        : "text-careLightBlue"
                    } border-careLightBlue text-lg 2xl:text-xl`}
                  />
                }
                checked={mesmoGrauParaAmbos}
                onClick={() => {
                  setMesmoGrauParaAmbosPresbiopia(
                    (prevMesmoGrauParaAmbosPresbiopia) =>
                      !prevMesmoGrauParaAmbosPresbiopia
                  );
                  setMesmoGrauParaAmbos(
                    (prevMesmoGrauParaAmbos) => !prevMesmoGrauParaAmbos
                  );
                  setMesmoGrauParaAmbosAstigmatismo(
                    (prevMesmoGrauParaAmbosAstigmatismo) =>
                      !prevMesmoGrauParaAmbosAstigmatismo
                  );
                }}
              />
            </div>

            <span className={"text-careDarkBlue text-base"}>
              Mesmo grau para ambos os olhos
            </span>
          </div>
          {!mesmoGrauParaAmbos && miopiaHipermetropia && (
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
                        É o grau das lentes de contato para a correção de miopia
                        e hipermetropia. No caso da miopia, o grau é negativo.
                        Se for hipermetropia, o grau é positivo.
                      </span>
                    </span>
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 items-center">
                <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                  A.O. (ambos os olhos)
                </span>
                <NewSelect
                  id="select-step4-grau-esferico-AO"
                  name="degree"
                  value={selectedGrauOlhoDireitoEsferico}
                  className="w-full"
                  onChange={(e: any) =>
                    setSelectedGrauOlhoDireitoEsferico(e.target.value)
                  }
                  options={grus}
                />
              </div>
            </div>
          )}
          {miopiaHipermetropia && (
            <>
              {mesmoGrauParaAmbos && (
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
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                    <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                      O.D. (olho direito)
                    </span>
                    <NewSelect
                      id="select-step4-grau-esferico-OD"
                      name="degree"
                      value={selectedGrauOlhoDireitoEsferico}
                      className="w-full"
                      options={grus}
                      onChange={(e: any) => {
                        setSelectedGrauOlhoDireitoEsferico(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                    <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                      O.E. (olho esquerdo)
                    </span>
                    <NewSelect
                      id="select-step4-grau-esferico-OE"
                      name="degree"
                      value={selectedGrauOlhoEsquerdoEsferico}
                      options={grusEsquerdo}
                      onChange={(e: any) => {
                        setSelectedGrauOlhoEsquerdoEsferico(e.target.value);
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {!mesmoGrauParaAmbosAstigmatismo &&
            miopiaHipermetropiaAstigmatismo && (
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
                  <NewSelect
                    id="select-step4-grau-esferico-AO-OD"
                    name="degree"
                    value={selectedGrauOlhoDireitoEsferico}
                    className="w-full"
                    options={grus}
                    onChange={(e: any) => {
                      setSelectedGrauOlhoDireitoEsferico(e.target.value);
                    }}
                  />
                  <NewSelect
                    id="select-step4-grau-esferico-AO-Cilindro"
                    name="cylinder"
                    value={selectedGrauOlhoDireitoCilindrico}
                    options={cylinders}
                    onChange={(e: any) => {
                      setSelectedGrauOlhoDireitoCilindrico(e.target.value);
                    }}
                  />
                  <NewSelect
                    id="select-step4-grau-esferico-AO-Eixo"
                    name="axis"
                    value={selectedGrauOlhoDireitoEixo}
                    options={axes}
                    onChange={(e: any) => {
                      setSelectedGrauOlhoDireitoEixo(e.target.value);
                    }}
                  />
                </div>
              </div>
            )}

          {miopiaHipermetropiaAstigmatismo && (
            <>
              {mesmoGrauParaAmbosAstigmatismo && (
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
                            <span className="text-careDarkBlue mr-1">
                              {" "}
                              Eixo:
                            </span>
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
                    <NewSelect
                      id="select-step4-grau-esferico-OD"
                      name="degree"
                      value={selectedGrauOlhoDireitoEsferico}
                      className="w-full"
                      options={grus}
                      onChange={(e: any) => {
                        setSelectedGrauOlhoDireitoEsferico(e.target.value);
                      }}
                    />
                    <NewSelect
                      id="select-step4-grau-esferico-OD-Cilindro"
                      name="cylinder"
                      value={selectedGrauOlhoDireitoCilindrico}
                      options={cylinders}
                      onChange={(e: any) => {
                        setSelectedGrauOlhoDireitoCilindrico(e.target.value);
                      }}
                    />
                    <NewSelect
                      id="select-step4-grau-esferico-OD-Eixo"
                      name="axis"
                      value={selectedGrauOlhoDireitoEixo}
                      options={axes}
                      onChange={(e: any) => {
                        setSelectedGrauOlhoDireitoEixo(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                    <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                      O.E. (olho esquerdo)
                    </span>
                    <NewSelect
                      id="select-step4-grau-esferico-OE"
                      name="degree"
                      value={selectedGrauOlhoEsquerdoEsferico}
                      options={grusEsquerdo}
                      onChange={(e: any) => {
                        setSelectedGrauOlhoEsquerdoEsferico(e.target.value);
                      }}
                    />
                    <NewSelect
                      id="select-step4-grau-esferico-OE-Cilindro"
                      name="cylinder"
                      value={selectedGrauOlhoEsquerdoCilindrico}
                      options={cylindersEsquerdo}
                      onChange={(e: any) => {
                        setSelectedGrauOlhoEsquerdoCilindrico(e.target.value);
                      }}
                    />
                    <NewSelect
                      id="select-step4-grau-esferico-OE-Eixo"
                      name="axis"
                      value={selectedGrauOlhoEsquerdoEixo}
                      options={axesEsquerdo}
                      onChange={(e: any) => {
                        setSelectedGrauOlhoEsquerdoEixo(e.target.value);
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {presbiopia && (
            <>
              {mesmoGrauParaAmbosPresbiopia && (
                <div className="flex flex-col md:flex md:flex-row gap-5">
                  <div className="flex flex-col mt-10">
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className=""></span>
                      <span className="text-careBlue text-sm flex items-center gap-1">
                        Grau esférico
                        <span className="md:block tooltip text-careDarkBlue cursor-pointer">
                          <IoIosInformationCircle
                            className="text-gray-400"
                            size={18}
                          />
                          <span className="tooltiptext">
                            <span className="md:text-sm xl:text-xs 2xl:text-base">
                              <span className="text-careDarkBlue mr-1">
                                Grau esférico:
                              </span>
                              É o grau das lentes de contato para a correção de
                              miopia e hipermetropia. No caso da miopia, o grau
                              é negativo. Se for hipermetropia, o grau é
                              positivo.
                            </span>
                          </span>
                        </span>
                      </span>
                      <span className="text-careBlue text-sm flex items-center gap-1">
                        Adição
                        <span className="md:block tooltip text-careDarkBlue cursor-pointer">
                          <IoIosInformationCircle
                            className="text-gray-400"
                            size={18}
                          />
                          <span className="tooltiptext">
                            <span className="md:text-sm xl:text-xs 2xl:text-base">
                              <span className="text-careDarkBlue mr-1">
                                Adição:
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
                      <NewSelect
                        id="select-step4-grau-esferico-OD"
                        options={grus}
                        value={prescricaoLonge.olhoDireito.Degree}
                        onChange={(e: any) => {
                          setPrescricaoLonge({
                            ...prescricaoLonge,
                            olhoDireito: {
                              ...prescricaoLonge.olhoDireito,
                              Degree: e.target.value,
                            },
                          });
                        }}
                      />
                      <NewSelect
                        id="select-step4-grau-esferico-OD-Cilindro"
                        options={cylinders}
                        value={prescricaoLonge.olhoDireito.Cylinder}
                        onChange={(e: any) => {
                          setPrescricaoLonge({
                            ...prescricaoLonge,
                            olhoDireito: {
                              ...prescricaoLonge.olhoDireito,
                              Cylinder: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                      <span className="text-[12px] md:text-sm md:ml-10 text-careBlue w-20">
                        O.E. (olho esquerdo)
                      </span>
                      <NewSelect
                        id="select-step4-grau-esferico-OE"
                        options={grusEsquerdo}
                        value={prescricaoLonge.olhoEsquerdo.Degree}
                        onChange={(e: any) => {
                          setPrescricaoLonge({
                            ...prescricaoLonge,
                            olhoEsquerdo: {
                              ...prescricaoLonge.olhoEsquerdo,
                              Degree: e.target.value,
                            },
                          });
                        }}
                      />
                      <NewSelect
                        id="select-step4-grau-esferico-OE-Cilindro"
                        options={cylindersEsquerdo}
                        value={prescricaoLonge.olhoEsquerdo.Cylinder}
                        onChange={(e: any) => {
                          setPrescricaoLonge({
                            ...prescricaoLonge,
                            olhoEsquerdo: {
                              ...prescricaoLonge.olhoEsquerdo,
                              Cylinder: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {!mesmoGrauParaAmbosPresbiopia && presbiopia && (
            <>
              <div className="flex flex-col mt-10">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className=""></span>
                  <span className="text-careBlue text-sm flex items-center gap-1">
                    Grau esférico
                    <span className="md:block tooltip text-careDarkBlue cursor-pointer">
                      <IoIosInformationCircle
                        className="text-gray-400"
                        size={18}
                      />
                      <span className="tooltiptext">
                        <span className="md:text-sm xl:text-xs 2xl:text-base">
                          <span className="text-careDarkBlue mr-1">
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
                    <span className="md:block tooltip text-careDarkBlue cursor-pointer">
                      <IoIosInformationCircle
                        className="text-gray-400"
                        size={18}
                      />
                      <span className="tooltiptext">
                        <span className="md:text-sm xl:text-xs 2xl:text-base">
                          <span className="text-careDarkBlue mr-1">
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
                  <NewSelect
                    id="select-step4-grau-esferico-AO-OD"
                    name="degree"
                    value={selectedGrauOlhoDireitoEsferico}
                    className="w-full"
                    onChange={(e: any) =>
                      setSelectedGrauOlhoDireitoEsferico(e.target.value)
                    }
                    options={grus}
                  />
                  <NewSelect
                    id="select-step4-grau-esferico-AO-Cilindro"
                    name="cylinder"
                    value={selectedGrauOlhoDireitoCilindrico}
                    options={cylinders}
                    onChange={(e: any) => {
                      setSelectedGrauOlhoDireitoCilindrico(e.target.value);
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {currentQuestion === 5 && (
        <div className="flex justify-center mt-10">
          <div className="flex flex-col ">
            <div className="flex gap-4 items-center">
              <span>
                <FaCircleCheck size={40} className="text-green-500" />
              </span>
              <span className="text-lg font-bold text-careLightBlue">
                Pedido de agendamento realizado
              </span>
            </div>
            <div className="flex flex-col items-start mt-4">
              <span className="text-careBlue text-sm text-opacity-60">
                Você receberá um e-mail com todos os detalhes sobre o seu
                agendamento
              </span>
              <span className="text-careBlue text-sm text-opacity-60">
                de adaptação.
              </span>
            </div>
            <div className="mt-10">
              <div className="border border-[#EAF6FD] bg-[#EAF6FD] rounded-lg px-8 py-6">
                <span className="text-lg font-bold whitespace-nowrap text-careLightBlue">
                  Detalhes do seu agendamento
                </span>
                <div className="grid grid-cols-1 md:grid md:grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-careBlue my-2">
                      {/* <Image
                        src="/date-calendar.png"
                        width={18}
                        height={18}
                        alt=""
                      /> */}
                      <IoMapSharp size={20} className="text-careBlue" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-careBlue text-sm font-bold whitespace-nowrap">
                        {nameClinic}{" "}
                      </span>
                      <span className="text-careBlue text-sm font-bold whitespace-nowrap opacity-60">
                        {ruaClinic}, {numeroClinic} - {bairroClinic}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:mt-6">
                    <span className="text-careBlue my-2">
                      {/* <Image src="/alarm.png" width={18} height={18} alt="" /> */}
                      <CiPhone size={20} className="text-careBlue" />
                    </span>

                    <span className="text-careBlue text-sm font-bold whitespace-nowrap  opacity-60">
                      {telefoneClinic}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-careBlue my-2">
                      <Image
                        src="/date-calendar.png"
                        width={18}
                        height={18}
                        alt=""
                      />
                    </span>
                    {selectedDate && (
                      <span className="text-careBlue text-sm font-bold whitespace-nowrap">
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
                    <span className="text-careBlue">
                      <Image src="/alarm.png" width={18} height={18} alt="" />
                    </span>
                    {selectedTime && (
                      <span className="text-careBlue text-sm font-bold whitespace-nowrap">
                        {selectedTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        {currentQuestion === 2 || currentQuestion === 5 ? (
          <></>
        ) : (
          <div
            className={
              currentQuestion === 4
                ? "flex flex-col md:flex md:flex-row md:justify-center md:items-center gap-3 mt-20 mb-5 w-full md:ml-[27rem]"
                : "flex flex-col md:flex md:flex-row md:justify-center md:items-center gap-3 mt-20 w-full mb-5"
            }
          >
            <div className="flex flex-col gap-3 md:flex md:flex-row md:gap-5 items-center justify-end">
              <Button
                id={
                  currentQuestion === 4
                    ? `click-step${currentQuestion}-voltar`
                    : `click-step${currentQuestion}-voltar`
                }
                label="Anterior"
                customClass="w-full bg-careBlue border border-careBlue text-white rounded-full md:w-40 h-12 xl:h-9 2xl:h-14"
                onClick={handleReturnStep}
                disabled={currentQuestion === 1}
                leftIcon={HiArrowLongLeft}
              />
              <Button
                rightIcon={HiArrowLongRight}
                id={
                  currentQuestion === 4
                    ? `click-step${currentQuestion}-proximo`
                    : `click-step${currentQuestion}-proximo`
                }
                label={currentQuestion === 4 ? "Finalizar" : "Próximo"}
                customClass="w-full bg-careLightBlue border border-careLightBlue text-white rounded-full md:w-40 h-12 xl:h-9 2xl:h-14"
                onClick={handleNextClick}
                disabled={
                  isLoading ||
                  shouldDisableButton ||
                  (currentQuestion === 1 &&
                    selectedResponseCheckbox !== "Sim") ||
                  (currentQuestion === 3 && (!selectedDate || !selectedTime)) ||
                  (currentQuestion === 4 &&
                    !(
                      miopiaHipermetropia ||
                      miopiaHipermetropiaAstigmatismo ||
                      presbiopia
                    ))
                }
              />
              {currentQuestion === 4 && (
                <div className="text-base text-careBlue ml-10">
                  <div className="flex flex-col font-bold">
                    <div>Em caso de dúvidas no preenchimento,</div>
                    <div onClick={handleButtonClick}>
                      <div className="flex items-center gap-1 cursor-pointer text-careLightBlue hover:text-careBlue">
                        <div>
                          <span>
                            entre em contato clicando no icone ao lado.
                          </span>
                        </div>

                        <div>
                          <HiOutlineArrowSmRight size={25} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalQuestionScheduling;
