import { ApolloServer, gql } from 'apollo-server'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { format } from 'date-fns'
import shuffle from 'lodash.shuffle'
import Redis from 'ioredis'
import * as faker from 'faker'

import { NFL_DATA } from './data/nfl_data_complete.json'
import { NFL_ADP } from './data/nfl_adp.json'
import { NFL_TEAMS } from './data/nfl_teams.json'
import { NFL_POSITONS } from './data/nfl_positions.json'

import { NFX_USERS } from './data/nfx_users.json'
import { NFX_LEAGUES } from './data/nfx_leagues.json'
import { NFX_TEAMS } from './data/nfx_teams.json'
import { NFX_SETTINGS } from './data/nfx_settings.json'
import { NFX_LEAGUE_SETTINGS } from './data/nfx_league_settings.json'

import { typeDefs } from './typeDefs'
import { setupTypeORMConnections } from './db'

setupTypeORMConnections()

const options: any = {
  host: 'localhost',
  port: 6379,
  retry_strategy: opts => {
    return Math.max(opts.attempt * 100, 3000)
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
    const picks: number[] = []
    for (let round = 1; round <= numOfRosterPositions; round++) {
      let draftPick

      draftPick =
        round % 2 === 0
          ? round * numberOfTeams - draftPosition + 1
          : (draftPick = (round - 1) * numberOfTeams + draftPosition)

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
    draft: async (_root, { draftId }) => {
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
    createTeam(_team) {
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
    createLeague(_roo, { league }, _context) {
      // TODO: Save league data to database and create owners team by default
      const leagueData = {
        ...league,
        ...{
          id: 2,
          CommissionerID: '71071c6f-1d2b-4657-a617-4a3c8eca00a4',
          IsDraftComplete: false,
          DateCreated: format(new Date(), 'YYYY-MM-DD'),
          LeagueTeams: [
            {
              id: 1,
              OwnerID: '71071c6f-1d2b-4657-a617-4a3c8eca00a4',
              LeagueID: 2,
              Name: `${league.CommissionerName} Team`,
              DateCreated: format(new Date(), 'YYYY-MM-DD')
            }
          ],
          Settings: {
            ...NFX_LEAGUE_SETTINGS,
            ...{
              id: 2,
              LeagueID: 2
            }
          }
        }
      }

      // NFX_LEAGUES.push(leagueData)

      // const newLeagues = {
      //   NFX_LEAGUES
      // }

      console.log(NFX_LEAGUES)
      return leagueData
    },
    joinLeague(_root, { input }, _context) {
      console.log(input)
      return {
        id: 2,
        LeagueID: 1,
        OwnerID: '71071c6f-1d2b-4657-a617-4a3c8eca00a4'
      }
    },
    updateLeagueSettings(_root, { settings }, _context) {
      console.log('User Settings', settings)
    },
    enteredDraft: async (_root, { leagueId }) => {
      try {
        if (!leagueId) {
          throw new Error('League Id Required to Enter Draft')
        }

        const draftId = `draft_${leagueId}`
        const currentDraft = await redis.get(draftId)

        pubsub.publish(DRAFT_STATUS_CHANGED, { draftStatusChanged: true })

        if (currentDraft) {
          const draftData = JSON.parse(currentDraft)
          return draftData
        } else {
          const league = NFX_LEAGUES.find(_league => _league.id === 1)
          let teams = league!.LeagueTeams.map(({ id }) => {
            const team = NFX_TEAMS.find(_team => _team.id === id)
            return team
          })

          const teamPickOrder = getShuffledUserDraftPositions()

          while (teams.length < 10) {
            /**
             *
             * User Creation Info
             * OwnerID: teams.length + 1,
             * Name: faker.name.findName(),
             * Email: faker.internet.email(),
             * DateCreated: format(new Date(), 'YYYY-MM-DD'),
             * TimeZone: "America/Charlotte",
             */
            teams.push({
              id: Number(teams.length + 1),
              OwnerID: (teams.length + 1).toString(),
              LeagueID: Number(leagueId),
              Name: faker.commerce.productName(),
              DateCreated: format(new Date(), 'YYYY-MM-DD'),
              Picks: [],
              Players: []
            })
          }

          const picks = draftPicksByRound()

          teams = teams.map((team, index) => {
            const draftingPosition = teamPickOrder[index]
            team!.Picks = picks[draftingPosition]
            return team
          })

          const draftSetup = {
            id: draftId,
            LeagueID: 1,
            CurrentRound: 1,
            CurrentUserDrafting: 'John Doe',
            DraftDateTime: league!.DraftDateTime,
            IsDraftComplete: league!.IsDraftComplete,
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
        const parsedDraftSession = JSON.parse(userDraft)
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
        console.log('Apollo Subscription - Draft Status Changed')
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

const apolloOptions: any = {
  typeDefs: gql(typeDefs),
  resolvers,
  subscriptions: true,
  cors: true
}

const server = new ApolloServer(apolloOptions)

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
