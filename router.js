import express from 'express'
import axios from 'axios'

import players from './data/players.json'

const router = express.Router()

const NFX_DRAFT_KEY = process.env.NFX_DRAFT_KEY

const api = 'https://www.fantasyfootballnerd.com/service/'

// router.get('/draft-rankings', (req, res) => {
//   axios.get(`${api}players/json/${NFX_DRAFT_KEY}`).then(({ data }) => {
//     res.json(data)
//   })
// })

router.get('/players', (req, res) => {
  axios.get(`${api}players/json/${NFX_DRAFT_KEY}`).then(({ data }) => {
    if (!data.Error) {
      res.json({
        Players: data.Players.filter(player =>
          player.active === '1'
          && player.dob !== '0000-00-00'
        ).slice(0, 100)
      })
    } else {
      res.json({
        Players: players.DraftRankings
      })
    }
  }).catch((error) => {
    res.json({
      error,
      NFX_DRAFT_KEY
    })
  })
})

router.get('/draft-rankings', (req, res) => {
  axios.get('https://api.apify.com/v1/execs/sL3skwcx7D3ob3ZdZ/results?format=json&simplified=1').then(({ data }) => {
    res.json({ DraftRankings: data })
  })
})


export default router
