import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserApi from "@/common/server";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify"; // Use react-toastify for notifications
import axios from "axios";

import { loadStripe } from '@stripe/stripe-js';
interface Seat {
  row: number;
  col: number;
  status: string;
  Available: boolean;
}

const Layout = () => {

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]); // Track selected seats
  const { id, movieName, date, time, price, hallName, hallLoc } = useParams();

  useEffect(() => {
    if (!id) return;

    const socket = io(UserApi.backendDomain.url);

    socket.on("connect", () => {
      console.log("Connected", socket.id);
      socket.emit("joinRoom", id);
    });

    socket.on("hallLayout", (seatsData: Seat[]) => {
      console.log("Received Seat Layout", seatsData);
      setSeats(seatsData);
    });

    // Listen for seat update events
    socket.on("seatUpdated", (updatedSeats: Seat[]) => {
      setSeats(updatedSeats);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // Function to calculate seat number
  const calculateSeatNumber = (row: number, col: number): number => {
    return row * (Math.max(...seats.map(seat => seat.col)) + 1) + col + 1;
  };

  const handleBooking = (seat: Seat) => {
    if (!seat.Available) {
      if (seat.status === "Sold") {
        toast.error("This seat is already booked.");
      } else if (seat.status === "Reserved") {
        toast.info("This seat is currently reserved.");
      } else {
        toast.warning("This is a vacant space.");
      }
      return;
    }

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleReserveSeats = async() => {
    if (!id || !movieName || !date || !time || !price) {
      toast.error("Missing required reservation details.");
      return;
    }

    // Create the reservation data
    const reservationData = {
      id,
      hallName, // Replace with actual hall name if available
      hallLoc, // Replace with actual hall location if available
      movieName,
      date,
      time,
      price,
      seats: selectedSeats.map((seat) => ({
        row: seat.row,
        col: seat.col,
        seatNumber: calculateSeatNumber(seat.row, seat.col), 
      })),
    };
    console.log("reseVationData",reservationData);
 
    const socket = io(UserApi.backendDomain.url);

    // Emit the reserve event with reservation data
    socket.emit("reserveSeats", {
      hallId: id,
      seats: selectedSeats.map((seat) => ({
        row: seat.row,
        col: seat.col,
      })),
    });
    
    // Show a message that seats are reserved
    toast.success("Seats reserved for 5 minutes.");

    const handlePayment = async () => {
      const stripePublicKey = import.meta.env.REACT_APP_STRIPE_PUBLIC_KEY;
        console.log("Stripe Public Key:", stripePublicKey);
      try {
        

        const stripePromise = await loadStripe(stripePublicKey || '');
        const res = await axios.post(`${UserApi.CreatePayment.url}`, reservationData, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        });
        
        if(res.data?.id){
          stripePromise?.redirectToCheckout({sessionId:res.data.id})
        }
        console.log("Payment Response:", res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log('Axios error', err.response?.data);
          toast.error(err.response?.data.message);
        } else {
          console.log('Unexpected error', err);
        }
        console.error("Payment Error:", err);
      }
    };
  
    await handlePayment();
  
    // Clear selected seats
    setSelectedSeats([]);
  };

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Book Ticket</h2>
          <div className="flex w-full mt-2 flex-col gap-14">
            <div className="post-card">
              <div className="flex flex-col flex-wrap gap-5 w-full justify-center items-center">
                <p className="text-sm text-light-3">
                  All eyes this Way please!
                </p>
                <div className="flex justify-center object-contain container">
                  <img
                    src="/screen.png"
                    className="image-3d w-full sm:w-1/2 hover:opacity-80 shadow-lg shadow-neutral-600 opacity-95"
                    alt="3D Screen"
                  />
                </div>
                <div
                  className="grid text-xs w-full justify-center"
                  style={{
                    gridTemplateColumns: `repeat(${
                      Math.max(...seats.map((seat) => seat.col)) + 1
                    }, 35px)`,
                    gridTemplateRows: `repeat(${
                      Math.max(...seats.map((seat) => seat.row)) + 1
                    }, 35px)`,
                  }}
                >
                  {seats.reduce((availableSeats: JSX.Element[], seat, index) => {
                    if (seat.Available) {
                      const isSelected = selectedSeats.includes(seat);
                      const seatColor =
                        seat.status === "booked"
                          ? "bg-rose-500"
                          : seat.status === "Reserved"
                          ? "bg-yellow-600"
                          : seat.Available
                          ? isSelected
                            ? "bg-green-500"
                            : "bg-slate-900 hover:bg-green-500"
                          : "bg-slate-900";
                      availableSeats.push(
                        <div
                          key={index}
                          className={`w-6 h-6 rounded-sm cursor-pointer ${seatColor}`}
                          style={{
                            gridColumn: seat.col + 1,
                            gridRow: seat.row + 1,
                          }}
                          onClick={() => handleBooking(seat)}
                        >
                          <p className="p-1">{calculateSeatNumber(seat.row, seat.col)}</p>
                        </div>
                      );
                    }

                    return availableSeats;
                  }, [])}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-xs tracking-widest">
                  <div className="flex flex-row gap-2">
                    <div className="w-4 h-4 rounded-sm bg-green-500"></div>
                    <p className="flex items-center justify-center">Selected</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="w-4 h-4 rounded-sm bg-slate-900"></div>
                    <p className="flex items-center justify-center">Available</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="w-4 h-4 rounded-sm bg-yellow-600"></div>
                    <p className="flex items-center justify-center">Reserved</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="w-4 h-4 rounded-sm bg-rose-500"></div>
                    <p className="flex items-center justify-center">Sold</p>
                  </div>
                </div>
                <Button
                  onClick={handleReserveSeats}
                  className="text-xs py-2 tracking-widest shad-button_primary"
                >
                  Make Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;


