import { Link, useNavigate } from "react-router-dom";
import { Popcorn } from 'lucide-react';
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from 'axios';
import UserApi from "@/common/server";
import Loader from "./loader";

interface User {
  Username: string;
  image: string;
}

const LeftSidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("/No profile.jpg");
  const [loadingData, setLoadingData] = useState(false); // Initially set to true to show loading state
  const navigate = useNavigate();

  const User_Details = async () => {
    try {
      const response = await axios.get(UserApi.UserDetails.url, { withCredentials: true });
      setUser(response.data);
      setImage(response.data.image);
      setLoadingData(false); // Set loading to false once data is fetched
    } catch (err) {
      console.log("Error fetching user details:", err);
      setLoadingData(false); // Handle error state
    }
  };

  useEffect(() => {
    User_Details();
  }, []);

  const handleChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleClick = () => {
    document.getElementById("inputClick")?.click();
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const signOutRes = await axios.get(UserApi.logout.url, { withCredentials: true });
      console.log(signOutRes.data);
      setTimeout(() => {
        setUser(null);
        setLoading(false); // Set loading to false after sign out
      }, 1000);
    } catch (err) {
      console.log('Error occurred while signing out:', err);
      setLoading(false); // Handle error state
    }
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col base-medium gap-8">
        <Link to="/" className="flex flex-row gap-1 items-center">
          <img src='/logo.png' alt='logo' />
          <h1 className="roboto-slab text-[26px]">ShowSnap</h1>
        </Link>
        <div className="flex flex-col gap-4 pl-4">
          <Link to="/" className="flex flex-row gap-2 items-center leftsidebar-link">
            <img src="/icons/home.svg" alt="Home" />
            <p>Home</p>
          </Link>
          <Link to="/Regis-Hall" className="flex flex-row items-center gap-2 leftsidebar-link">
            <Popcorn className="text-primary-500" />
            Register Hall
          </Link>
          <div className="flex gap-4 flex-col">
            <div className="flex flex-row gap-2 items-center">
              {user ? (
                <>
                  <img src={`${image}`} className={`rounded-full ${user.image ? "h-8 w-8" : "h-8 w-8 cursor-pointer hover:opacity-70"}`} alt="Profile" onClick={handleClick} />
                  <input type="file" accept="image/*" onChangeCapture={handleChange} id="inputClick" className="hidden"></input>
                  <p className="text-base roboto-slab text-[18px] tracking-widest">{user?.Username}</p>
                </>
              ) : (
                <>
                  {loadingData ? (
                    <Loader />
                  ) : (
                    <Button onClick={() => navigate(`/User/Sign-in`)} className="shad-button_primary w-3/4">Sign In</Button>
                  )}
                </>
              )}
            </div>
            {user && (
              <div className="grid gap-4 text-light-3 py-2 px-6">
                <Link to="/history" className="flex flex-row items-center gap-3 leftsidebar-link">
                  Your Orders
                </Link>
                <div className="flex flex-row items-center gap-3 leftsidebar-link">
                  Help & Support
                </div>
                <div className="flex flex-row items-center gap-3 leftsidebar-link">
                  Account & Settings
                </div>
                <div className="flex flex-row items-center gap-3 leftsidebar-link">
                  Play Credit Card
                </div>
                <Button type="submit" variant="ghost" className="shad-button_ghost" onClick={handleSignOut}>
                  {loading ? <Loader /> : <img src="/icons/logout.svg" alt="Logout" />}
                  <p className="text-light-3 font-semibold hover:text-off-white mr-3">Sign Out</p>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default LeftSidebar;
