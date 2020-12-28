const e = require('express');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheese burgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way')
});

app.get('/pizza/pineapple', (req, res) => {
    res.send('Ranch Is better on pizza, do that instead')
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
    `;
    res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end();
})

app.get('/greetings', (req, res) => {
    //1. get values from the request
    const name = req.query.name;
    const race = req.query.race;

    //2. Validate the values
    if (!name) {
        return res.status(400).send('Please Provide a Name');
    }
    if (!race) {
        return res.status(400).send('Please Provide a Race');
    }

    //4. and 5. both name and race are valid, so compile greeting
    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom`

    //6. Send the response
    res.send(greeting);
});

app.get('/sum', (req, res) => {
    const first = parseInt(req.query.a);
    const second = parseInt(req.query.b);

    if (!first || Number.isNaN(first)) {
        return res.status(400).send('Please enter a valid number a= to add for the first value')
    }
    if ((!second) || Number.isNaN(second)) {
        return res.status(400).send('Please enter a valid number b= to add for the second value')
    }
    const sum = first + second;
    res.send(sum.toString());
});

var caesarShift = function (str, amount) {
    // Wrap the amount
    if (amount < 0) {
        return caesarShift(str, amount + 26);
    }

    // Make an output variable
    var output = "";

    // Go through each character
    for (var i = 0; i < str.length; i++) {
        // Get the character we'll be appending
        var c = str[i];

        // If it's a letter...
        if (c.match(/[a-z]/i)) {
            // Get its code
            var code = str.charCodeAt(i);

            // Uppercase letters
            if (code >= 65 && code <= 90) {
                c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
            }

            // Lowercase letters
            else if (code >= 97 && code <= 122) {
                c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
            }
        }

        // Append
        output += c;
    }

    // All done!
    return output;
};

app.get('/cipher', (req, res) => {
    const text = req.query.text;
    const shift = parseInt(req.query.shift);

    if (!text) {
        return res.status(400).send('please enter a word to encode');
    }
    if (!shift || Number.isNaN(shift)) {
        return res.status(400).send('Please enter a valid number for encoding purposes')
    }

    const cipherText = caesarShift(text, shift)
    res.send(cipherText);
});

app.get('/lotto', (req, res) => {
    const lottoTicketString = req.query.arr;
    const lottoTicket = lottoTicketString.map(lotto => {
        return parseInt(lotto);
    })
    const overTwenty = (element) => element > 20;
    const twentyCheck = lottoTicket.some(overTwenty);
    const winningNumbers = [
        Math.floor(Math.random() * 20) + 1,
        Math.floor(Math.random() * 20) + 1,
        Math.floor(Math.random() * 20) + 1,
        Math.floor(Math.random() * 20) + 1,
        Math.floor(Math.random() * 20) + 1,
        Math.floor(Math.random() * 20) + 1,
    ];
    let result = '';

    if (!lottoTicket || lottoTicket.length != 6) {
        return res.status(400).send('Please enter 6 lotto ticket numbers "arr="')
    }
    if (twentyCheck) {
        return res.status(400).send('Lotto Numbers cannot be over 20, please try again')
    }

    const lottoCheck = lottoTicket.reduce((total, number) => {
        return total + winningNumbers.includes(number);
    }, 0)
    if (lottoCheck === 6) {
        result = "Congratulations! You win $100!";
    } else if (lottoCheck === 5) {
        result = "Congratulations! You win $100!";
    } else if (lottoCheck === 4) {
        result = "Congratulations, you win a free ticket";
    } else {
        result = "Sorry, you lose";
    }

    res.send(result);
})

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});