import React from "react";

import AuthRouteGuard from "@/components/AuthRouteGuard";
import SignInForm from "@/components/user/sign-in-page/SignInForm";

const SignInPage = () => {
  return (
    <AuthRouteGuard>
      <SignInForm />
    </AuthRouteGuard>
  );
};

export default SignInPage;
