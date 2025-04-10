import { Alert, Button, Divider, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Order from "./Order";
import UserDetails from "./UserDetails";
import OrderDetails from "./OrderDetails";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { performLogout } from "../../../Redux Toolkit/Customer/AuthSlice";
import Addresses from "./Adresses";

const menu = [
  { name: "Orders", path: "/account/orders" },
  { name: "Profile", path: "/account/profile" },
  { name: "Addresses", path: "/account/addresses" },
  { name: "Logout", path: "#" }, // Added Logout to menu
];

// Updated order submenu with correct status mapping
const orderSubMenu = [
  { 
    name: "Arriving", 
    status: ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'ARRIVING'] 
  },
  { 
    name: "Delivered", 
    status: ["DELIVERED"] 
  },
  { 
    name: "Cancelled", 
    status: ["CANCELED"] 
  }
];

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, orders } = useAppSelector((store) => store);
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const [activeOrderFilter, setActiveOrderFilter] = useState<string | null>(null);

  const handleLogout = () => {
    dispatch(performLogout());
    navigate("/");
  };

  const handleClick = (item: any) => {
    if (item.name === "Logout") {
      handleLogout(); // Call logout function when Logout is clicked in menu
    } else {
      navigate(`${item.path}`);
      setActiveOrderFilter(null);
    }
  };

  const handleOrderFilterClick = (filterName: string) => {
    setActiveOrderFilter(activeOrderFilter === filterName ? null : filterName);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (user.profileUpdated || orders.orderCanceled || user.error) {
      setOpenSnackbar(true);
    }
  }, [user.profileUpdated, orders.orderCanceled]);

  return (
    <div className="px-3 lg:px-52 min-h-screen mt-10">
      {/* User Name */}
      <div>
        <h1 className="text-xl font-bold pb-5">{user.user?.fullName}</h1>
      </div>
      <Divider />

      {/* Main Menu Items */}
      <div className="flex flex-wrap lg:flex-row gap-3 justify-start border-b pb-2">
        {menu.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className={`px-5 py-2 rounded-md text-sm lg:text-base cursor-pointer 
              ${item.path === location.pathname ? "bg-black text-white" : "hover:bg-gray-200"}
            `}
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* Order Sub-Menu (only shown on orders page) */}
      {location.pathname.includes("/orders") && (
        <div className="flex flex-wrap lg:flex-row gap-3 justify-start border-b pb-2 mt-3">
          {orderSubMenu.map((item, index) => (
            <div
              key={index}
              onClick={() => handleOrderFilterClick(item.name)}
              className={`px-5 py-2 rounded-md text-sm lg:text-base cursor-pointer 
                ${activeOrderFilter === item.name ? "bg-black text-white" : "hover:bg-gray-200"}
              `}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}

      {/* Content Section */}
      <div className="py-5">
        <Routes>
          <Route path="/" element={<UserDetails />} />
          <Route 
            path="/orders" 
            element={<Order activeFilter={activeOrderFilter} />} 
          />
          <Route path="/orders/:orderId/:orderItemId" element={<OrderDetails />} />
          <Route path="/profile" element={<UserDetails />} />
          <Route path="/addresses" element={<Addresses />} />
        </Routes>
      </div>

      {/* Standalone Logout Button */}
      {/* <div className="flex justify-center mt-5">
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div> */}

      {/* Snackbar for Notifications */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={user.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {user.error ? user.error : orders.orderCanceled ? "Order canceled successfully" : "Success"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
