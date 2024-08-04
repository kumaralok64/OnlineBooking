const express = require('express');
const webhookrouter = express.Router();
const stripe = require('../Config/stripe'); // Your Stripe configuration
const Hall_model = require('../models/Hall'); // Your Hall model


webhookrouter.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Get this from Stripe Dashboard
  let event;

  // Stripe requires raw body for signature verification
  const payloadString = JSON.stringify(req.body); // Corrected JSON usage
  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: endpointSecret
  });

  try {
    event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Metadata from Session:', session.metadata);

    const { hallId, seat_number } = session.metadata;

    try {
        const hall = await Hall_model.findById(hallId);
        if (!hall) {
            console.error(`Hall with ID ${hallId} not found.`);
            return res.status(404).send('Hall not found.');
        }

        const seats = JSON.parse(seat_number);

        seats.forEach(async (seat) => {
            const { row, col, seatNumber } = seat;
           console.log(row,col,seatNumber);
            const seatIndex = hall.seats.findIndex(
                s => s.row === row && s.col === col
            );
            console.log("seatIndex",seatIndex);
            hall.seats[seatIndex].set({
              status:'booked'
            })

            
        });

        await hall.save(); // Save the updated hall object
        console.log(`Seats booked for Hall ${hallId}.`);
    } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).send('Internal Server Error');
    }
} else {
    console.log(`Unhandled event type ${event.type}`);
}
 res.status(200).send({ received: true });
});

module.exports = webhookrouter;
