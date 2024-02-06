require('dotenv').config();
const express = require('express');
const app = express();
const index = require('./routes/index');
const cors=require("cors");

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions));
app.listen('3000', () => {
    console.log('Listening on PORT 3000');
});

app.use('/', index);