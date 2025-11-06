import Image from "next/image";
import Aboutus from "./component/Buttons/aboutus";
import Section03 from "./component/Home/Section03";
import Section05 from "./component/Home/Section05";
import Section06 from "./component/Home/Section06";
import Section07 from "./component/Home/Section07";
import Section08 from "./component/Home/Section08";
import Section04 from "./component/Home/Section04";
import Section01 from "./component/Home/Section01";
import Section02 from "./component/Home/Section02";
import { Navbar2 } from "./component/Navbar/Navbar2";
import Tooltip from "./component/Tooltip/Tooltip";
import Section09 from "./component/Home/Section09";
import Footer from "./component/Footer/Footer";
import ComingSoon from "./component/commingsoon";
export default function Home() {
  return (
    <div>
      <Navbar2 />
      <div className=" py-20 containerpaddin container mx-auto ">

        <Section01 />
        <Section02 />
        <div data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="2000">
          <Section03 />
        </div>
        <div data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="2000">
          <Section04 />
        </div>
        <div data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="2000">
          <Section05 />
        </div>
        <div data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="2000">
          <Section06 />
        </div>
        <div data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="2000">
          <Section07 />
        </div>
        <div data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="2000">
          <Section08 />
        </div>
        <div data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="2000">
          <Section09 />
        </div>
      </div>
      <Footer />
    </div>
  );
}
