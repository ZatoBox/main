import React from "react";
import RegisterContainer from "@/components/auth/register/RegisterContainer";
import RegisterForm from "@/components/auth/register/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-main">
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:min-h-screen lg:p-6">
        <div
          className="w-full max-w-md p-6 rounded-lg shadow-sm bg-bg-surface"
          style={{ border: "1px solid #e0e0e0" }}
        >
          <RegisterContainer
            title="Create Account"
            description="Sign up to start managing your inventory"
            logoSrc="/images/logozato.png"
            logoAlt="ZatoBox Logo"
          >
            <RegisterForm />
          </RegisterContainer>
        </div>
      </div>

      <div className="min-h-screen p-4 lg:hidden">
        <div className="flex items-center justify-between p-4 mb-8">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logozato.png"
              alt="ZatoBox Logo"
              className="object-contain w-10"
            />
            <span className="text-xl font-bold text-text-primary">ZatoBox</span>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="w-full max-w-sm space-y-6">
            <RegisterContainer
              title="Create Account"
              description="Sign up to start managing your inventory"
            >
              <RegisterForm />
            </RegisterContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
