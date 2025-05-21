const express = require('express');
const apiRouters = require('./routes')

const app = express();
const PORT = process.env.PORT;

app.use(apiRouters)


// As our server to listen for incoming connections
app.listen(80, () => console.log(`Server listening on port: ${PORT}`));