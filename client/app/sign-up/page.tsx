import React from "react";

import AuthRouteGuard from "@/components/AuthRouteGuard";
import SignUpForm from "@/components/user/sign-up-page/SignUpForm";

const SignUpPage = () => {
  return (
    <AuthRouteGuard>
      <SignUpForm />
    </AuthRouteGuard>
  );
};

export default SignUpPage;
