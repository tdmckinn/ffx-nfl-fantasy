const express = require('express')
const axios = require('axios')

const router = express.Router()

const NFL_DRAFT_KEY = process.env.NFL_DRAFT_KEY || 'gynxnqczrsmq'
const api = 'https://www.fantasyfootballnerd.com/service/'

router.get('/draft-rankings', (req, res) => {
  axios.get(`${api}players/json/${NFL_DRAFT_KEY}`).then(({ data }) => {
    res.json(data)
  })
})

router.get('/players', (req, res) => {
  axios.get(`${api}players/json/${NFL_DRAFT_KEY}`).then(({ data }) => {
    res.json({
      Players: data.Players.filter(player => player.active === '1'
        && player.dob !== '0000-00-00').slice(0, 100)
    })
  }).catch((e) => { res.json('error') })
})

router.get('/weather', (req, res) => {
  axios.get(`${api}draft-rankings/json/${NFL_DRAFT_KEY}`).then(({ data }) => {
    res.json(data)
  })
})

module.exports = router
