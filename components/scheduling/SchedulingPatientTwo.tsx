import React, { useEffect, useState } from "react";
import ContentCard from "../card/ContentCard";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  styled,
} from "@mui/material";
import { RiNumber1, RiNumber2, RiNumber3, RiNumber4 } from "react-icons/ri";
import ModalQuestionScheduling from "../modals/ModalQuestionScheduling";
import { patientHasScheduling } from "@/services/diagnostic";
import { IoCalendar } from "react-icons/io5";
import Button from "../button/Button";
import ContentCardNew from "../card/ContentCardNew";

const SchedulingPatientTwo = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [data, setData] = useState<any>(null);
  const [reschedule, setReschedule] = useState<any>(false);

  useEffect(() => {
    patientHasScheduling()
      .then((res) => {
        if (!res.isValidData) {
          setReschedule(false);
        } else {
          setReschedule(true);
        }

        if (res) {
          setData(res);
        } else {
        }
      })
      .catch((error) => console.error("Erro ao buscar os dados:", error));
  }, []);

  const handleSheduling = () => {
    setReschedule(false);
    setCurrentQuestion(2);
  };

  const steps = [
    "Consulta com especialista",
    "Local da visita",
    "Data e horário",
    "Receita oftalmológica",
  ];

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 17,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 95deg,rgb(0, 124, 196) 0%,rgb(0, 124, 196) 50%,rgb(0, 124, 196) 100%)",
        opacity: 1,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 95deg,rgb(0, 124, 196) 0%,rgb(0, 124, 196) 50%,rgb(0, 124, 196) 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: "#eaeaf0",
      borderRadius: 1,
      opacity: 0.5,
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[800],
      }),
    },
  }));

  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme }) => ({
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 33,
    height: 33,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[700],
    }),
    variants: [
      {
        props: ({ ownerState }: { ownerState: { active?: boolean } }) =>
          ownerState.active,
        style: {
          backgroundImage:
            "linear-gradient( 136deg, rgb(0, 124, 196) 0%, rgb(0, 124, 196) 50%, rgb(0, 124, 196) 100%)",
          boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
        },
      },
      {
        props: ({ ownerState }: { ownerState: { completed?: boolean } }) =>
          ownerState.completed,
        style: {
          backgroundImage:
            "linear-gradient( 136deg, rgb(0, 124, 196) 0%, rgb(0, 124, 196) 50%, rgb(0, 124, 196) 100%)",
        },
      },
    ],
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement<unknown> } = {
      1: <RiNumber1 />,
      2: <RiNumber2 />,
      3: <RiNumber3 />,
      4: <RiNumber4 />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  useEffect(() => {
    const newPath = `/dashboard/scheduling/step${currentQuestion + 1}`;
    window.history.pushState(null, "", newPath);
  }, [currentQuestion]);

  return (
    <div className="w-full fade-in">
      <div className="grid-cols-1 mb-3">
        <ContentCardNew
          title="Agende sua adaptação de lentes de contato"
          subtitle="Encontre a clínica oftalmológica mais próxima para um especialista atender você"
          titleTwo="Lembre-se de que é imprescindível uma receita oftalmológica válida,"
          subtitleTwo="emitida nos ultimos 12 meses. Tenha ela em mãos para preencher o passo 4."
          bgColor="bg-[url('/svg/bannerdestaque1.svg')] bg-cover bg-no-repeat bg-careDarkBlue bg-right"
        />
      </div>
      <div className="flex flex-col justify-center items-center mt-5 mb-5 w-full border-2 border-[#EAF4F9] rounded-lg p-5 ">
        {reschedule ? (
          <>
            <div>
              <div className="flex items-center mb-5 mt-5">
                <IoCalendar size={35} className="text-careLightBlue" />
                <span className="text-lg font-bold text-careLightBlue ms-4">
                  Você já possui um Agendamento ativo
                </span>
              </div>

              <div className="flex flex-col items-start justify-center mb-10">
                <span className="text-careDarkBlue">
                  Sua adaptação está agendada para{" "}
                  {new Date(data?.value?.scheduledDateStart).toLocaleDateString(
                    "pt-BR"
                  )}{" "}
                  às{" "}
                  {new Date(data?.value?.scheduledDateStart).toLocaleTimeString(
                    "pt-BR"
                  )}{" "}
                  em {data?.value?.clinicName}
                </span>
                <span className="text-careDarkBlue">
                  {`${data?.value?.addressName}, ${data?.value?.addressNumber} - ${data?.value?.addressDistrict}, ${data?.value?.addressCity} - ${data?.value?.addressState}, ${data?.value?.addressPostalCode}`}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-careBlue font-semibold mb-5">
                  Deseja reagendar a sua consulta?
                </span>
                <Button
                  id="click_agendamento_pac_reagendar"
                  onClick={handleSheduling}
                  customClass="w-full md:w-48 bg-careLightBlue border-careLightBlue py-2 mb-2"
                  label="Sim, Reagendar"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <Stepper
              className="w-full md:w-[60%]"
              alternativeLabel
              activeStep={currentQuestion - 1}
              connector={<ColorlibConnector />}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={ColorlibStepIcon}
                    sx={{
                      fontWeight: "bold",
                      color:
                        index + 1 === currentQuestion
                          ? "rgb(0, 124, 196)"
                          : "#9e9e9e",
                      opacity: index + 1 === currentQuestion ? 1 : 0.5,
                    }}
                  >
                    <span
                      className={`${
                        index + 1 === currentQuestion
                          ? "text-careLightBlue"
                          : "text-gray-400"
                      } text-[12px] font-bold`}
                    >
                      {label}
                    </span>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <ModalQuestionScheduling
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SchedulingPatientTwo;
