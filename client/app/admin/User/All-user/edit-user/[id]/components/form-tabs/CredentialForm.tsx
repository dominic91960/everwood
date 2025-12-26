"use client";

import React, { useState } from "react";

import { User, UserRole } from "@/lib/types";
import TelSubForm from "./TelSubForm";
import NameSubForm from "./NameSubForm";
import EmailSubForm from "./EmailSubForm";
import UsernameSubForm from "./UsernameSubForm";
import PasswordSubForm from "./PasswordSubForm";

type CredentialFormProps = {
  user: User;
  roles: UserRole[];
  setUser: (user: User) => void;
};

const CredentialForm: React.FC<CredentialFormProps> = ({
  user,
  roles,
  setUser,
}) => {
  const [activeSubForm, setActiveSubForm] = useState("name");

  return (
    <>
      {activeSubForm === "name" && (
        <NameSubForm
          user={user}
          roles={roles}
          setUser={setUser}
          setActiveSubForm={setActiveSubForm}
        />
      )}
      {activeSubForm === "email" && (
        <EmailSubForm
          user={user}
          setUser={setUser}
          handleClose={() => setActiveSubForm("name")}
        />
      )}
      {activeSubForm === "username" && (
        <UsernameSubForm
          user={user}
          setUser={setUser}
          handleClose={() => setActiveSubForm("name")}
        />
      )}
      {activeSubForm === "password" && (
        <PasswordSubForm
          user={user}
          handleClose={() => setActiveSubForm("name")}
        />
      )}
      {activeSubForm === "phone" && (
        <TelSubForm
          user={user}
          setUser={setUser}
          handleClose={() => setActiveSubForm("name")}
        />
      )}
    </>
  );
};

export default CredentialForm;
