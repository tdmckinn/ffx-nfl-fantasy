import express from 'express'
import axios from 'axios'

const router = express.Router()

const NFX_DRAFT_KEY = process.env.NFX_DRAFT_KEY
const api = 'https://www.fantasyfootballnerd.com/service/'

router.get('/draft-rankings', (req, res) => {
  axios.get(`${api}players/json/${NFX_DRAFT_KEY}`).then(({ data }) => {
    res.json(data)
  })
})

router.get('/players', (req, res) => {
  axios.get(`${api}players/json/${NFX_DRAFT_KEY}`).then(({ data }) => {
    res.json({
      Players: data.Players.filter(player => player.active === '1'
        && player.dob !== '0000-00-00').slice(0, 100)
    })
  }).catch(() => { res.json('error') })
})

router.get('/weather', (req, res) => {
  axios.get(`${api}draft-rankings/json/${NFX_DRAFT_KEY}`).then(({ data }) => {
    res.json(data)
  })
})

export default router
