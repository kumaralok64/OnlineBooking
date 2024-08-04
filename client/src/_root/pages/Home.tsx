import {dummyData} from "@/common/api"
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';

import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex flex-1">
      <div className="home-container">
        <div className="home-posts">
         <h2 className="h3-bold md:h2-bold text-left w-full">Popular Movie</h2>
         <div className="flex w-full pt-5 flex-col gap-6">
        {
          dummyData.map((movie,index)=>{
            return(
              <div className="post-card flex" key={index}>
              <div className="flex flex-col  xl:flex-row  w-full  md:gap-6 xl:gap-14">
              <img src={movie.poster} className="post-card_img  hover:opacity-50 "></img>
            <div className="flex flex-col w-full  gap-6">
            <h2 className="h3-bold md:h2-bold text-left w-full">{movie.name}</h2>
            <div  className="flex flex-row gap-2 bg-zinc-700 p-4 rounded-lg w-3/4 xl:w-full">
            <Star  className="  text-pink-800 fill-pink-800"/>
            <p>{movie.rating}/10</p>
            <p>({movie.votes} Votes)</p>
             </div>
             <div className=" flex flex-row gap-1">
              {
                movie?.language.map((data)=>{
                  return(
                    <h3 className=" text-neutral-500 ">{data}</h3>
                  )
                })
              }
             </div>
             <div className=" flex flex-wrap gap-2 text-light-2">
             <li>{movie.Duration}</li>
            <li className="list-disc">{movie.Categorty}</li>
            </div>
            <div className=" font-medium flex flex-wrap gap-2 text-neutral-600">
            <li>LeadRoles</li>
            <li className=" text-light-4">{movie.releasedate}</li>
            </div>
           
            <div className="flex flex-row gap-2   flex-wrap ">
              {
                movie?.leadrole.map((img)=>{
                  return(
                   <>
                   <img src={img} className=" object-cover  hover:opacity-50 rounded-full  size-20"></img></>
                  )
                })
              }
           </div>
           <Button onClick={()=>navigate(`/Book-Ticket/${movie.name}`)} className="shad-button_primary   w-3/4">Book Ticket</Button>
               </div>
             </div>
             </div>
            )
           
           
          })
        }
         </div>
        
         
        </div>
      </div>
    </div>
  )
}

export default Home