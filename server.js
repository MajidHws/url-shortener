const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const app = express()
const ShortUrl = require('./models/shortUrl')

const PORT = process.env.PORT || 5000

mongoose.connect('mongodb://localhost/urlShortener', {
    useUnifiedTopology: true, useNewUrlParser: true
})

app.use(express.static(path.join(__dirname, './public')));
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrls = await ShortUrl.findOne({short: req.params.shortUrl})
    
    if(!shortUrls) return res.sendStatus(404)

    shortUrls.clicks++
    shortUrls.save()

    res.redirect(shortUrls.full)
})

app.listen(PORT, () => console.log('SERVER IS UP AND RUNNING.'))