const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./routes/User');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const Hallroutes = require("./routes/Hall");
const  Paymentroutes = require('./routes/payment');
const { createServer } = require('node:http');
const { initializeSocket } = require('./Config/Socket');
const { ConnectionTOdb } = require('./Config/mongodb');
const cookieParser = require('cookie-parser');
const {Details} = require('./Middlewares/User');
const webhookrouter = require('./routes/webhook');
require('./auth/goggle');
const app = express();
const PORT = 8000 || process.env.PORT;
const server = createServer(app);
// Initialize Socket.IO
initializeSocket(server);
app.use(cors({
  origin: process.env.frontend_url,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());


// Routes
app.use('/User', router);
app.use('/api/auth', authRoutes);
app.use('/hall', Hallroutes);
app.use('/CreatePayment',Details,Paymentroutes);
app.use('/',webhookrouter)
const url = process.env.MONGODB_URI;

ConnectionTOdb(url).then(() => {
  console.log('Connected to db at port 27017');
  server.listen(PORT, () => {
    console.log(`Server is Running at PORT ${PORT}`);
  });
}).catch((err) =>
  console.log('Error Occurred while connecting to db', err)
);
