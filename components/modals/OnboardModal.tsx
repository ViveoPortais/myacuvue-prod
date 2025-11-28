import {
  firstQuestionData,
  noQuestionData,
  yesQuestionData,
} from "@/helpers/QuestionData"
import useLogin from "@/hooks/useLogin"
import useOnboardModal from "@/hooks/useOnboardModal"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Button from "../button/Button"
import CardQuestions from "../card/CardQuestions"
import Modal from "./Modal"

const OnboardModal = () => {
  const onboardModal = useOnboardModal()
  const [isNext, setIsNext] = useState(false)
  const auth = useLogin()
  const [questionNumber, setQuestionNumber] = useState(0)
  const [answer, setAnswer] = useState("")
  const [finalMessage, setFinalMessage] = useState(false)
  const router = useRouter()

  const [survey, setSurvey] = useState<any[]>([])

  useEffect(() => {}, [questionNumber])

  const handleFinalMessage = () => {
    setFinalMessage(true)
  }

  const handleFirstLogin = () => {
    useLogin.getState().setFirstLogin(false);
  };
 

  if (!auth.isLogged) return null
  return (
    <div>
      <Modal
        isOpen={onboardModal.isOpen}
        onClose={onboardModal.onClose}
        isButtonDisabled
        customClass="w-[65rem]"
        isCloseIconVisible={false}
      >
        {finalMessage && (
          <>
            <div
              className={
                "my-5 z-40 flex flex-col pb-2 border-b-[0.1rem] border-[#051F4A] lg:pb-5"
              }
            >
              <div className="flex flex-col justify-center items-center text-careLightBlue text-3xl mb-2 lg:text-5xl ">
                <span>Não sabe por onde começar ou tem alguma dúvida?</span>
              </div>
            </div>
          </>
        )}

        {questionNumber === 4 && !finalMessage && (
          <>
            <div className="w-full flex flex-col mt-8 gap-2 xl:gap-4 justify-end items-center mb-5 lg:mb-1">
              <div>
                <Image
                  src="/ModalPatient.png"
                  alt="Logo"
                  width={800}
                  height={450}
                />
              </div>
              <div className="md:mt-20 lg:mt-20 mt-10">
                <Button
                  customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-5 w-80"
                  label="AVANÇAR"
                  onClick={handleFinalMessage}
                />
              </div>
            </div>
          </>
        )}

        {questionNumber === 3 && answer === "Não" && !finalMessage && (
          <>
            <div className="w-full flex flex-col mt-8 gap-2 xl:gap-4 justify-end items-center mb-5 lg:mb-1">
              <div>
                <Image
                  src="/ModalPatient.png"
                  alt="Logo"
                  width={800}
                  height={450}
                />
              </div>
              <div className="md:mt-20 lg:mt-20 mt-10">
                <Button
                  customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-5 w-80"
                  label="AVANÇAR"
                  onClick={handleFinalMessage}
                />
              </div>
            </div>
          </>
        )}

        <div className={`my-5 z-40 flex flex-col pb-2 lg:pb-5`}>
          {!isNext && (
            <>
              <div className="flex flex-col justify-start text-careLightBlue text-3xl mb-2 lg:text-4xl lg:ml-4">
                <span>
                  Que legal ver você por aqui,{" "}
                  {auth?.userDataPatient[0]?.namePatient}
                </span>
              </div>
              <div className="flex flex-col justify-start text-careLightBlue text-3xl lg:text-4xl lg:ml-4 ">
                <span>Vamos começar ?</span>
              </div>
            </>
          )}

          {isNext &&
            questionNumber < 4 &&
            !(questionNumber === 3 && answer === "Não") && (
              <div className="flex flex-col justify-start font-bold text-careBlue text-2xl  ml-4 lg:text-3xl lg:ml-6">
                <span>MyACUVUE® quer saber:</span>
              </div>
            )}
        </div>

        {!isNext ? (
          <div className="ml-4 flex flex-col gap-4 border-t-[0.1rem] border-[#051F4A] ">
            <div className="text-careBlue  text-base md:text-xl lg:text-xl mt-5">
              <span>
                Queremos que você tenha uma experiência única e personalizada
                com nossas lentes de contato, então gostaríamos de te conhecer
                melhor.
              </span>
            </div>
            <div className="text-careDarkBlue text-base font-bold md:text-xl lg:text-xl">
              <span>
                ​Preencha as informações a seguir e resgate seu voucher para
                começar!
              </span>
            </div>
          </div>
        ) : null}

        {finalMessage && (
          <>
            <div className="ml-4 flex flex-col justify-center items-center">
              <div className="text-careBlue  text-base md:text-2xl lg:text-2xl md:text-center">
                <span>Fale com um especialista pelo chat ou agende um</span>
              </div>
              <div className="text-careBlue text-base md:text-2xl lg:text-2xl md:text-center">
                <span>
                  atendimento na data e no horário de sua preferência!
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex md:flex-row justify-center items-center lg:flex lg:flex-row gap-5 lg:mt-20 md:mt-20 mt-10 ">
              <div className="mb-3">
                <Button
                  customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-5 w-72"
                  label="AGENDAR ATENDIMENTO"
                  onClick={() => {
                    onboardModal.onClose()
                    handleFirstLogin();
                    router.push("/dashboard/scheduling")
                  }}
                />
              </div>
              <div className="mb-3">
                <Button
                  customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-5 w-72"
                  label="FALAR PELO CHAT"
                  onClick={() => {
                    onboardModal.onClose()
                    handleFirstLogin();
                    router.push("/dashboard/talk-to-specialist")
                  }}
                />
              </div>
              <div className="mb-3">
                <Button
                  customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-5 w-72"
                  label="ACESSAR"
                  onClick={() => {
                    onboardModal.onClose()
                    handleFirstLogin();
                  }}
                />
              </div>
            </div>
          </>
        )}

        <div className="my-5 z-40 flex flex-col ">
          {isNext && (
            <>
              {questionNumber === 0 && (
                <>
                  {firstQuestionData.map((question, index) => (
                    <div key={question.questionNumber}>
                      <CardQuestions
                        survey={survey}
                        options={question.questionOptions}
                        setSurvey={setSurvey}
                        question={question.questionDescription}
                        questionNumber={questionNumber}
                        setQuestionNumber={setQuestionNumber}
                        setAnswer={setAnswer}
                      />
                    </div>
                  ))}
                </>
              )}
              {answer === "Sim" && questionNumber > 0 && (
                <>
                  {yesQuestionData.map((question, index) => (
                    <div key={question.questionNumber}>
                      {question.questionNumber === questionNumber && (
                        <CardQuestions
                          survey={survey}
                          totalQuestions={3}
                          options={question.questionOptions}
                          setSurvey={setSurvey}
                          question={question.questionDescription}
                          questionNumber={questionNumber}
                          setQuestionNumber={setQuestionNumber}
                          setAnswer={setAnswer}
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
              {answer === "Não" && questionNumber > 0 && (
                <>
                  {noQuestionData.map((question, index) => (
                    <div key={question.questionNumber}>
                      {question.questionNumber === questionNumber && (
                        <CardQuestions
                          survey={survey}
                          totalQuestions={2}
                          options={question.questionOptions}
                          setSurvey={setSurvey}
                          question={question.questionDescription}
                          questionNumber={questionNumber}
                          setQuestionNumber={setQuestionNumber}
                          setAnswer={setAnswer}
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
        <div className="w-full flex flex-col mt-8 gap-2 xl:gap-4 justify-end items-center mb-5 lg:mb-1">
          {!isNext && (
            <Button
              customClass="bg-careBlue border-careBlue py-2 xl:py-5 w-80"
              label="AVANÇAR"
              onClick={() => setIsNext(true)}
            />
          )}
        </div>
      </Modal>
    </div>
  )
}

export default OnboardModal
