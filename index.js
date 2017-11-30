const https = require("https")
const express = require("express")
const app = express()
const fs = require("fs")

const path = require("path")

app.use(express.static('static'))

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, 'static/index.html'))
})

app.listen(3000, () => {console.log("HTTP server listening")})

https.createServer({
	key: fs.readFileSync('./ssl/server.key'),
	cert: fs.readFileSync('./ssl/server.crt'),
	requestCert: false,
	rejectUnauthorized: false
}, app).listen(3001, () => {
	console.log("HTTPS server listening")
})