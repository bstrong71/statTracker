const express     = require('express');
const routes      = require('./routes/index');
const morgan      = require('morgan');
const bodyParser  = require('body-parser');
const passport    = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const model       = require('./models/index');
const app         = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use('/api', routes);

app.use(routes);

app.listen(3000, function() {
  console.log("App is running on localhost:3000");
});
