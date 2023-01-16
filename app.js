const express = require('express')
const fs = require('fs')
const app = express()
const port = 80


app.use(express.static('public'));
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', 'public')

app.get('/', function (req, res) {
    res.render('login');
});

app.get('/user', (req, res) => {
    res.render('user', { name: req.query })
})

app.get('/register', (req, res) => {
    fs.readFile('./province.json', (err, data) => {
        const listObj = JSON.parse(data);
        if (err) {
            res.status(400).send('Error List not found');
        } else {
            res.render('register', { lists: listObj });
        }
    });
})

app.post('/addUser', async (req, res) => {
    let data = req.body
    const datajson = await JSON.parse(fs.readFileSync('data.json'))
    datajson.push(data)
    fs.writeFileSync('data.json', JSON.stringify(datajson))
    res.send('succees')
})


app.post('/login', (req, res) => {
    let find = false
    const data = JSON.parse(fs.readFileSync('data.json'))
    data.filter(element => {
        if ((req.body.Email === element.Email) && (req.body.Password === element.Password)) {
            find = true
            return res.status(200).json({
                status: 'pass',
                body:element
            })
        }
    });
    if(find === false){
        return res.status(400).json({
                status: '0'
            })
    }
})


app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
