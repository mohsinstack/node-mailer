const express = require('express');
const nodemailer = require('nodemailer');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser'); 
const path = require('path');
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static Folder

app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Request
app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) =>{
    const output =`
    <p> You have got a new lead </p>
    <h3> Contact Details </h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Name: ${req.body.company}</li>
        <li>Name: ${req.body.email}</li>
        <li>Name: ${req.body.phone}</li>
    </ul>
    <h4>Message:</h4>
   <p> ${req.body.message}</p>
    ` ;

    let transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'your email', // generated ethereal user
            pass: 'password' // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <you email>', // sender address
        to: 'destination', // list of receivers
        subject: 'Node Mailer Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('contact', {msg:'Email Has been Sent'});
    });

    console.log(req.body);
});

app.listen(3000, ()=> {

    console.log('server Started .....');
});