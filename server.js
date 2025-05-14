import express from 'express';
import Razorpay from 'razorpay';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import CORS

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: 'rzp_test_59tiIuPnfUGOrp',
  key_secret: '4u9ny5eo4R7waJNh3DVXshsU',
});

app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      key: 'rzp_test_59tiIuPnfUGOrp',
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).send('Failed to create Razorpay order.');
  }
});

app.post('/place-order', (req, res) => {
  const paymentDetails = req.body;
  console.log('Payment Details:', paymentDetails);
  // Save order details to the database
  res.send('Order placed successfully!');
});

app.post('/confirm-order', (req, res) => {
  const paymentDetails = req.body;
  console.log('Payment Details:', paymentDetails);
  // Save order details to the database
  res.send('Order confirmed successfully!');
});

app.post('/api/store-order', (req, res) => {
  const { items, totalAmount, name, phone, address, paymentId } = req.body;

  console.log('Order Details:', { items, totalAmount, name, phone, address, paymentId });
  // Save order details to the database (mocked here)
  res.send('Order stored successfully!');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
