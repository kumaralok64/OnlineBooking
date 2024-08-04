const stripe = require('../Config/stripe');

// Controller to handle payment processing
const paymentController = async (req, res) => {
    try {
        const { id, hallName, hallLoc, movieName, date, time, price, seats } = req.body;

        console.log("Received Reservation Data:", req.body);

        // Get user details from the request object (attached by middleware)
        const user = req.user;
        if (!user) throw new Error('Please login.');

        // Check if seats array is valid
        if (!seats || seats.length === 0) {
            throw new Error('No seats provided for reservation.');
        }

        // Define seatPrice to ensure it meets the minimum amount requirement
        const seatPrice = price * 100; // Convert price to smallest unit (e.g., cents for INR)

        // Create line items array
        const lineItems = seats.map(seat => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: `Seat ${seat.seatNumber} Reservation`,
                 
                },
                unit_amount: seatPrice,
            },
            adjustable_quantity: {
                enabled: true,
                minimum: 1,
            },
            quantity: 1
        }));

        // Log the line items to debug
        console.log("Line Items:", lineItems);

        // Prepare Stripe session parameters
        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            customer_email: user.email,
            line_items: lineItems,
            metadata: {
                hallId: id,
                movie_name: movieName,
                date: date,
                time: time,
                hall_name: hallName,
                hall_location: hallLoc,
                seat_number: JSON.stringify(seats)
            },
            success_url: `${process.env.frontend_url}/success`,
            cancel_url: `${process.env.frontend_url}/cancel`,
        };

        // Log the session parameters to debug
        console.log("Stripe Checkout Session Params:", params);

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create(params);

        // Respond with the session details
        res.status(200).json(session);
    } catch (err) {
        console.error("Error:", err);
        return res.status(400).json({
            success: false,
            message: err.message || err,
            error: true
        });
    }
};

// Export the payment controller
module.exports = { paymentController };
