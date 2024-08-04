import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link } from "react-router-dom"
import axios from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UserSignUpValidation } from "@/lib/validation"
import {  toast } from 'react-toastify';
import UserApi from "@/common/server";
import Icon  from "@/components/shared/icon"
const UserSignUpForm = () => {
 
  const form = useForm<z.infer<typeof UserSignUpValidation>>({
    resolver: zodResolver(UserSignUpValidation),
    defaultValues: {
      username: "",
      email:'',
      password:''
    },
  })

  async function onSubmit(values: z.infer<typeof UserSignUpValidation>) {
    
    try {
      const User_SignUpResponse = await axios.post(UserApi.signUp.url, values);
      console.log("res", User_SignUpResponse);
     toast.success(User_SignUpResponse?.data.message);
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
        <h2 className=" h3-bold md:h2-bold pt-5 sm:pt-8">Create a new account</h2>
        <p className=" text-light-3 small-medium md:base-regular mt-2">Hurry up! Enter the details so you don't miss the movie.</p>
       
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type='text' className="shad-input" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
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
                 <Icon field={field} />
               
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit"  className="shad-button_primary">
        SignUp </Button>
        <div className=" flex flex-row gap-1   items-center justify-center">
        <p className=" small-regular text-light-2 ">Already have an account?</p>
        <Link to='/User/Sign-in' className="text-primary-500  small-semibold">Log in</Link>
        </div>
        
      </form>
      </div>
    </Form>
    
      </>
  )
}

export default UserSignUpForm