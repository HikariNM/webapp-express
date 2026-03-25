const express = require("express");
const cors = require('cors');
const app = express();
const port = 3000;

const movieRouter = require('./routers/movieRouter');
const notFound = require('./middlewares/notFound');
const errorsHandler = require('./middlewares/errorsHandler');

app.use(cors({ origin: process.env.FE_URL }));

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome!');
})

app.use('/movies', movieRouter);

app.use(notFound);
app.use(errorsHandler);


app.listen(port, () => {
    console.log(`Express listening at http://localhost:${port}/`);
});