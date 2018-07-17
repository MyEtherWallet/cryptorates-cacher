var express = require('express')
const getPort = require('get-port')
const fetch = require('node-fetch')
const cors = require('cors')
var app = express()

app.use(cors())

var cache = {}
var gPairs = {}
setInterval(() => {
    fetch('https://api.coinmarketcap.com/v2/ticker/')
        .then(res => res.json())
        .then((json) => {
            cache = json
            let prices = cache['data']
            for (let price in prices) gPairs[prices[price].symbol] = prices[price]
        })
}, 5000)

app.get('/ticker', async function(req, res) {
    res.setHeader('Content-Type', 'application/json')
    try {
        if (!req.query.filter) {
            res.send(JSON.stringify(cache, null, 3))
        } else {
            let pairs = req.query.filter.split(',')
            let valid = true
            if (req.query.strict) {
                valid = await validatePairs(pairs)
            }
            if (valid) {
                let tCache = await processPairs(pairs)
                res.send(JSON.stringify(tCache, null, 3))
            } else {
                res.send(JSON.stringify({
                    error: true,
                    message: "invalid pairs"
                }, null, 3));
            }
        }
    } catch (e) {
        res.send(JSON.stringify({
            error: true,
            message: e
        }, null, 3));
    }

})
app.get('/meta', function(req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(cache.metadata, null, 3))
})

getPort({
    port: 41543 // process.env.PORT || 8080
}).then(port => {
    var server = app.listen(port, function() {
        var host = server.address().address
        var port = server.address().port
        console.log('Server running and listening at http://%s:%s', host, port)
    })
})

let processPairs = function(pairs) {
    return new Promise((resolve, reject) => {
        try {
            let tCache = Object.assign({}, cache)
            tCache.data = {}
            pairs.forEach((_pair) => {
                console.log(_pair) // todo remove dev item
                if (typeof gPairs[_pair] !== 'undefined') {
                    tCache.data[_pair] = gPairs[_pair]
                }
            })
            resolve(tCache)
        } catch (e) {
            console.log(e) // todo remove dev item
            reject(e)
        }
    })
}

let validatePairs = function(pairs) {
    return new Promise((resolve, reject) => {
        console.log(gPairs) // todo remove dev item
        for (let i = 0; i < pairs.length; i++) {
            console.log(gPairs[pairs[i]]) // todo remove dev item
            if (typeof gPairs[pairs[i]] === 'undefined') reject('invalid pairs')
        }
        resolve(pairs)
    })
}