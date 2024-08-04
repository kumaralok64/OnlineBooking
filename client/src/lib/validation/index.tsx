import { z } from "zod"


 export const UserSignUpValidation = z.object({
    username: z.string().min(2, {message: "To Short",}),
    email:z.string(),
    password:z.string().min(8,{message:"Password must be 8 character"})

  });
 export const UserSignInValidation = z.object({
    email:z.string(),
    password:z.string().min(8,{message:"Password must be 8 character"})

  });

  export const UserPasswordValidation = z.object({
    email:z.string(),
    password:z.string().min(8,{message:"Password must be 8 character"})

  });

  export const HallRegistration =  z.object({
    hallname: z.string(),
    location:z.string(),
    price:z.string().min(3,{message:"Password must be 8 character"}),
    rows:z.number().min(2,{message: "To Short",}),
    columns:z.number().min(2,{message: "To Short",})

  });
  export const HallLayout =  z.object({
    rows:z.number().min(2,{message: "To Short",}),
    columns:z.number().min(2,{message: "To Short",})

  });
export const ownerSignInValidation = z.object({
  name:z.string().min(2, {message: "To Short",}),
  location:z.string().min(2,{message:"Too Short"})
})