var http = require('https');
var express = require('express');
const path = require('path');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;0
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
var hbs = require('handlebars');
var expressHandlebars = require('express-handlebars');

/*hbs.registerHelper('select', function(value, options) {
  // Create a select element 
  var select = document.createElement('select');

  // Populate it with the option HTML
  select.innerHTML = options.fn(this);

  // Set the value
  select.value = value;

  // Find the selected node, if it exists, add the selected attribute to it
  if (select.children[select.selectedIndex])
      select.children[select
        .selectedIndex].setAttribute('selected', 'selected');

  return select.innerHTML;
});*/
hbs.registerHelper('select', function(selected, option) {
  return (selected == option) ? 'selected="selected"' : '';
});

//const {select} = require('./helpers/handlebars_helpers');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;
var logger = require('morgan');
var patientDataSchema = new Schema({
  Name: String,
  Sickness: String,
  Doctor: String
}, {collection: 'patient-data'});
var doctorDataSchema = new Schema({
  doctName: String,
  Speciality: String,
  Patients: Array
}, {collection: 'Doctor-data'});
var PatientData = mongoose.model('PatientData', patientDataSchema);
var doctorData = mongoose.model('DoctorData', doctorDataSchema);
require('dotenv').config();
app.use(cors());
app.use(express.json());

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { Db } = require('mongodb');
//hbs.registerHelper('select', function(selected, options) {
  //return options.fn(this).replace(
    //  new RegExp(' value=\"' + selected + '\"'),
      //'$& selected="selected"');
//});
app.engine('hbs', expressHandlebars({extname: 'hbs',
  defaultLayout: 'layout',
  handlebars: allowInsecurePrototypeAccess(hbs)//, helpers: {select: select}
}));
app.set('view engine', 'hbs');

app.set('veiws', path.join(__dirname + 'views'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res, next) {
  doctorData.find()
  .then(function(doc){
    res.render('index', {items: doc});
  });
});
app.post('/', function(req, res, next) {
  const newDoctor = {
    doctName: req.body.doctName,
    Speciality: req.body.Speciality,
    Patients: []
  };
  var currentDoct = new doctorData(newDoctor);
  currentDoct.save();
  res.send("Doctor Added Successfully");
});
app.route('/loadData.hbs').get((req,res, next) => {
  PatientData.find()
  .then(function(doc){
    res.render('loadData', {items: doc});
  });
});
app.route('/insert').post((req, res) => {
  const newPatient = {
    Name: req.body.Name,
    Sickness: req.body.Sickness,
    Doctor: req.body.Doctor,
  };
  var current_patient = new PatientData(newPatient);
  current_patient.save();
  //Db.doctorData.updateOne({})
  res.send('Patient Added');
});
app.get('/insert', function(req, res, next) {
  res.render('index');
});

app.listen(8000);