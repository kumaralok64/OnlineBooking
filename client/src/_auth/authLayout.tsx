import { Outlet,Navigate } from "react-router-dom";

const AuthLayout = () => {
const isAuthorised = false;
   
  return (
    <>
     {
      isAuthorised ?(
        <Navigate to='/'/>
       
      ):(
        <> 
        
        <section className="flex flex-1 items-center justify-center flex-col py-10">
          <Outlet/>
        </section>
        <img src='/side-img.png' className=" hidden lg:block object-cover  h-screen w-1/2 bg-no-repeat"></img>
        </>
      )
    }</>
   
  )
}

export default AuthLayout