import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import {ownerSignInValidation} from "@/lib/validation"
import UserApi from "@/common/server";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const OwnerSignIn = () => {
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof ownerSignInValidation>>({
        resolver: zodResolver(ownerSignInValidation),
        defaultValues: {
          name: "",
          location:""
        },
      })
    
      async function onSubmit(values: z.infer<typeof ownerSignInValidation>) {
        try{
          console.log(values);
          const res= await axios.post(UserApi.updateDetails.url,values,{ withCredentials: true });
          setTimeout(()=>{
            navigate(`/UpdateHall/${res.data}`)
          },500)
          
          
        }catch(err){
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
        <div className="sm:w-420 flex flex-col  flex-center  mb-12">
          <div className=" flex flex-row  gap-1 items-center">
            <img src='/logo.png' alt='logo'></img>
            <h1 className=" roboto-slab text-[26px]">ShowSnap</h1>
           
          </div>
        <h2 className=" h3-bold md:h2-bold pt-5 sm:pt-8">Login into Your Hall</h2>
        <p className=" text-light-3 small-medium md:base-regular mt-2">Hurry up! Enter the details and Provide the Service.</p>
       
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hall Name</FormLabel>
              <FormControl>
                <Input type='text' className="shad-input" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input type='text' className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit"  className="shad-button_primary">
        SignIn </Button>
        
      </form>
      </div>
    </Form>
    </>
  )
}

export default OwnerSignIn