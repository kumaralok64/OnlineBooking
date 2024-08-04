const Stripe = require('stripe');

const stripe = Stripe(process.env.Stripe_SecretKey);

module.exports = stripe;