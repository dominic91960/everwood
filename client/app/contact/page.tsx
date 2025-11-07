import Header from "../component/contact/header";
import { Navbar2 } from "../component/Navbar/Navbar2";
import CtLogo from "../component/contact/ctlogo";
import Seamless from "../component/contact/seamless";
import Form from "../component/contact/form";
import Create from "../component/contact/create";
import Footer2 from "../component/Footer/Footer2";
function page() {
  return (
    <div>
      <Navbar2 />
      <div className="containerpaddin container mx-auto">
        
      </div>
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
