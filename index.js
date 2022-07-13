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
	password : 'AxU3a9w-azMC7LKzxrVJ^tu5qnM_98Eb',
	database : 'SqliDB'
};

var connection = mysql.createConnection(db_config);


connection.connect(function(err) {          // start connection and add flag     
    if(err) {                                     
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000);
    }
    var sql = "INSERT INTO users (User,Details) VALUES ('2JZmyhw*zFW+]F$!%^Y#9Pw-yxF[TPr7[CAh9@VWJ^&pxvv(&3A+sdVW+MWF!}JmY#2_>J}~J(_m%?ucHXL$Qz}jY>W$kFj7nfxV*D)ce@Tq/*(?4%@\iLVSy5a-DN{7', '" + flag + "' )";
    connection.query(sql, function (err, result) {
      if (err) handleDisconnect();
    });
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
  <p><a href="https://is.gd/hello109">hege@sus.com</a></p>
  </footer>`));
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
        res.send(tpl('Result', html));
      });
    } else {
      res.send(tpl('Fail', 'Your query failed <br>\'<b>' + search + '</b>\'')); // display failed sql query
    }
  });
});

app.listen(port, () => console.log(`Listening on http://0.0.0.0:${port}/`));
