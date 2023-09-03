const express = require('express');
const APIRoutes = express.Router();
const {loginUser,getAccessToken,
    callback, generateDescription} = require('../controllers/APIController');


//login
APIRoutes.get('/login',loginUser);

//callback
APIRoutes.get('/callback',callback);

APIRoutes.get('/getAccessToken',getAccessToken);

APIRoutes.get('/generateDescription',generateDescription);


module.exports = APIRoutes;