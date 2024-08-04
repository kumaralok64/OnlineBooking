import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link } from "react-router-dom"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Loader from "@/components/shared/loader"
import { Input } from "@/components/ui/input"
import { UserSignInValidation } from "@/lib/validation"
import UserApi from "@/common/server";
import axios from 'axios'
import {  toast } from 'react-toastify';
import Icon  from "@/components/shared/icon"
import { useNavigate } from "react-router-dom";
import { useState } from "react"
const UserSignInForm = () => {
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();
    const form = useForm<z.infer<typeof UserSignInValidation>>({
      resolver: zodResolver(UserSignInValidation),
      defaultValues: {
        email:'',
        password:''
      },
    })
      const LoginWithGoggle = ()=>{
        window.open(UserApi.GoggleAuth.url,"_self");
      }
  async function onSubmit(values: z.infer<typeof UserSignInValidation>) {
    setLoading(true);
    console.log(values);
    try {
      const User_SignInResponse = await axios.post(UserApi.signIn.url, values,{ withCredentials: true });
      console.log("res", User_SignInResponse);
      setTimeout(()=>{
        navigate("/");
      },1000)
     
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('Axios error', err.response?.data);
        toast.error(err.response?.data.message);
      } else {
        console.log('Unexpected error', err);
      }
    }
    }
    return (
      <>
         <Form {...form}>
          <div className="sm:w-420 flex flex-col  flex-center">
            <div className=" flex flex-row  gap-1 items-center">
             
              <img src='/logo.png' alt='logo'></img>

              <h1 className=" roboto-slab text-[26px]">ShowSnap</h1>
              
            </div>
          <h2 className=" h3-bold md:h2-bold pt-5 sm:pt-8">Log in to your account</h2>
          <p className=" text-light-3 small-medium md:base-regular mt-2">Hurry up! Enter the details so you don't miss the movie.</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                <Icon field={field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary  flex items-center gap-4">
            {
              loading ? <Loader/> :""
            }
             SignIn
          </Button>
          <div className="flex items-center  gap-6 justify-center">
            <div className=" flex flex-1 h-[1px] w-10  bg-neutral-700"></div>
          <p className='text-zinc-600  font-semibold self-center'> OR</p>
          <div className=" flex flex-1 h-[1px] w-10 bg-neutral-700"></div>
             </div>
          
        </form>
        <Button className={ ` mt-2 bg-white shadow-lg w-full`} onClick={LoginWithGoggle}>
  <div className="p-2  flex items-center gap-4">
     <img src='/icons/GoggleIcon.png' width={20} height={20}></img>
    
    <p className="text-sm  text-neutral-950 "> SIGN IN WITH GOGGLE</p>
     </div>
  </Button>
        <div className=" flex flex-row gap-1  mt-6  items-center justify-center">
          <p className=" small-regular text-light-2 ">Don't have account?</p>
          <Link to='/User/Sign-Up' className="text-primary-500  small-semibold">Sign Up</Link>
          </div>
        <Link to='/User/Password' className="  text-sm font-semibold  text-zinc-600  mt-2">Forgot password /Set password</Link>

        </div>
       
      </Form>
      
        </>
    )
}

export default UserSignInForm