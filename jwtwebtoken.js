const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "randomAbhinayi";
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

    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            foundUser = users[i];
        }
    }

    if (foundUser) {
        const token = jwt.sign({
            username: username
        }, JWT_SECRET);

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

app.get("/me", (req, res) => {
    const token = req.headers.token;

    try {
        const decodedInformation = jwt.verify(token, JWT_SECRET); // Decode token
        const username = decodedInformation.username;

        let foundUser = null;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                foundUser = users[i];
            }
        }

        if (foundUser) {
            res.json({
                username: foundUser.username,
                password: foundUser.password
            });
        } else {
            res.json({
                message: "Invalid token."
            });
        }
    } catch (err) {
        res.status(401).json({
            message: "Invalid or expired token."
        });
    }
});

app.listen(3000, () => {
    console.log(`Backend is running on port: ${3000}`);
});


