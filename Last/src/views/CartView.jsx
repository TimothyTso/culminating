import { useStoreContext } from "../context";
import Header from "./../components/HeaderLog.jsx";
import Footer from "./../components/Footer.jsx";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./CartView.css";
import { useNavigate } from "react-router-dom";

function CartView() {
  const navigate = useNavigate();
  const { cart, setCart, user } = useStoreContext();
  const checkout = async () => {
    if (!cart.size) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const docRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(docRef);
      const userData = userDoc.data();
      const userCart = userData.cart || [];
      const updatedCart = [...userCart, ...Array.from(cart.values())];

      await setDoc(docRef, { cart: updatedCart }, { merge: true });
      setCart(new Map());
      localStorage.removeItem(user.uid);
      alert("Thank you for your purchase!"); //ty message ghere
      navigate('/movies/genre');
      location.reload();
    } catch (error) {
      
      alert("There was an error during checkout.");
    }
  };
return (
<div className= "cartview">
    <div className= "header">
        <Header />
    </div>
    
    <div className= "cartitems">
        {
          Array.from(cart.entries()).map(([key, value]) => {
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
      <button className="checkoutButton" onClick={checkout}>
          Checkout
        </button>
      <div className= "footer">
        <Footer />
      </div>
    </div>
    
  );
}

export default CartView;
