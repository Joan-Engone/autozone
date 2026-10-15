import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Connexion | Auto Zone Import & Export",
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <LoginForm />
      <Footer />
    </>
  );
}