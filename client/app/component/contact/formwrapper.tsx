"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Form from "./form";

const FormWrapper = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
      }}
    >
      <Form />
    </GoogleReCaptchaProvider>
  );
};

export default FormWrapper;
