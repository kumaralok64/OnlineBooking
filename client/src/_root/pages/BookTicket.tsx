import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserApi from "@/common/server";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define interfaces for type safety
interface Seat {
  row: number;
  col: number;
  status: string;
  Available: boolean;
}

interface Screening {
  date: string;
  time: string[];
}

interface Movie {
  name: string;
  price: string;
  screenings: Screening[];
}

interface Hall {
  _id: string;
  name: string;
  location: string;
  seats: Seat[];
  movie: Movie[];
}

const BookTicket = () => {
  const navigate = useNavigate();
  const { movieName } = useParams<{ movieName: string }>();
  const [hallDetail, setHallDetail] = useState<Hall[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [Dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await axios.get(
          `${UserApi.hallDetails.url}/${movieName}`,
          { withCredentials: true }
        );
        setHallDetail(response.data);
        console.log(response.data);
        // Automatically select the earliest date by default
      } catch (error) {
        console.error("Error fetching hall details:", error);
      }
    };

    fetchHalls();
  }, [movieName]);

  useEffect(() => {
    console.log("Dates", Dates);
    getSortedDates();
  }, [hallDetail]);

  const allDates = hallDetail.flatMap((hall: Hall) =>
    hall.movie.flatMap((movie: Movie) =>
      movie.screenings.map((screening: Screening) => screening.date)
    )
  );

  // Get unique sorted dates
  const getSortedDates = () => {
    const uniqueSortedDates = Array.from(new Set(allDates as string[])).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    if (uniqueSortedDates.length > 0) {
      setSelectedDate(uniqueSortedDates[0] as string);
    }
    setDates(uniqueSortedDates);

    console.log("Sorted Dates: ", uniqueSortedDates);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Book Ticket for <span className=" text-purple-400 ml-1"> {movieName}</span>
          </h2>

          {/* Date Selection */}
          <div className="flex w-full mt-2 flex-row gap-8">
            {/* Render dates in ascending order */}
            {Dates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateChange(date)}
                className={`btn-date ${
                  selectedDate === date ? "selected" : ""
                } bg-pink-600 rounded-lg`}
              >
                <div className="flex flex-col gap-2 text-xs font-semibold p-2 w-min">
                  {date}
                </div>
              </button>
            ))}
          </div>

          {/* Hall details */}
          <div className="flex w-full mt-2 flex-col gap-14">
            {hallDetail
              .map((hall: Hall) => {
                // Filter movies with screenings on the selected date
                const moviesWithScreenings = hall.movie.filter((movie: Movie) =>
                  movie.screenings.some(
                    (screening: Screening) => screening.date === selectedDate
                  )
                );

                // Only display halls with movies having screenings on the selected date
                if (moviesWithScreenings.length > 0) {
                  return (
                    <div key={hall._id} className="post-card">
                      <div className=" flex sm:flex-row  flex-wrap flex-col gap-10 items-center  ">
                        <div className="flex flex-col  gap-2">
                      <div className={`flex flex-row gap-1 items-center  text-lg xl:text-xl `}>
                        <h2 className=" w-max">Ⓜ️ {hall.name},</h2>
                        <p className=" text-sky-300"> {hall.location}</p>
                      </div>
                      <div className=" flex flex-row   items-center">
                        <img src="/beverage.png" className=" w-10 h-10 bg-transparent"></img>
                        <p className=" text-light-3 text-sm ">Food & Beverage</p>
                      </div>
                      <p className=" ml-2  opacity-80 hover:opacity-100 cursor-pointer"> Rs {moviesWithScreenings.map(movie=>movie.price)}</p>
                     
                    </div>
                      {moviesWithScreenings.map((movie: Movie) =>
                        movie.screenings
                          .filter(
                            (screening: Screening) =>
                              screening.date === selectedDate
                          )
                          .map((screening: Screening) => (
                            <div
                              key={screening.date}
                              className="flex  flex-row  gap-6"
                            >
                              {screening.time
                                .sort(
                                  (a, b) =>
                                    new Date(`1970/01/01 ${a}`).getTime() -
                                    new Date(`1970/01/01 ${b}`).getTime()
                                )
                                .map((time) => (
                                  <button className=" bg-black h-fit border rounded-lg border-dark-4  hover:bg-neutral-800" onClick={()=>navigate(`/Hall-layout/${hall._id}/${movieName}/${selectedDate}/${time}/${moviesWithScreenings.map(movie=>movie?.price)}/${hall.name}/${hall.location}`)}>
                                      <p key={time} className="p-4   text-zinc-300">{time}</p>
                                  </button>
                                  
                                ))}
                            </div>
                          ))
                      )}
                     
                    </div>
                    </div>
                  );
                }

                // Return null if no movies with screenings on the selected date
                return null;
              })
              .filter((hall) => hall !== null)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;
