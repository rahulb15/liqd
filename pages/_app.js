//css
import "../styles/global/boot.css";

import "../styles/global/per-info.css";
import "../styles/global/fold-style.css";
import "../styles/global/globals.css";
import "../styles/global/login.css";
import "../styles/global/main.css";

import { UserProvider } from "../contexts/UserContext";
import { ToastProvider } from "react-toast-notifications";

import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ToastProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ToastProvider>
      <Script
        src="/assets/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
      />
    </>
  );
}

export default MyApp;