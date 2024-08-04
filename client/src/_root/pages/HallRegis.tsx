import UserApi from "@/common/server";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
interface Seat {
  row: number;
  col: number;
  status: string;
  Available: boolean;
}
interface Hall {
  name: string;
  location: string;
  seats: Seat[];
}
const HallRegis = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [name, setName] = useState<string>('');
  const [location,setLocation] = useState("");
  const handleGenerateLayout = () => {
    const generatedSeats: Seat[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        generatedSeats.push({ row: i, col: j, status: 'Available', Available: true });
      }
    }
    setSeats(generatedSeats);
  };
  const handleSeatClick = (index: number) => {
    const newSeats = [...seats];
    newSeats[index].Available = false; // Marking seat as deleted (unavailable)
    setSeats(newSeats);
  };
  const handlesave= async()=>{
    const hallData: Hall = {
      name,
      location,
      seats,
    };
    try {
      const OwnerRegi_Response = await axios.post(UserApi.HallRegis.url, hallData);
      console.log("res", OwnerRegi_Response);
      toast.success(OwnerRegi_Response?.data.message);
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
    <div className="flex flex-1">
       <div className="home-container">
        <div className="home-posts">
        

        <h2 className="h3-bold md:h2-bold text-left w-full ">Register Your Hall</h2>
        <p className="   text-purple-300  text-sm w-full   cursor-pointer" onClick={()=>navigate('/Owner/Sign-In')}>Update Hall Details</p>
        
        
        <div className="flex w-full mt-2">
        <div className="flex flex-col gap-5 ">
          <div className=" flex flex-row  flex-wrap gap-4">  
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-gray-500">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-2 bg-dark-4  rounded-md shadow-sm focus:ring"
        /></div>
       
         <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-gray-500">Location</label>
        <input
          type="text"
          value={location} 
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 p-2 bg-dark-4  rounded-md shadow-sm focus:ring"
        />
        </div>
       
      </div>
      <div className="flex space-x-4 mb-4">
        <label className="block text-sm font-medium text-gray-500">
          Rows:
          <input
            type="number"
            value={rows}
            min={0}
            onChange={(e) => setRows(Number(e.target.value))}
            className="mt-1 p-2 bg-dark-4 block w-full  rounded-md shadow-sm focus:ring"
          />
        </label>
        <label className="block text-sm font-medium text-gray-500">
          Columns:
          <input
            type="number"
            value={columns}
            min={0}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="mt-1 p-2 block w-full bg-dark-4 rounded-md shadow-sm focus:ring"
          />
        </label>
      </div>
      <Button
        onClick={handleGenerateLayout}
        className=" max-w-32 mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
      >
        Generate Layout
      </Button>
      <div className="flex w-full">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 35px)`  ,gridTemplateRows:`repeat(${rows}, 35px)`}}>
        {seats.map((seat, index) => (
          <div
            key={index}
            onClick={() => handleSeatClick(index)}
            className={` w-5  h-5  rounded-sm cursor-pointer ${seat.Available ? ' bg-neutral-600' : ''}`}
          ></div>
        ))}
      </div>
      </div>
      <button
       onClick={()=>handlesave()}
        className="mt-4  max-w-md px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
      >
        Save Layout
      </button>
    </div>
      </div>
        </div>
       
       </div>
    </div>
  )
}

export default HallRegis