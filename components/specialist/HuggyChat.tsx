import useLogin from "@/hooks/useLogin";
import { set } from "date-fns";
import { hi } from "date-fns/locale";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    Huggy: any;
  }
}

export const isWithinWorkingHours = () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 8 && hours < 20;
};

export const showChats = () => {
  if (isWithinWorkingHours()) {
    if (window.Huggy) {
      window.Huggy.openBox();
    }
  } else {
    alert(
      "Nosso atendimento via chat está disponível das 08h às 20h."
    );
  }
};

const HuggyChat = () => {
  const login = useLogin();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const loginInfo = {
      role: login.role,
    };

    setUserRole(login.role);

    const huggyChatInit = {
      contextID: "15f91584cbf3e1d1357ce07db31cc7bf",
      defaultCountry: "+55",
      uuid: "ad453d34-ab0e-4278-9a7e-db25dba475f2",
      company: "7617",
      userIdentifier: login.email,
      userHash: "ca6c1180981fddbe82c978f7f93728bb",
    };

    if (userRole === "Patient VisionCare") {
      if (window.Huggy) {
        window.Huggy.init(huggyChatInit);
      } else {
        const script = document.createElement("script");
        script.src = "../huggyLibrary/widget.min.js";
        script.async = true;
        script.onload = () => {
          window.Huggy.init(huggyChatInit);
        };
        document.body.appendChild(script);
      }
    }
    return () => {
      if (window.Huggy && window.Huggy.destroy) {
        window.Huggy.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, login.email]);

  return <div></div>;
};

export default HuggyChat;
