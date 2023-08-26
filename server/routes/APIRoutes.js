const express = require('express');
const APIRoutes = express.Router();
const {loginUser,getAccessToken,callback} = require('../controllers/APIController');


//login
APIRoutes.get('/login',loginUser);

//callback
APIRoutes.get('/callback',callback);

APIRoutes.get('/getAccessToken',getAccessToken);

module.exports = APIRoutes;