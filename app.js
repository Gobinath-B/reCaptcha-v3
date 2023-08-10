const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

const recaptchaSecretKey = '6LeSxJYnAAAAAFbx0BPKvylr9YNgL8SxdcfwUwDc';

app.get('/',(req,res)=>{

    res.render('index');
});

app.post('/verify', async (req, res) => {
  const { token } = req.body;

 

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: recaptchaSecretKey,
          response: token,
        },
      }
    );
    console.log(response);
    const { success, score } = response.data;
   

    if (success && score >= 0.5) {
      // reCAPTCHA verification successful
      res.json({ success: true });
    } else {
      // reCAPTCHA verification failed
      res.status(400).json({ success: false, message: 'reCAPTCHA verification failed.' });
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
