const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '******-********-*******-*******';
const objectTypeId = '*********';



app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});


app.post('/update-cobj', async (req, res) => {
  const { name, lanuch_year, completed } = req.body;

  try {
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${objectTypeId}`,
      {
        properties: {
          name: name,
          lanuch_year: lanuch_year,
          completed: completed === 'true'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.redirect('/');

  } catch (error) {
    console.error(error);
  }
});


app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${objectTypeId}`,
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          'Content-Type': 'application/json'
        },
        params: {
          properties: 'name,lanuch_year,completed'
        }
      }
    );

    const data = response.data.results;

    res.render('home', {
      title: 'Homepage',
      data: data
    });

  } catch (error) {
    console.error(error);
  }
});




// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
