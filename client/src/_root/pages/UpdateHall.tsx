import { useState } from 'react';
import { format, isBefore, isToday, addDays } from 'date-fns'; // Import additional functions
import { Calendar as CalendarIcon, CircleX, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useParams } from 'react-router-dom';
import UserApi from '@/common/server';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateHall = () => {
  const [date, setDate] = useState<Date>();
  const [time, settime] = useState<string[]>([]);
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const { id } = useParams();

  // Handler to update time value at a specific index
  const handleTimeChange = (index: number, value: string) => {
    const updatedtime = [...time];
    updatedtime[index] = value;
    settime(updatedtime);
  };

  // Handler to add a new time input
  const addTimeInput = () => {
    settime([...time, '']);
  };

  // Handler to save hall data
  const handleSave = async () => {
    try {
      const Times = time.some(value => value.trim() !== ''); // Ensure there's a valid time entry
      if (date && name && price && Times) {
        const Date = format(date, 'eee d MMMM');
        const times = time.map(value => formatTime(value));
        console.log(times);

        const res = await axios.post(UserApi.pushHallData.url, { id, name, price, Date, times }, { withCredentials: true });
        console.log("res", res);
        toast.success(res?.data.message);
      } else {
        toast.error("Please fill out all fields.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('Axios error', err.response?.data);
        toast.error(err.response?.data.message);
      } else {
        console.log('Unexpected error', err);
      }
    }
    console.log(id, name, price, date, time);
  };

  // Handler to remove a specific time input
  const removeTimeInput = (index: number) => {
    const updatedtime = time.filter((_, i) => i !== index);
    settime(updatedtime);
  };

  // Format time to AM/PM
  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? 'PM' : 'AM';
    const formattedHour = hourInt % 12 || 12; // Convert to 12-hour format
    return `${formattedHour}:${minute} ${ampm}`;
  };

  // Date selection handler
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const today = new Date();
      // Check if the selected date is before today or today
      if (isBefore(selectedDate, today) || isToday(selectedDate)) {
        toast.error("Please choose a date after today.");
        // Automatically set the date to tomorrow
        setDate(addDays(today, 1));
      } else {
        setDate(selectedDate);
      }
    }
  };

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full ">Update the Hall</h2>
          <div className="flex w-full mt-2">
            <div className="flex flex-col gap-5 ">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-400">Name</label>
                  <input
                    type="text"
                    className="mt-1 p-2 bg-dark-4 rounded-md shadow-sm focus:ring sm:text-sm"
                    onChange={(e) => setname(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-400">Price</label>
                  <input
                    type="text"
                    placeholder="Rs"
                    className="mt-1 p-2 bg-dark-4 rounded-md shadow-sm focus:ring sm:text-sm"
                    onChange={(e) => { setprice(e.target.value) }}
                  />
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal bg-dark-4 border-none",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "eee d MMMM") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-dark-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Render time inputs */}
              <div className="flex flex-row flex-wrap gap-2">
                {time.map((time, index) => (
                  <div key={index} className="flex flex-row flex-wrap items-center gap-2">
                    <input
                      className="mt-1 p-2 bg-dark-4 rounded-md shadow-sm w-fit sm:text-sm"
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                    />
                    <button
                      className='text-neutral-500 hover:text-white text-sm'
                      onClick={() => removeTimeInput(index)}
                    >
                      <CircleX />
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="flex items-center text-neutral-500 hover:text-white"
                onClick={addTimeInput}
              >
                <PlusCircle className="mr-1 h-5 w-5" />
                Add Time
              </button>
              <button className="mt-4 max-w-md px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700" onClick={handleSave}>
                Save Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateHall;
