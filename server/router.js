import express from 'express'
import axios from 'axios'

const router = express.Router()
const NFX_DRAFT_KEY = process.env.NFX_DRAFT_KEY
const api = 'https://www.fantasyfootballnerd.com/service/'

router.get('/draft-rankings', (req, res) => {
  axios.get('https://api.apify.com/v1/execs/sL3skwcx7D3ob3ZdZ/results?format=json&simplified=1').then(({ data }) => {
    res.json({ DraftRankings: data })
  })
})


export default router
