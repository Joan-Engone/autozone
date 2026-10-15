import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Inscription | Auto Zone Import & Export",
};

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <RegisterForm />
      <Footer />
    </>
  );
}