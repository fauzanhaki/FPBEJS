const express = require('express'),
    dotenv = require('dotenv'),
    router = require('./router'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    errorHandling = require('./middleware/errorHandling'),
    swaggerUi = require("swagger-ui-express");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

// Dokumentasi
const swaggerDocument = require('./docs/main.json'); 

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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

