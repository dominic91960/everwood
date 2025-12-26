"use client";

import React, { useState } from "react";

import TelSubForm from "./TelSubForm";
import NameSubForm from "./NameSubForm";
import EmailSubForm from "./EmailSubForm";
import UsernameSubForm from "./UsernameSubForm";
import PasswordSubForm from "./PasswordSubForm";
// import AuthSubForm from "./AuthSubForm";

const CredentialForm = () => {
  const [activeSubForm, setActiveSubForm] = useState("name");

  return (
    <>
      {activeSubForm === "name" && (
        <NameSubForm setActiveSubForm={setActiveSubForm} />
      )}
      {activeSubForm === "email" && (
        <EmailSubForm handleClose={() => setActiveSubForm("name")} />
      )}
      {activeSubForm === "username" && (
        <UsernameSubForm handleClose={() => setActiveSubForm("name")} />
      )}
      {activeSubForm === "password" && (
        <PasswordSubForm handleClose={() => setActiveSubForm("name")} />
      )}
      {activeSubForm === "phone" && (
        <TelSubForm handleClose={() => setActiveSubForm("name")} />
      )}
      {/* {activeSubForm === "auth" && (
        <AuthSubForm handleClose={() => setActiveSubForm("name")} />
      )} */}
    </>
  );
};

export default CredentialForm;
