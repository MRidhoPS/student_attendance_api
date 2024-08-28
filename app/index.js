const express = require('express');
const cors = require('cors')
const app = express();
const routes = require('./routes/routes')
app.use(express.json());


const port = 2000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Mengizinkan semua metode HTTP
    allowedHeaders: ['Content-Type', 'Authorization'] // Mengizinkan header yang diperlukan
}));
app.use(express.json());
app.use('/api', routes)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;