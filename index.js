const express = require("express");

const app = express();
app.use(express.json());

const users = [];

function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (users.find(u => u.username === username)) {
        res.json({
            message: "You are already signed up"
        });
        return; 
    }

    users.push({
        username: username,
        password: password
    });

    res.send({ message: "You have signed up" });
});

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(function (u) {
        return u.username === username && u.password === password;
    });

    if (user) {
        const token = generateToken();
        user.token = token;
        res.json({
            token: token
        });
    } else {
        res.status(403).send({
            message: "Invalid Username or Password"
        });
    }
    console.log(users);
});

app.get('/me', (req, res) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(400).json({ message: "Token is required." });
    }

    const foundUser = users.find(u => u.token === token);

    if (foundUser) {
        res.json({
            username: foundUser.username,
            password: foundUser.password
        });
    } else {
        res.status(403).json({
            message: "Invalid token."
        });
    }
});



app.listen(3000, () => {
    console.log(`Backend is running on port: ${3000}`);
});