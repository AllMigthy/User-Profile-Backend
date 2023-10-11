const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const dotenv =require('dotenv')
const app = express();
dotenv.config()
// Connect to MongoDB
main().catch((err) => console.error(err));

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes.router);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
