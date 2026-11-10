import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Catalog from "./pages/catalog/Catalog";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import OrderStatus from "./pages/orderstatus/OrderStatus";
import Delivery from "./pages/delivery/Delivery";
import Rating from "./pages/rating/Rating";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order" element={<OrderStatus />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/rating" element={<Rating />} />
      </Routes>
    </Router>
  );
}
