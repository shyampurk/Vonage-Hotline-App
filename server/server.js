const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nexmo = require('nexmo-client');

require('dotenv').config();

app.set('view engine', 'pug');

app.use(express.static('public'))
app.use('/modules', express.static('node_modules/nexmo-client/dist/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = app.listen(process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/auth/:userid', (req, res) => {
  let user_id = req.params.userid;
  console.log(`Authenticating ${req.params.userid}`)
  
  if ("john" === user_id) {
  
    return res.json(process.env.JWT_john);
  
  }
})

app.get('/webhooks/answer', (req, res) => {
  console.log("ANSWER:")

  console.log(req.query)
  let  toNumber = req.query.to;
  
  console.log(toNumber);
  var ncco;
  
  const text = "Transferring your call now.";
    ncco = [
      {
        "action": "talk",
        "text": text
      },
      {
        "action": "connect",
        "from": process.env.NEXMO_NUMBER,
        "endpoint": [{
          "type": "phone",
          "number": toNumber
        }]
      }]
  
  res.json(ncco);
});

app.post('/webhooks/event', (req, res) => {
  
  console.log("EVENT:")
  
  console.log(req.body)
  res.status(200).end()

});


