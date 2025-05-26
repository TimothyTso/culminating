import { useStoreContext } from "../context";
import Header from "./../components/HeaderLog.jsx";
import Footer from "./../components/Footer.jsx";
import "./CartView.css";
function CartView() {
  const { cart, setCart, fname } = useStoreContext();
return (
<div className= "cartview">
    <div className= "header">
        <Header />
    </div>
    
    <div className= "cartitems">
        {
          cart.entrySeq().map(([key, value]) => {
            return (
              <div className="cartitem" key={key}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${value.poster_path}`}
                  alt={value.title}
                />
                <h1>{value.title}</h1>
                <button onClick={() => setCart((prevCart) => prevCart.delete(key))}>Remove</button>
              </div>
            );
          })
        }
      </div>
      <div className= "footer">
        <Footer />
      </div>
    </div>
    
  );
}

export default CartView;
