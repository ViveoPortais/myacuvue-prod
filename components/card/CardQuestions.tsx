import { responseSurvey } from "@/services/questions";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Button, Checkbox } from "@mui/material";
import MobileStepper from "@mui/material/MobileStepper";
import React, { useEffect } from "react";
import { MdArrowBack } from "react-icons/md";

interface CardQuestionsProps {
  question: string;
  options: any[] | undefined;
  questionNumber: number;
  survey: any[];
  setQuestionNumber: React.Dispatch<React.SetStateAction<number>>;
  customAnswer?: React.ReactNode;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  setSurvey: React.Dispatch<React.SetStateAction<any[]>>;
  totalQuestions?: number;
}

const CardQuestions = ({
  question,
  survey,
  customAnswer,
  questionNumber,
  setQuestionNumber,
  setAnswer,
  setSurvey,
  totalQuestions,
  options,
}: CardQuestionsProps) => {
  const [currentOptions, setCurrentOptions] = React.useState<any>({});
  const [isCkecked, setIsChecked] = React.useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!currentOptions.questionResponse) return;
    setSurvey((prevSurvey) => [
      ...prevSurvey,
      {
        surveyId: "02bc4ffe-7f5a-492e-b894-c6b817afef02",
        questionResponse: currentOptions.questionResponse,
        questionId: currentOptions.questionId,
        order: currentOptions.order,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOptions.questionResponse]);

  const handleSurvey = (e: any) => {
    const { name, value } = e.target;
    const selectedOption = options?.find((option) => option.order === name);

    setCurrentOptions({
      questionResponse: value,
      questionId: selectedOption ? selectedOption.questionId : "",
      order: name,
    });
    setIsChecked((prevIsChecked) =>
      prevIsChecked === name ? undefined : name
    );
  };

  const handleNext = () => {
    if (questionNumber === 0) {
      setAnswer(currentOptions.questionResponse);
    }
    setQuestionNumber((prevQuestionNumber) => prevQuestionNumber + 1);

    if (totalQuestions === questionNumber) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setSurvey((prevSurvey) => prevSurvey.slice(0, -1));
    setQuestionNumber((prevQuestionNumber) => prevQuestionNumber - 1);
  };

  const handleSubmit = () => {
    responseSurvey(survey).then(() => {});
  };

  return (
    <div className="w-full">
      <div className=" border-t-[0.1rem] border-[#051F4A]">
        <span className="text-careLightBlue flex font-bold text-lg ml-7 lg:text-2xl mt-5">
          {question}
        </span>
        <div className="ml-5 mt-3">
          {customAnswer ? (
            customAnswer
          ) : (
            <div>
              {options?.map((option, index) => (
                <>
                  <Checkbox
                    key={index}
                    name={option.order}
                    value={option.questionResponse}
                    sx={{
                      color: "#0A7CC1",
                      "&.Mui-checked": {
                        color: "#051F4A",
                      },
                    }}
                    onChange={handleSurvey}
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={isCkecked === option.order}
                    className="mb-1"
                  />
                  <span className="text-careBlue opacity-70 text-lg uppercase">
                    {option.questionResponse}
                  </span>
                </>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col mt-8 gap-2 xl:gap-4 justify-end items-center lg:mb-1">
        <div className="flex sm:flex-row sm:justify-between sm:items-center space-x-2">
          {questionNumber !== 0 && (
            <>
              <MdArrowBack
                className="block md:hidden bg-careBlue border-careBlue rounded-lg py-2 w-14 h-12 text-white mb-2 sm:mb-0 lg:w-64 lg:h-12"
                size="1.5em"
                onClick={handleBack}
              />
              <Button
                className="hidden md:block bg-careBlue border-careBlue rounded-lg py-2 w-14 h-12 text-white mb-2 sm:mb-0 lg:w-64 lg:h-12"
                size="small"
                onClick={handleBack}
                disabled={questionNumber === 0}
              >
                ANTERIOR
              </Button>
            </>
          )}
          {totalQuestions === questionNumber ? (
            <Button
              className={`bg-${
                isCkecked === undefined ? "careMenuGrey" : "careLightBlue"
              } border-${
                isCkecked === undefined ? "careMenuGrey" : "careLightBlue"
              } rounded-lg py-2 w-56 h-12 text-white lg:w-64 lg:h-12`}
              onClick={handleNext}
              disabled={isCkecked === undefined}
            >
              FINALIZAR
            </Button>
          ) : (
            <Button
              className={`bg-${
                isCkecked === undefined ? "careMenuGrey" : "careLightBlue"
              } border-${
                isCkecked === undefined ? "careMenuGrey" : "careLightBlue"
              } rounded-lg py-2 w-56 h-12 text-white lg:w-64 lg:h-12`}
              onClick={handleNext}
              disabled={isCkecked === undefined}
            >
              PRÓXIMO
            </Button>
          )}
        </div>

        <MobileStepper
          variant="dots"
          steps={totalQuestions ? totalQuestions + 1 : 1}
          position="static"
          activeStep={questionNumber}
          sx={{
            maxWidth: 400,
            flexGrow: 1,
          }}
          backButton={undefined}
          nextButton={undefined}
        />
      </div>
    </div>
  );
};

export default CardQuestions;
