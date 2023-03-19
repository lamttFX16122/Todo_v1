require('dotenv').config();
const express = require('express');
const Mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const MongoDbSession = require('connect-mongodb-session')(session);
//Import Route
const authenRouter = require('./routers/authentication.Router');
const userRouter = require('./routers/user.Router');
const workRouter = require('./routers/work.Router');
const { APP_PORT, DB_URL } = process.env;
const app = express();
// Use Cors
app.use(cors({ credentials: true, origin: 'http://localhost:9195' }));
app.use(cookieParser())
// Use body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use Router
app.use(authenRouter);
app.use('/v1', userRouter);
app.use('/v1', workRouter);
// PORT
const port = APP_PORT || 9198;
Mongoose.set('strictQuery', false);
Mongoose.connect(DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(connected => {
        app.listen(port, () => {
            console.log('Server running port ' + port);
        });
    })


