const { Server } = require('socket.io');
const Hall_model = require("../models/Hall");
const frontend_URL = process.env.frontend_url;
let io;

async function hallLayout(id) {
  try {
    const hall = await Hall_model.findById({ _id: id });
    if (!hall) throw new Error("Hall ID doesn't exist");
    return hall.seats;
  } catch (err) {
    console.error("Error fetching hall layout:", err.message || err);
    return [];
  }
}

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: frontend_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    console.log('Socket ID:', socket.id);

    socket.on('joinRoom', async (hallId) => {
      socket.join(hallId);
      const seats = await hallLayout(hallId);
      if (seats.length > 0) {
        socket.emit('hallLayout', seats);
      } else {
        console.error("No seats data to emit for hallId:", hallId);
      }
      console.log(`Socket ID: ${socket.id} joined room: ${hallId}`);
      socket.emit('joinedRoom', `Successfully joined room with Hall ID: ${hallId}`);
    });

    socket.on('reserveSeats', async ({ hallId, seats }) => {
      try {
        const hall = await Hall_model.findById(hallId);
        if (!hall) {
          console.error("Hall ID doesn't exist");
          return;
        }
      
        const updatedSeats = hall.seats.map((seat) => {
          const isSelected = seats.some(
            (s) => s.row === seat.row && s.col === seat.col
          );
          if (isSelected && seat.Available) {
            seat.status = "Reserved";
          }
          return seat;
        });

        await Hall_model.updateOne({ _id: hallId }, { seats: updatedSeats });

        // Emit updated seats to all clients in the room
        io.to(hallId).emit('seatUpdated', updatedSeats);

        // Set a timeout to check the seat status after 5 minutes
        setTimeout(async () => {
          const hallAfter5Minutes = await Hall_model.findById(hallId);
          const seatsToUpdate = hallAfter5Minutes.seats.map((seat) => {
            const isReserved = seats.some(
              (s) => s.row === seat.row && s.col === seat.col && seat.status === "Reserved"
            );
            if (isReserved) {
              // If seat is still reserved, release it
              seat.status = "Available";
              seat.Available = true;
            }
            return seat;
          });

          await Hall_model.updateOne({ _id: hallId }, { seats: seatsToUpdate });

          // Emit updated seats to all clients in the room
          io.to(hallId).emit('seatUpdated', seatsToUpdate);
        }, 1 * 60 * 1000); // 5 minutes in milliseconds
      } catch (error) {
        console.error("Error during reservation:", error.message || error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = {
  initializeSocket,
};
