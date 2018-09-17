import { ApolloServer, gql } from 'apollo-server'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { format } from 'date-fns'
import fs from 'fs'
import shuffle from 'lodash.shuffle'
import Redis from 'ioredis'
import faker from 'faker'

import { NFL_DATA } from '../data/nfl_data_complete.json'
import { NFL_ADP } from '../data/nfl_adp.json'
import { NFL_TEAMS } from '../data/nfl_teams.json'
import { NFL_POSITONS } from '../data/nfl_positions.json'

import { NFX_USERS } from '../data/nfx_users.json'
import { NFX_LEAGUES } from '../data/nfx_leagues.json'
import { NFX_TEAMS } from '../data/nfx_teams.json'
import { NFX_SETTINGS } from '../data/nfx_settings.json'
import { NFX_LEAGUE_SETTINGS } from '../data/nfx_league_settings.json'

import { typeDefs } from './typeDefs'

const options = {
  host: 'localhost',
  port: '6379',
  retry_strategy: options => {
    // reconnect after
    return Math.max(options.attempt * 100, 3000)
  }
}

const redis = new Redis(options)
const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
})

const getShuffledUserDraftPositions = () =>
  shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

/**
 * TODO: Use Leagues Settings, redo sourced algo?
 */
const draftPicksByRound = (numberOfTeams = 10, numOfRosterPositions = 15) => {
  const allDraftPicks = {}
  for (let draftPosition = 1; draftPosition <= numberOfTeams; draftPosition++) {
    const picks = []
    for (let round = 1; round <= numOfRosterPositions; round++) {
      let draftPick
      if (round % 2 === 0) {
        draftPick = round * numberOfTeams - draftPosition + 1
      } else {
        draftPick = (round - 1) * numberOfTeams + draftPosition
      }
      picks.push(draftPick)
    }
    allDraftPicks[draftPosition] = picks
  }
  return allDraftPicks
}

/**
 * Subscription Events
 */
const DRAFT_STATUS_CHANGED = 'draft_status_changed'
const DRAFT_COMPLETE = 'draft_complete'
const NEW_USER_DRAFT_PICK = 'new_user_draft_pick'

const resolvers = {
  Query: {
    // draft - NFX player info used for live draft
    draft: async (root, { draftId }) => {
      const userDraft = await redis.get(draftId)
      if (draftId && userDraft) {
        return JSON.parse(userDraft)
      }

      return null
    },
    players: () => NFL_DATA,
    teams: () => NFL_TEAMS,
    userTeams: (_, { userId }) => {
      return NFX_TEAMS.filter(team => team.OwnerID === userId)
    },
    leagues: () => NFX_LEAGUES,
    rosterPositions: () => NFL_POSITONS,
    users: () => NFX_USERS,
    settings: () => NFX_SETTINGS
  },
  Mutation: {
    createTeam(team) {
      return {
        id: 1,
        LeagueID: 1,
        Name: 'Boozoo 49',
        OwnerName: 'John Doe',
        Players: [],
        DateCreated: '12-02-2008'
      }
    },
    // editTeam() {},
    // deleteTeam() {},
    createLeague(root, { league }, context) {
      // TODO: Save league data to database and create owners team by default
      const leagueData = Object.assign({}, league, {
        id: 2,
        CommissionerID: 'b74190d4-ac80-4159-93a2-2323asdf',
        IsDraftComplete: false,
        DateCreated: format(new Date(), 'YYYY-MM-DD'),
        LeagueTeams: [
          {
            id: 1,
            OwnerID: 'b74190d4-ac80-4159-93a2-2323asdf',
            LeagueID: 2,
            Name: `${league.CommissionerName} Team`,
            DateCreated: format(new Date(), 'YYYY-MM-DD')
          }
        ],
        Settings: Object.assign({}, NFX_LEAGUE_SETTINGS, { id: 2, LeagueID: 2 })
      })

      // NFX_LEAGUES.push(leagueData)

      // const newLeagues = {
      //   NFX_LEAGUES
      // }

      console.log(NFX_LEAGUES)

      // fs.writeFileSync('../data/nfx_leagues.json', JSON.stringify(newLeagues, null, 2))
      return leagueData
    },
    joinLeague(_, { input }, context) {
      console.log(input)
      return {
        id: 2,
        LeagueID: 1,
        OwnerID: 'b74190d4-ac80-4159-93a2-2323asdf'
      }
    },
    updateLeagueSettings(_, { settings }, context) {
      console.log('User Settings', settings)
    },
    enteredDraft: async (_, { leagueId }) => {
      try {
        if (!leagueId) {
          throw 'League Id Required to Enter Draft'
        }

        const draftId = `draft_${leagueId}`
        const currentDraft = await redis.get(draftId)

        if (currentDraft) {
          const draftData = JSON.parse(currentDraft)
          return draftData
        } else {
          const league = NFX_LEAGUES.find(league => league.id === 1)
          let teams = league.LeagueTeams.map(({ id, LeagueID }) => {
            const team = NFX_TEAMS.find(team => team.id === id)
            return team
          })

          const teamPickOrder = getShuffledUserDraftPositions()

          while (teams.length < 10) {
            /**
           *
           * User Creation Info
            OwnerID: teams.length + 1,
            Name: faker.name.findName(),
            Email: faker.internet.email(),
            DateCreated: format(new Date(), 'YYYY-MM-DD'),
            TimeZone: "America/Charlotte",
           */
            teams.push({
              id: Number(teams.length + 1),
              OwnerID: teams.length + 1,
              LeagueID: Number(leagueId),
              Name: faker.commerce.productName(),
              DateCreated: format(new Date(), 'YYYY-MM-DD'),
              Players: []
            })
          }

          const picks = draftPicksByRound()

          teams = teams.map((team, index) => {
            const draftingPosition = teamPickOrder[index]
            team.Picks = picks[draftingPosition]
            return team
          })

          const draftSetup = {
            id: draftId,
            LeagueID: 1,
            CurrentRound: 1,
            CurrentUserDrafting: 'John Doe',
            DraftDateTime: league.DraftDateTime,
            IsDraftComplete: league.IsDraftComplete,
            Players: NFL_ADP,
            Rounds: 15,
            Teams: teams
          }

          redis.set(draftId, JSON.stringify(draftSetup))

          return draftSetup
        }
      } catch (error) {
        return {
          error
        }
      }
    },
    addDraftPickToUserTeam: async (_, { selectedPick }) => {
      pubsub.publish(NEW_USER_DRAFT_PICK, { selectedPick })
      const userDraft = await redis.get(selectedPick.DraftID)

      if (userDraft) {
        let parsedDraftSession = JSON.parse(userDraft)
        parsedDraftSession.Teams.find(
          team => team.id === selectedPick.TeamID
        ).Players.push({
          id: selectedPick.id,
          Name: selectedPick.Name,
          LineUpPosition: selectedPick.LineUpPosition
        })

        const index = parsedDraftSession.Players.findIndex(
          player => player.id === selectedPick.id
        )
        parsedDraftSession.Players.splice(index, 1)

        redis.set(selectedPick.DraftID, JSON.stringify(parsedDraftSession))
      }
      return selectedPick
    }
  },
  Subscription: {
    draftStatusChanged: {
      resolve: payload => {
        console.log('Apollo Subscription')
        return payload.draftStatusChanged
      },
      subscribe: () => pubsub.asyncIterator(DRAFT_STATUS_CHANGED)
    },
    newUserDraftPick: {
      resolve: payload => {
        console.log('Apollo Subscription - New User', payload.selectedPick)
        return payload.selectedPick
      },
      subscribe: () => pubsub.asyncIterator(NEW_USER_DRAFT_PICK)
    }
  }
}
//#endregion

// TODO: On Completion of draft save results from redis to DB

const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
  subscriptions: true,
  cors: true
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
