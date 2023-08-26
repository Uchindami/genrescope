const dotenv = require('dotenv').config();
const colors = require('colors');
const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const APIRoutes = require('./routes/APIRoutes');
const cors = require('cors');
const port = process.env.PORT;
const app = express();


app.use(cors());
app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', APIRoutes);


function startServer() {

    app.listen(port, (error) => {
        if (error) {
            console.error(`${error} did not connect`);
        } else {
            console.log(`Server started on port ${port}`.magenta);
            console.log(
                'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
            )
        }
    });
}

startServer();
