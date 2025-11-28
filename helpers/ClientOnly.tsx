"use client";

interface ClientOnlyProps {
  children: React.ReactNode;
}

import useLogin from "@/hooks/useLogin";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Hotjar from "@hotjar/browser";

const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false);
  const loginData = useLogin();
  const router = useRouter();

  useEffect(() => {
    const siteId = 4983868;
    const hotjarVersion = 6;

    Hotjar.init(siteId, hotjarVersion);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!loginData.isLogged) {
        localStorage.clear();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5" && !loginData.isLogged) {
        localStorage.clear();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    setHasMounted(true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router.pathname]);

  if (!hasMounted) return null;

  return (
    <div>
      <Head>
        <title>MyAcuvue</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){
            w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TWS293JF');`,
        }}
      />

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-TWS293JF"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>

      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
      !function(f,b,e,v,n,t,s)

{if(f.fbq)return;n=f.fbq=function(){n.callMethod?

n.callMethod.apply(n,arguments):n.queue.push(arguments)};

if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';

n.queue=[];t=b.createElement(e);t.async=!0;

t.src=v;s=b.getElementsByTagName(e)[0];

s.parentNode.insertBefore(t,s)}(window, document,'script',

'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '1052529036800137');

fbq('track', 'PageView');
    `,
        }}
      />

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1052529036800137&ev=PageView&noscript=1"
        />
      </noscript>

      {children}
    </div>
  );
};

export default ClientOnly;
