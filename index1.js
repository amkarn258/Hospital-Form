var http = require('http');
var express = require('express');
const path = require('path');
var app = express();
var bodyParser = require('body-parser');
var patientSchema = require('./mongodb_schemas/patient_info.model');
var hbs = require('express-handlebars');
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname}));
app.set('veiws', path.join(__dirname + ''));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function(req, res, next) {
    res.render('index');
});
app.get('/', function(req, res, next) {
    patientSchema.find()
    .then(patients => res.json(patients))
    .catch(err => res.status(400).json('Error: ' + err));
});
app.post('/insert', function(req, res, next) {
    const name = req.body.Name;
    const Sickness = req.body.Sickness;
    const Doctor = req.body.Doctor;
    const date = req.body.date;
    const newPatient = new patientSchema({
        Name: req.body.Name,
        Sickness: req.body.Sickness,
        Doctor: req.body.Doctor,
        date: req.body.date
    });
    //console.log(newPatient);
    newPatient.save()
   .then(() => res.json('Patient added!'))
   .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/:id', function(req, res, next) {
    patientSchema.findById(req.params.id)
    .then(patient => res.json(patient))
    .catch(err => res.status(400).json('Error: ' + err));
});


app.listen(8000);