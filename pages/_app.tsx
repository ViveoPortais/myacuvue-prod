import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import ClientOnly from "@/helpers/ClientOnly";
import OnboardModal from "@/components/modals/OnboardModal";
import useLogin from "@/hooks/useLogin";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard/Dashboard";
import OnboardModalPartiner from "@/components/modals/OnboardModalPartiner";
import useOnboardModalPartiner from "@/hooks/useOnboardModalPartiner";
import { ToastContainer, toast } from "react-toastify";
import api from "@/services/api";

export default function App({ Component, pageProps }: AppProps) {
  const onboardModalPartiner = useOnboardModalPartiner();
  const loginData = useLogin();
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const avaiableRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/confirmation",
    "/new-password",
    "/",
  ];

  useEffect(() => {
    const handleMouseMove = () => {
      setLastActivity(Date.now());
    };

    window.addEventListener("mousemove", handleMouseMove);

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > 1800000 && loginData.isLogged) {
        // toast.error("Sessão expirada, faça login novamente");
        console.log("Sessão expirada, faça login novamente");
        loginData.onLogout();
        router.push("/login");
      }
    }, 1800000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [lastActivity, loginData, router]);

  useEffect(() => {
    if (loginData.token !== "" && !api.defaults.headers.Authorization) {
      api.defaults.headers.Authorization = `Bearer ${loginData.token}`;
    }

    if (router.pathname === "/_error") {
      router.push("/login");
    }
    if (!loginData.isLogged && !avaiableRoutes.includes(router.pathname)) {
      router.push("/");
    }
    if (
      loginData.isLogged &&
      avaiableRoutes.includes(router.pathname) &&
      router.pathname !== "/new-password"
    ) {
      router.push("/dashboard/home");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avaiableRoutes, loginData.isLogged, loginData.token, router]);

  return (
    <ClientOnly>
      <OnboardModal />
      <OnboardModalPartiner />
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />

      {!loginData.isLogged ? (
        <Component {...pageProps} />
      ) : (
        <>
          {router.pathname === "/new-password" &&
          !onboardModalPartiner.isOpen ? (
            <Component {...pageProps} />
          ) : (
            <>
              <Dashboard>
                <Component {...pageProps} />
              </Dashboard>
            </>
          )}
        </>
      )}
    </ClientOnly>
  );
}
