import { Link, useNavigate }  from "react-router-dom";
import { SheetDemo } from "./sidebar";
import axios from "axios";
import UserApi from "@/common/server";
import { useEffect, useState } from "react";

interface User {
  Username: string;
  image: string;
}

const Topbar = () => {
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const User_Details = async () => {
      try {
        const response = await axios.get(UserApi.UserDetails.url, { withCredentials: true });
        setUser(response.data);
        console.log(response.data);
      } catch (err) {
        console.log("err", err);
      }
    };

    User_Details(); 
  }, []); 

  const handleSignOut = async () => {
    try {
      const signOutRes = await axios.get(UserApi.logout.url, { withCredentials: true });
      console.log(signOutRes.data);
      setUser(null);
    } catch (err) {
      console.log('Error occurred while signing out');
    }
  };

  const navigate = useNavigate();

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex flex-row items-center gap-1">
          <img src='/logo.png' alt='logo' />
          <h1 className="hidden sm:block roboto-slab text-[26px]">ShowSnap</h1>
        </Link>
        <div className="flex gap-3 sm:gap-4 items-center">
          <Link to="/" className="body-semibold">Register Hall</Link>
          {user ? (
            <SheetDemo user={user} handleSignOut={handleSignOut} />
          ) : (
            <button className="shad-button_primary py-[2px] px-3 rounded-lg" onClick={() => navigate("/User/Sign-In")}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Topbar;
