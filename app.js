const express = require('express');
const cors = require('cors');
const session = require('express-session');

const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { apiLimiter } = require('./middlewares/limiter');
const { detectLangByHeader } = require('./middlewares');
const intervalTask = require('./helpers/intervalTask');

const { dbRouter } = require("./db");
const authRouter = require('./routes/api/auth')

const app = express()

app.set('trust proxy', true);
app.use(apiLimiter);
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://www.liqpay.ua',
  ],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/plain' }));

app.use(session({
    secret: process.env.SESSION_SECRET_KEY, 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));
app.use(detectLangByHeader);

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

intervalTask();

module.exports = app
