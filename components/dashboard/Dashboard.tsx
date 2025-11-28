import MenuOptions from "@/components/Menu/MenuOptions";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  IoArrowBackCircleOutline,
  IoExitOutline,
  IoPersonOutline,
} from "react-icons/io5";
import React, { useEffect, useState } from "react";
import useOnboardModal from "@/hooks/useOnboardModal";
import useLogin from "@/hooks/useLogin";
import { MdClose } from "react-icons/md";
import dayjs from "dayjs";
import { homeMenuPacient } from "@/constants/homeMenuPacient";
import { homeMenuAdmin } from "@/constants/homeMenuAdmin";
import { useRouter } from "next/router";
import useDataStorage from "@/hooks/useDataStorage";
import HuggyChat from "../specialist/HuggyChat";
import { homeMenuPdv } from "@/constants/homeMenuPdv";
import { homeMenuEcp } from "@/constants/homeMenuEcp";
import useOnboardModalPartiner from "@/hooks/useOnboardModalPartiner";
import { ToastContainer } from "react-toastify";

interface DashboardProps {
  children?: React.ReactNode;
}
const Dashboard = ({ children }: DashboardProps) => {
  const onBoardModal = useOnboardModal();
  const onboardModalPartiner = useOnboardModalPartiner();
  const auth = useLogin();
  const router = useRouter();
  const dataStorage = useDataStorage();

  const [sideBarOpen, setSidebarOpen] = useState(true);
  const [textHidden, setTextHidden] = useState(false);
  const [menuLeftMobile, setMenuLeftMobile] = useState(false);
  const [menuRightMobile, setMenuRightMobile] = useState(false);
  const [showMyData, setShowMyData] = useState(false);
  const [dashboardText, setDashboardText] = useState("");
  const [navbarSpanText, setNavbarSpanText] = useState("");
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isEcpUser, setIsEcpUser] = useState(false);
  const [isPdvUser, setIsPdvUser] = useState(false);
  const [isPatientUser, setIsPatientUser] = useState(false);

  useEffect(() => {
    if (!auth.isLogged) {
      router.push("/login");
    }

    setNavbarSpanText("Início");

    const userRoleEcp = auth.role === "Partner ECP VisionCare";
    if (userRoleEcp) {
      if (auth.firstLogin === true) {
        onboardModalPartiner.onOpen();
      }
      return setIsEcpUser(true);
    }

    const userRolePdv = auth.role === "Partner POS VisionCare";
    if (userRolePdv) {
      if (auth.firstLogin === true) {
        onboardModalPartiner.onOpen();
      }
      return setIsPdvUser(true);
    }

    const userRoleAdmin = auth.role === "Admin JeJ - VisionCare";
    if (userRoleAdmin) {
      return setIsAdminUser(true);
    }

    const userPatient = auth.role === "Patient VisionCare";
    if (userPatient) {
      if (auth.firstLogin === true) {
        onBoardModal.onOpen();
      }
      return setIsPatientUser(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuOptions = homeMenuPacient.map((option) => {
    return {
      ...option,
      active: router.pathname.includes(option.route),
    };
  });

  const adminOptions = homeMenuAdmin.map((option) => {
    return {
      ...option,
      active: router.pathname.includes(option.route),
    };
  });

  const EcpOptions = homeMenuEcp.map((option) => {
    return {
      ...option,
      active: router.pathname.includes(option.route),
    };
  });

  const PdvOptions = homeMenuPdv.map((option) => {
    return {
      ...option,
      active: router.pathname.includes(option.route),
    };
  });

  const closeMenuLeftMobile = () => {
    setMenuLeftMobile(false);
  };

  const handleNameChange = (text: string) => {
    setNavbarSpanText(text);
  };

  const handleLogout = () => {
    auth.onLogout();
    router.push("/login");
  };

  if (!auth.isLogged) return null;
  return (
    <div className="flex w-full h-screen fade-in lg:overflow-hidden">
      <div className="fade-in">
        <HuggyChat />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <div
        className={`w-1/3 hidden md:flex border-r-2 border-gray-400 h-screen flex-col overflow-auto`}
      >
        <div className="mt-14 flex justify-start">
          <div
            className={`flex gap-2 h-16 xl:px-7 2xl:px-12   md:mb-6 2xl:mb-5`}
          >
            <Image
              src="/acuvue.png"
              width={60}
              height={60}
              className={`object-contain xl:ml-8 2xl:ml-0 `}
              alt="acuvue"
            />
            <Image
              src="/my-acuvue-dashboard.png"
              width={160}
              height={500}
              className={`object-contain ${
                sideBarOpen ? "block left-10" : "hidden"
              } md:w-[120px] xl:w-[120px] 2xl:w-[160px] `}
              alt="acuvue"
            />
          </div>
        </div>
        <div className="flex flex-col mt-5 ">
          <div className="md:px-3 lg:px-3 xl:px-7 2xl:px-12">
            {(() => {
              if (isAdminUser) {
                return adminOptions.map((option, i) => (
                  <MenuOptions
                    spanClassname={`${
                      option.active
                        ? "bg-careLightBlue w-full text-white"
                        : "text-careMenuGrey"
                    } p-5 rounded-lg last:mb-6 ${
                      !sideBarOpen ? "flex items-center justify-center" : ""
                    } `}
                    iconClassname={`${!option.active && "text-careBlue"}`}
                    key={i}
                    text={textHidden ? "" : option.text}
                    id={option.route}
                    route={option.route || ""}
                    image
                    path={option.path}
                    onNameChange={handleNameChange}
                  />
                ));
              } else if (isEcpUser) {
                return EcpOptions.map((option, i) => (
                  <MenuOptions
                    id={option.route}
                    spanClassname={`${
                      option.active
                        ? "bg-careLightBlue w-full text-white"
                        : "text-careMenuGrey"
                    } p-5 rounded-lg last:mb-6 ${
                      !sideBarOpen ? "flex items-center justify-center" : ""
                    } `}
                    iconClassname={`${!option.active && "text-careBlue"}`}
                    key={i}
                    text={textHidden ? "" : option.text}
                    route={option.route || ""}
                    image
                    path={option.path}
                    onNameChange={handleNameChange}
                  />
                ));
              } else if (isPdvUser) {
                return PdvOptions.map((option, i) => (
                  <MenuOptions
                    id={option.route}
                    spanClassname={`${
                      option.active
                        ? "bg-careLightBlue w-full text-white"
                        : "text-careMenuGrey"
                    } p-5 rounded-lg last:mb-6 ${
                      !sideBarOpen ? "flex items-center justify-center" : ""
                    } `}
                    iconClassname={`${!option.active && "text-careBlue"}`}
                    key={i}
                    text={textHidden ? "" : option.text}
                    route={option.route || ""}
                    image
                    path={option.path}
                    onNameChange={handleNameChange}
                  />
                ));
              } else {
                return menuOptions.map((option, i) => (
                  <MenuOptions
                    id={
                      option.route ===
                      "https://www.acuvue.com.br/guia-de-compra/onde-comprar-lentes-de-contato"
                        ? "Onde-encontrar"
                        : option.route === "https://youtube.com/@ACUVUEBrasil"
                        ? "Sobre"
                        : option.route === "home"
                        ? "Inicio"
                        : option.route === "patient-voucher"
                        ? "Meus-Vouchers"
                        : option.route === "scheduling"
                        ? "Agendamento"
                        : option.route === "talk-to-specialist"
                        ? "Fale-especialista"
                        : option.route === "user-guide"
                        ? "Guia-usuario"
                        : option.route
                    }
                    spanClassname={`${
                      option.active
                        ? "bg-careLightBlue w-full text-white"
                        : "text-careMenuGrey"
                    } p-5 rounded-lg last:mb-6 ${
                      !sideBarOpen ? "flex items-center justify-center" : ""
                    } `}
                    iconClassname={`${!option.active && "text-careBlue"}`}
                    key={i}
                    text={textHidden ? "" : option.text}
                    route={option.route || ""}
                    image
                    path={option.path}
                    onNameChange={handleNameChange}
                  />
                ));
              }
            })()}
          </div>
          <div className="border-b-2 border-gray-400"></div>

          <div className="hidden md:flex ml-5 gap-5 mt-10 md:mt-10 xl:mt-8 mb-0 md:mb-0 xl:mb-12 cursor-pointer md:px-3 lg:px-3 xl:px-7 2xl:px-11">
            <a
              id="instagram-link"
              href="https://www.instagram.com/acuvuebrasil/?igshid=MzRlODBiNWFlZA%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/icon-instagram.png" width={20} height={20} alt="" />
            </a>
            <a
              id="facebook-link"
              href="https://www.facebook.com/acuvuebrasil?mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/icon-facebook.png" width={15} height={20} alt="" />
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-end h-full hover:opacity-70 mb-10 md:ml-8 xl:ml-12 2xl:ml-16">
          <div className="flex items-center gap-2">
            <div>
              <IoExitOutline size={24} className="text-careLightBlue" />
            </div>
            <div id="sair-da-conta" onClick={handleLogout}>
              <span className="text-careMenuGrey text-sm lg:text-lg 2xl:mb-10 cursor-pointer ">
                Sair
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-r-2 border-gray-400 h-full  overflow-x-hidden">
        <div className="h-28 top-0 w-full bg-careLightBlue flex justify-between md:hidden">
          <div className="mx-7 mt-10">
            <Image
              src="/LogoMyAcuvue.png"
              width={260}
              height={500}
              alt="acuvue"
            />
          </div>
          <div className="mx-10 mt-12">
            {!menuLeftMobile ? (
              <GiHamburgerMenu
                size="1.7em"
                onClick={() => {
                  setMenuLeftMobile(!menuLeftMobile);
                }}
                className="text-white"
              />
            ) : (
              <MdClose
                size="1.7em"
                onClick={() => {
                  setMenuLeftMobile(!menuLeftMobile);
                }}
                className="text-white"
              />
            )}
          </div>
        </div>
        <div className={` mt-5 ${menuLeftMobile ? "hidden" : ""}`}>
          <div className="border-b-2 border-gray-400 py-3 px-6">
            <div className="flex justify-between items-center mt-5">
              <span className="text-careLightBlue text-3xl">
                Olá, {isEcpUser && auth.userName}
                {isPdvUser && auth.userName}
                {isPatientUser && auth.userName}
                {isAdminUser && auth.userName}
              </span>
            </div>
            <div className="text-careMenuGrey ml-1 my-1">
              <span className="text-sm">
                {dashboardText ? dashboardText : navbarSpanText}
              </span>
            </div>
          </div>

          {!menuRightMobile && !showMyData && (
            <div className="px-4 mt-5 md:mt-5 2xl:mt-5 grid gap-y-3">
              {children}
            </div>
          )}
        </div>
        {menuLeftMobile && (
          <div className="flex md:hidden bg-white h-full gap-3 fade-in ">
            <div className="flex flex-col gap-3 ml-14 mt-10 w-72">
              {(() => {
                if (isAdminUser) {
                  return adminOptions.map((option, i) => (
                    <MenuOptions
                      spanClassname={`${
                        option.active
                          ? "bg-careLightBlue w-full text-white"
                          : "bg-white w-full text-careMenuGrey"
                      } p-5 rounded-lg last:mb-6 ${
                        !sideBarOpen ? "flex items-center justify-center" : ""
                      } `}
                      iconClassname={`${!option.active && "text-careBlue"}`}
                      key={i}
                      text={textHidden ? "" : option.text}
                      route={option.route || ""}
                      image
                      id={option.route}
                      path={option.path}
                      onNameChange={handleNameChange}
                      closeMenu={closeMenuLeftMobile}
                    />
                  ));
                } else if (isEcpUser) {
                  return EcpOptions.map((option, i) => (
                    <MenuOptions
                      id={option.route}
                      spanClassname={`${
                        option.active
                          ? "bg-careLightBlue w-full text-white"
                          : "bg-white w-full text-careMenuGrey"
                      } p-5 rounded-lg last:mb-6 ${
                        !sideBarOpen ? "flex items-center justify-center" : ""
                      } `}
                      iconClassname={`${!option.active && "text-careBlue"}`}
                      key={i}
                      text={textHidden ? "" : option.text}
                      route={option.route || ""}
                      image
                      path={option.path}
                      onNameChange={handleNameChange}
                      closeMenu={closeMenuLeftMobile}
                    />
                  ));
                } else if (isPdvUser) {
                  return PdvOptions.map((option, i) => (
                    <MenuOptions
                      id={option.route}
                      spanClassname={`${
                        option.active
                          ? "bg-careLightBlue w-full text-white"
                          : "bg-white w-full text-careMenuGrey"
                      } p-5 rounded-lg last:mb-6 ${
                        !sideBarOpen ? "flex items-center justify-center" : ""
                      } `}
                      iconClassname={`${!option.active && "text-careBlue"}`}
                      key={i}
                      text={textHidden ? "" : option.text}
                      route={option.route || ""}
                      image
                      path={option.path}
                      onNameChange={handleNameChange}
                      closeMenu={closeMenuLeftMobile}
                    />
                  ));
                } else if (isPatientUser) {
                  return menuOptions.map((option, i) => (
                    <MenuOptions
                      id={option.route}
                      spanClassname={`${
                        option.active
                          ? "bg-careLightBlue w-full text-white"
                          : "bg-white w-full text-careMenuGrey"
                      } p-5 rounded-lg last:mb-6 ${
                        !sideBarOpen ? "flex items-center justify-center" : ""
                      } `}
                      iconClassname={`${!option.active && "text-careBlue"}`}
                      key={i}
                      text={textHidden ? "" : option.text}
                      route={option.route || ""}
                      image
                      path={option.path}
                      onNameChange={handleNameChange}
                      closeMenu={closeMenuLeftMobile}
                    />
                  ));
                }
              })()}
              <hr />
              <div className="flex md:hidden gap-5 items-center mt-3">
                <a
                  id="instagram-link"
                  href="https://www.instagram.com/acuvuebrasil/?igshid=MzRlODBiNWFlZA%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/icon-instagram.png"
                    width={20}
                    height={20}
                    alt=""
                  />
                </a>
                <a
                  id="facebook-link"
                  href="https://www.facebook.com/acuvuebrasil?mibextid=ZbWKwL"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/icon-facebook.png"
                    width={15}
                    height={20}
                    alt=""
                  />
                </a>
              </div>
              <div className="flex items-center gap-2 mt-14 ">
                <div>
                  <IoExitOutline size={27} className="text-careLightBlue" />
                </div>
                <div onClick={handleLogout}>
                  <span
                    id="sair-da-conta"
                    className="text-careMenuGrey text-sm lg:text-lg 2xl:mb-10 cursor-pointer "
                  >
                    Sair
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
