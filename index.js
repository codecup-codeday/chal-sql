const express = require('express');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const genericWebsite = require('@srnd/codecup-genericwebsite');

const port = process.env.PORT || 8080;
const flag = process.env.FLAG || 'test';
const tpl = genericWebsite.randomTemplate(flag);
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connection deets
const db_config = {
	host     : 'localhost',
	user     : 'sqli-user',
	password : 'sKLngsJkZjy&rFHUzFATDJsCFx~e5QucuTde3Rkcextw&Ahg92t9QW^aZDdNuL4y%rzPs',
	database : 'SqliDB'
};

var connection = mysql.createConnection(db_config);


connection.connect(function(err) {          // start connection
    if(err) {                                     
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000);
    }
});

function handleDisconnect() {          // handles any disconnects from mysql
  connection = mysql.createConnection(db_config);

  connection.connect(function(err) {              
    if(err) {                                     
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000);
    }
  });

  connection.on('error', function(err) {
    console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
          handleDisconnect();                         
      } else {                                      
          throw err;
      }
  });
}

app.get('/', (req, res) => { // simple search form
  res.send(tpl('Search', `
	<h1>Search the Database</h1>
	<form action = "/search" method = "POST">
	<input type = "text" name = "search" align = "justify"/><br><br>
	<input type = "submit" value="Search" />
	</form>
  <footer>
  <p>Contact: Hege Refsnes</p>
  </footer>
  <div style="height: 150px"></div>`));
});

let search = '';
app.post('/search', (req, res) => {
  search = req.body.search;
  res.redirect('/result');
});


app.get('/result', function(req,res) {
  var sql = `SELECT * FROM users WHERE User='${search}';`; // SQL query syntax checking for matching user
  connection.query(sql, function(err, results, fields){ // do the query
    if (err) handleDisconnect();
    if (results) {
      res.render("/www/views/user-list.ejs", { userData: results }, function(err,html){ // render output as table
        if (err) throw err;
        res.send(tpl('Result', `
        <h1>Search the Database</h1>
        <form action = "/search" method = "POST">
        <input type = "text" name = "search" align = "justify"/><br><br>
        <input type = "submit" value="Search" />
        </form>`+ html + `<footer>
        <p>Contact: Hege Refsnes</p>
        </footer>
        <div style="height: 150px"></div>`));
      });
    } else {
      res.send(tpl('Fail', 'Your query failed <br><b>SELECT * FROM users WHERE User=\'' + search + '\';</b> <br>' + err)); // display failed sql query┬─┬﻿
    }
  });
});

app.listen(port, () => console.log(`Listening on http://0.0.0.0:${port}/`));