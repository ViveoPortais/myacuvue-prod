import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const COOKIE_KEY = "cookie_consent";

export default function useCookieConsent() {
  const [isConsentGiven, setIsConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = Cookies.get(COOKIE_KEY);
    setIsConsentGiven(consent === "true");
  }, []);

  const acceptCookies = () => {
    Cookies.set(COOKIE_KEY, "true", {
      expires: 365,
      path: "/",
    });
    setIsConsentGiven(true);
  };

  const rejectCookies = () => {
    Cookies.remove(COOKIE_KEY, { path: "/" });
    setIsConsentGiven(false);
  };

  return {
    isConsentGiven,
    acceptCookies,
    rejectCookies,
  };
}
