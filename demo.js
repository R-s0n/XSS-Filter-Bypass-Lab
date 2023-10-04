const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }))

let storedName = "Robert Plant";
let lastVisitorIp = "127.0.0.1";

app.get('/', (req, res) => {
    const proxyIp = req.headers['x-forwarded-for'];
    lastVisitorIp = proxyIp || req.ip;
    console.log("New visitor from " + lastVisitorIp)
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Learn More About Cross-Site Scripting (XSS)</title>
    </head>
    <body>
        <h1>Welcome to our website!</h1>
        <p>We hope this demo helps you "Learn More About Cross-Site Scripting (XSS)"</p>
    </body>
    </html>
  `;
  res.send(htmlContent);
});

app.get('/reflected', (req, res) => {
    const name = req.query.name || "Taylor Swift";
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Reflected XSS Demo</title>
    </head>
    <body>
        <h1>Welcome to our website!</h1>
        <p>Thanks for visiting, ${name}!</p>
    </body>
    </html>
  `;
  res.send(htmlContent);
});

app.get('/stored', (req, res) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Stored XSS Demo</title>
    </head>
    <body>
        <h1>Welcome to our website!</h1>
        <p>Tell us your name and we will remember it the next time you come!</p>
        <form action="/storedName" method="post">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <br>
        <input type="submit" value="Submit">
    </form>
    <h3>Previous Visitor: ${storedName}
    </body>
    </html>
  `;
  res.send(htmlContent);
});

app.post('/storedName', (req, res) => {
    storedName = req.body.name;
    res.redirect('/stored');
});

app.get('/dom', (req, res) => {
    const currentDirectory = process.cwd();
    res.sendFile(`${currentDirectory}/demo.html`);
});

app.get('/blind', (req, res) => {
    const username = req.query.username || "guest";
    if (username !== "admin") {
        res.status(403);
        res.send('You do not have permission to access this page!')
    } else {
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Blind XSS Demo</title>
        </head>
        <body>
            <h1>Welcome back, admin!</h1>
            <p>The most recent user that visited our homepage: ${lastVisitorIp}</p>
        </body>
        </html>
      `;
      res.send(htmlContent);
    
    }
});

const PORT = process.env.PORT || 9998;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});