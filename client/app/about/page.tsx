import { Metadata } from "next";
import Header from "../component/About/header";
import Stats18k from "../component/About/18k";
import { Navbar2 } from "../component/Navbar/Navbar2";
import Build2 from "../component/About/build2";
import Craft from "../component/About/craft";
import Consult from "../component/About/consult";
import Bring from "../component/About/bring";
import Footer2 from "../component/Footer/Footer2";

export const metadata: Metadata = {
  title: "About Everwood Collection | Sri Lanka's Premium Furniture Makers",
  description:
    "Learn about Everwood Collection — Sri Lanka's trusted name for affordable luxury and custom wooden furniture made by skilled artisans.",
  keywords:
    "about Everwood Collection, Sri Lanka furniture craftsmanship, wooden furniture company, handcrafted furniture Sri Lanka",
  openGraph: {
    title: "About Everwood Collection | Premium Furniture in Sri Lanka",
    description:
      "Dedicated to creating beautiful, durable, and affordable custom furniture with Sri Lankan craftsmanship.",
    url: "https://everwoodcollection.com/about",
    images: ["/images/og-image-about.jpg"],
    type: "article",
  },
};

function page() {
  return (
    <div className="font-poppins">
      <Navbar2 />
      <div className="containerpaddin container mx-auto"></div>
      <Header />
      <Stats18k />
      <Build2 />
      <Craft />
      {/* <From /> */}
      <Consult />
      <Bring />
      <Footer2 />
    </div>
  );
}

export default page;
