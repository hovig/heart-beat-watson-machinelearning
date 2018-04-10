require('dotenv').config();

var express = require('express'),
    http = require('http'),
    app = express(),
    path = require('path'),
    cfenv = require("cfenv"),
    appEnv = cfenv.getAppEnv(),
    bodyParser = require('body-parser'),
    cloudant = require('@cloudant/cloudant'),
    pulse_info = null,
    dbname = "pulse_info",
    db_props = null;

var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.PORT || 3000);
var api = require('./routes/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', port);
app.use('/api', api);

if (process.env.VCAP_SERVICES) {
	var env = JSON.parse(process.env.VCAP_SERVICES);
	console.log(env);

	if (env["cloudantNoSQLDB"]) {
		db_props = env['cloudantNoSQLDB'][0]['credentials'];
		console.log(db_props);
	} else {
		console.log('You must bind the Cloudant DB to this application');
	}

	if (env["iotf-service"]) {
		iot_props = env['iotf-service'][0]['credentials'];
		console.log(iot_props);
	} else {
		console.log('You must bind the Internet of Things service to this application');
	}

  cloudant({account:db_props.username, password:db_props.password}, function(err, cloudant) {
    console.log('Connected to Cloudant');
    cloudant.db.list(function(err, all_dbs) {
       if (all_dbs.indexOf(dbname) < 0) {
          cloudant.db.create(dbname, function() {
              pulse_info = cloudant.use(dbname);
              console.log("created DB " + dbname);
          });
        } else {
          console.log("found DB " + dbname);
          pulse_info = cloudant.use(dbname);
        }
    })
  })
}

app.get('/api/:pulsedata', function(req, res) {
  if (process.env.VCAP_SERVICES) {
    device_info.insert({data: req.params.pulsedata, date: new Date()});
  }
});

app.listen(app.get('port'), function() {
  console.log('Server started at ' + host + ":" + port);
});

module.exports = app;
