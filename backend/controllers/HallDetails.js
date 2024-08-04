const Hall_model = require("../models/Hall");

async function handleHallData(req,res){
    const hallData = await Hall_model.find({});
    return hallData;
  }

async function handleUpdatedeatils(req,res){
  try{
    const {name,location} = req.body;
   
    const hall = await Hall_model.findOne({
     name,
     location
    })
     if(!hall) throw new Error("Hall Doesn't Exit");
     return res.json(hall._id);

  }catch(err){
    return res.status(400).json({
      success: false,
      message: "Hall Doesn't Exit",
      error: true
    });
  }
      

  }
  async function handlepushHallData(req, res) {
    try {
      const { id, name, price, Date, times } = req.body;
      
      // Check if the required fields are present
      if (!id || !name || !price || !Date || !times || !times.length) {
        throw new Error("Enter the required Credentials");
      }
  
      // Fetch the hall details by ID
      const hall = await Hall_model.findById(id);
  
      if (!hall) throw new Error('No hall exists with the provided ID');
  
      // Find the index of the movie with the same name
      const movieIndex = hall.movie.findIndex(movie => movie.name === name);
      console.log("index",movieIndex)
      // If the movie exists, update the screenings
      if (movieIndex !== -1) {
        // Movie exists, push the new screening to the existing movie
        hall.movie[movieIndex].screenings.push({
          date: Date,
          time: times
        });
        
        await hall.save();
  
      } else {
        // Movie does not exist, create a new movie entry
        hall.movie.push({
          name: name,
          price: price,
          screenings: [{
            date: Date,
            time: times
          }]
        });
        
        await hall.save();
      }
  
      return res.status(201).json({
        success: true,
        error: false,
        message: "Details Saved Successfully"
      });
  
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message || err,
        error: true
      });
    }
  }
  async function handlehalldetails(req, res) {
    try {
      const movieName = req.params.movieName; // Get the movie name from request parameters
      console.log(movieName);
  
      // Fetch halls with the given movie name
      const halls = await Hall_model.find({ 'movie.name': movieName });
  
      // Map through halls and filter movies to only include the requested movie
      const filteredHalls = halls.map(hall => {
        // Filter movies to only keep the one with the specified name
        const filteredMovies = hall.movie.filter(m => m.name === movieName);
  
        return {
          ...hall.toObject(),
          movie: filteredMovies.map(m => ({
            ...m.toObject(),
            // Sort screenings by date and time for each movie
            screenings: m.screenings.sort((a, b) => new Date(a.date) - new Date(b.date)),
          })),
        };
      });
  
      // Return only halls that contain the filtered movie
      const nonEmptyHalls = filteredHalls.filter(hall => hall.movie.length > 0);
  
      res.json(nonEmptyHalls);
    } catch (err) {
      res.status(400).json({ error: 'An error occurred while fetching halls' });
    }
  }
  
  async function handleHallRegis(req, res) {
    try {
      const { name, location, seats } = req.body;
      if (!name ||  !location || !seats.length) throw new Error("Please Enter the required Credentials");
  
      const Existing_Hall = await Hall_model.findOne({
        name: name,
        location: location
      });
      if (Existing_Hall) throw new Error("Hall Exist at Particular Location");
      
      await Hall_model.create({
        name,
        location,
        seats
      });
      
      const hallData = await Hall_model.find({});
      
      
     
      return res.status(201).json({
        success: true,
        error: false,
        message: "Hall Register Sucessfully"
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message || err,
        error: true
      });
    }
  }
  
  
  
  module.exports =  {handleHallData,handleUpdatedeatils,handlepushHallData,handlehalldetails,handleHallRegis }