const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Init Nexmo
const nexmo = new Nexmo({
  apiKey: '8196a2b6',
  apiSecret: 'xO4syW8tIdwG605H'
}, {debug: true});

// Init app
const app = express();

// Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// BEGINNING OF OPTION FOR SENDING TEXT FROM VIEW, COMMENT OUT 1/2

// The options
const options = [
  'Meh',
  'Good',
  'Great!'
];

// The message
let notification = "How was your experience? " + "type 1 , 2 or 3: \n\n";

options.forEach((option, index) => {
  notification += `${index+1}. for ${option}\n`;
});

// Send the message from code to submitted phone
app.post('/', (req, res) => {
  send(req.body.number, notification);
  response.send('Notification sent');
});

let send = function(number, content) {
  nexmo.message.sendSms(
    '13862192630',
    number,
    content
  );
}

// END OF OPTION FOR SENDING TEXT FROM CODE

// Index route
app.get('/', (req, res) => {
  res.render('index');
});

// BEGINNING OF OPTION FOR SENDING TEXT FROM VIEW, COMMENT OUT 1/2

// Catch form submit
// app.post('/', (req, res) => {
//   // res.send(req.body);
//   // console.log(req.body);
//   const number = req.body.number;
//   const text = req.body.text;
//
//   nexmo.message.sendSms(
//     '13862192630', number, text, {type: 'unicode' },
//     (err, responseData) => {
//       if(err) {
//         console.log(err);
//       } else {
//         console.dir(responseData);
//
//         // Get data from the response
//         const data = {
//           id: responseData.messages[0]['message-id'],
//           number: responseData.messages[0]['to']
//         }
//
//         // Emit to the client
//         io.emit('smsStatus', data);
//       }
//     }
//   );
// });

// END OF OPTION FOR SENDING TEXT FROM VIEW

// End point for webhook to call
app.get('/response', (req, res) => {
  // TODO: Confirm selection
  res.send('Response processed');
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => console.log(`Server started on ${ PORT }`);

// Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
  console.log('Connected');
  io.on('disconnect', () => {
    console.log('Disconnected');
  })
})
