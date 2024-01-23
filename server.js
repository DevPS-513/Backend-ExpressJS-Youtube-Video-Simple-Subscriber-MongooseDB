const express = require('express')
const app =express()
const mongoose = require('mongoose')

const PORT =  3000;

require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',(error)=> console.error(error))
db.once('open',()=> console.log('Connected to mongoose database'))

// Middleware for API key authentication
function authenticateAPIKey(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const apiKey = auth[1];
      if (apiKey === process.env.API_KEY) {
        next();
      } else {
        res.status(403).json({ message: 'Invalid API key' });
      }
    } else {
      res.status(401).json({ message: 'No API key provided' });
    }
  }

app.use(express.json())
//app.use(authenticateAPIKey);

const subscriberRoutes = require('./routes/subscribers')
app.use('/subscribers',subscriberRoutes)

app.listen(PORT, () => console.log(`Message: Subscriber Server Started at http://127.0.0.1:${PORT}subscribers/`))