import { Metadata } from "next";
import Header from "../component/contact/header";
import { Navbar2 } from "../component/Navbar/Navbar2";
import CtLogo from "../component/contact/ctlogo";
import Seamless from "../component/contact/seamless";
import Form from "../component/contact/form";
import Create from "../component/contact/create";
import Footer2 from "../component/Footer/Footer2";

export const metadata: Metadata = {
  title: "Contact Everwood Collection | Custom Furniture Sri Lanka",
  description:
    "Contact Everwood Collection to inquire about premium handcrafted furniture, custom designs, or showroom visits in Sri Lanka.",
  keywords:
    "contact Everwood Collection, furniture store Sri Lanka, custom furniture inquiries, Everwood Collection contact, furniture showroom Sri Lanka",
  openGraph: {
    title: "Contact Everwood Collection | Premium Furniture in Sri Lanka",
    description:
      "Get in touch to discuss your custom furniture needs or visit our showroom in Sri Lanka.",
    url: "https://everwoodcollection.com/contact",
    images: ["/images/og-image-contact.jpg"],
    type: "website",
  },
};

function page() {
  return (
    <div className="font-poppins">
      <Navbar2 />
      <div className="containerpaddin container mx-auto"></div>
      <Header />
      <CtLogo />
      <Seamless />
      <Form />
      <Create />
      <Footer2 />
    </div>
  );
}

export default page;
