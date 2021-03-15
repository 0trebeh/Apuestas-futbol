const server = require('./server');

PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log('Server in port: ' + PORT);
});