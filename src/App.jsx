import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import RestaurantList from "./pages/RestaurantList";
import Order from "./pages/Order";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import RestaurantDetail from "./pages/RestaurantDetail";
import Checkoutpage from "./pages/Checkoutpage";
import Layout from "./layouts/Layout";
import NotFoundpage from "./pages/NotFoundpage";
import Forbiddenpage from "./pages/Forbiddenpage";
import Adminpage from "./pages/Adminpage";
import Staffpage from "./pages/Staffpage";
import Homepage from "./pages/Homepage";
import LoginAdmin from "./pages/LoginAdmin";
import ResetPasswordPage from "./pages/ResetPage";
import UpdatePassPage from "./pages/UpdatePassPage";
import Successpage from "./pages/Successpage";
import Failcheckoutpage from "./pages/Failpage";
import PromotionPage from "./pages/PromotionPage";
import VideoFeed from "./pages/ReviewPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="login" element={<Loginpage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/update-password" element={<UpdatePassPage />} />
          <Route path="register" element={<Registerpage />} />
          <Route path="restaurant" element={<RestaurantList />} />
          <Route path="restaurants/promotion" element={<PromotionPage />} />
          <Route path="restaurant/:id" element={<RestaurantDetail />} />
          <Route path="order" element={<Order />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="checkout" element={<Checkoutpage />} />
          <Route path="forbidden" element={<Forbiddenpage />} />
          <Route path="success" element={<Successpage />} />
          <Route path="fail" element={<Failcheckoutpage />} />
          <Route path="*" element={<NotFoundpage />} />
        </Route>
        <Route path="restaurants/review" element={<VideoFeed />} />
        <Route path="/dashboard" element={<Adminpage />} />
        <Route path="/staff" element={<Staffpage />} />
        <Route path="/loginAD" element={<LoginAdmin />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
