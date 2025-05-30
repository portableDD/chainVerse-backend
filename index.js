const express = require('express');
const certificateRoutes = require('./routes/certificates');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/certificates', certificateRoutes);
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
  res.send('ChainVerse Certificate API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
