import { Link } from "react-router-dom";
import Header from "./../components/Header";
import Hero from "./../components/Hero";
import Feature from "./../components/Feature";
import Footer from "./../components/Footer";
function HomeView() {
  return (
    <div>
        <Header />
        <Hero />
        <Feature />
        <Footer />
    </div>
    
  );
}

export default HomeView;
