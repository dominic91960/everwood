import Header from "../component/About/header";
import Stats18k from "../component/About/18k";
import { Navbar2 } from "../component/Navbar/Navbar2";
import Build2 from "../component/About/build2";
import Craft from "../component/About/craft";
import Consult from "../component/About/consult";
import Bring from "../component/About/bring";
import Footer2 from "../component/Footer/Footer2";
function page() {
  return (
    <div>
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
