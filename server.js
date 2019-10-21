// Allows us to place keys and sensitive info in hidden .env file
require("dotenv").config();

// Require Packages
const express = require("express");
const app = express();
const db = require("./models");
const routes = require("./routes");
const passport = require("passport");
const session = require("express-session")
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors")



require("./config/passport")(passport)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
let options = {};
if (process.env.NODE_ENV === 'production') {
    options = {
        host: process.env.HOST,
        port: 3306,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DB
    }
} else {
    options = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'tracker'
    }
}


// Options for mysql session store

let sessionStore = new MySQLStore(options);

// Pass in mysql session store
app.use(session({
    key: 'surfing_dogs',
    secret: 'surfing_dogs',
    store: sessionStore,
    cookie: {
        httpOnly: false,
        secure: false,
    },
    resave: true,
    saveUninitialized: true
}))

// let allowedOrigins = ['http://localhost:3000', 'https://youthful-shockley-623377.netlify.com']

// app.use(cors({
//     credentials: true,
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true)
//         if (allowedOrigins.indexOf(origin) === -1) {
//             var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     }
// }))

var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));


// app.use((req, res, next) => {
//     res.append('Access-Control-Allow-Origin', ['https://youthful-shockley-623377.netlify.com']);
//     res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.append('Access-Control-Allow-Headers', 'Content-Type');
//     res.append('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(passport.initialize());
app.use(passport.session());

app.use(routes)

db.sequelize.sync({ force: false }).then(() => {
    let server = app.listen(process.env.PORT || 5000, function () {
        let port = server.address().port;
        console.log(`Server is listening on PORT ${port}`)
    })
})
