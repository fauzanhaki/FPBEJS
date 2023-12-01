const express = require('express'),    
      dotenv = require('dotenv'),    
      router = require('./router'),
      errorHandling = require('./middleware/errorHandling')

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json({ strict: false }));

// ini router utama
app.use('/api/v1', router);

//middleware error handling
app.use(errorHandling)
// Handle 404 route
app.get('*', (req, res) => {
    return res.status(404).json({
        error: 'End point is not registered'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });

