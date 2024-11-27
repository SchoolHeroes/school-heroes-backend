const express = require('express')
const cors = require('cors')

const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const { dbRouter } = require("./db");
const authRouter = require('./routes/api/auth')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://www.liqpay.ua',
  ],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}))
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/plain' }));

app.use(dbRouter);
app.use('/api/auth', authRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const {status = 500, message = 'Server error'} = err;
  res.status(status).json({ message })
})

module.exports = app
