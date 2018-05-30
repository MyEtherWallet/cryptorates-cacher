var express = require('express');
const getPort = require('get-port');
const fetch = require('node-fetch');
var app = express();
var cache = {};

setInterval(() => {
    fetch('https://api.coinmarketcap.com/v2/ticker/')
        .then(res => res.json())
        .then((json) => {
            cache = json;
        });
}, 5000)

app.get('/ticker', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(cache, null, 3));
})
app.get('/meta', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(cache.metadata, null, 3));
})

getPort({
    port: 8080
}).then(port => {
    var server = app.listen(port, function() {
        var host = server.address().address
        var port = server.address().port
        console.log("Server running and listening at http://%s:%s", host, port)
    })
});