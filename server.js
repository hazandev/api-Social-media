const express = require('express')
const cors = require('cors')
const path = require('path')
const expressSession = require('express-session');
const helmet = require("helmet")

const app = express()
const http = require('http').createServer(app)

const session = expressSession({
    secret: 'coding is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
// Express App Config
app.use(express.json());
app.use(helmet());
app.use(session);
// app.use(express.json({limit: '200mb'}));
// app.use(express.urlencoded({limit: '200mb', parameterLimit: 50000, extended: true}));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

const userRoutes = require('./api/user/user.routes')
const authRoutes = require('./api/auth/auth.routes')

const { connectSockets } = require('./services/socket.service')

// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

// TODO: check with app.use
app.get('/api/setup-session', (req, res) => {
    req.session.connectedAt = Date.now()
    console.log('setup-session:', req.sessionID);
    res.end()
})


app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

connectSockets(http, session)


// Make every server-side-route to match the index.html
// So when requesting http://localhost:3030/index.html/car/123 it will still respond with
// Our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})



const logger = require('./services/logger.service')
const port = process.env.PORT || 8080
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})




