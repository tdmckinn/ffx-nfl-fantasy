import { ApolloServer, gql } from 'apollo-server'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { format } from 'date-fns'
import shuffle from 'lodash.shuffle'
import Redis from 'ioredis'
import * as faker from 'faker'
import 'reflect-metadata'
import { createConnection, getConnectionOptions } from 'typeorm'

import { NFL_DATA } from './data/nfl_data_complete.json'
import { NFL_ADP } from './data/nfl_adp.json'
import { NFL_TEAMS } from './data/nfl_teams.json'
import { NFL_POSITONS } from './data/nfl_positions.json'

import { NFX_USERS } from './data/nfx_users.json'
import { NFX_LEAGUES } from './data/nfx_leagues.json'
import { NFX_TEAMS } from './data/nfx_teams.json'
import { NFX_SETTINGS } from './data/nfx_settings.json'
import { NFX_LEAGUE_SETTINGS } from './data/nfx_league_settings.json'

import { User } from './entity/user'
import { League } from './entity/league'
import { Team } from './entity/team'
import { Settings } from './entity/settings'
import { Player } from './entity/player'

import { typeDefs } from './typeDefs'

const redisOptions: any = {
  host: 'localhost',
  port: 6379,
  retry_strategy: opts => {
    return Math.max(opts.attempt * 100, 3000)
  }
}

createConnection()
  .then(async connection => {
    const redis = new Redis(redisOptions)
    const pubsub = new RedisPubSub({
      publisher: new Redis(redisOptions),
      subscriber: new Redis(redisOptions)
    })

    const getShuffledUserDraftPositions = () =>
      shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    /**
     * TODO: Use Leagues Settings
     */
    const draftPicksByRound = (
      numberOfTeams = 10,
      numOfRosterPositions = 15
    ) => {
      const allDraftPicks = {}
      for (
        let draftPosition = 1;
        draftPosition <= numberOfTeams;
        draftPosition++
      ) {
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
    const entityManager = connection.manager

    const resolvers = {
      Query: {
        /**
         *  NFX player info used for live draft
         */
        draft: async (_root, { draftId }) => {
          const userDraft = await redis.get(draftId)
          if (draftId && userDraft) {
            return JSON.parse(userDraft)
          }

          return null
        },
        /**
         * Replace JSON with MySportsFeed API
         */
        players: () => NFL_DATA,
        teams: () => NFL_TEAMS,
        userTeams: async (_, { userId }: { userId: string }) => {
          const user = await entityManager.findOne(User, {
            where: { id: userId },
            relations: ['teams']
          })

          if (user) {
            console.log(user.teams)

            return user.teams
          }
          return []
          // return NFX_TEAMS.filter(team => team.OwnerID === userId)
        },
        async leagues() {
          const leagues = await entityManager.find(League, {
            relations: ['settings', 'teams']
          })

          const _leagues = leagues
            ? leagues.map(league => {
                return {
                  id: league.id,
                  DraftDateTime: league.draft_date_time,
                  LeagueName: league.league_name,
                  LeagueSettings: {
                    id: league.settings!.id,
                    ...league.settings!.settings_json
                  },
                  LeagueTeams: league.teams
                }
              })
            : []

          return _leagues
        },
        rosterPositions: () => NFL_POSITONS,
        users: () => NFX_USERS,
        settings: () => NFX_SETTINGS
      },
      Mutation: {
        async createUser(_, { user }) {
          const existingUser = await entityManager.findOne(User, user.id)

          if (existingUser && existingUser.id) {
            return user
          }

          const newUser = await entityManager.save(User, {
            id: user.id,
            name: user.Name,
            email: user.Email,
            avatar: '',
            time_zone: ''
          })
          return newUser
        },
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
        async createLeague(_root, { league }, _context) {
          if (!league) {
            return null
          }
          const {
            CommissionerID,
            LeagueName,
            CommissionerName,
            DraftDateTime,
            TeamName
          } = league

          const user = await entityManager.findOne(User, {
            where: { id: CommissionerID },
            relations: ['leagues']
          })

          if (!user || !CommissionerID) {
            throw new Error(`You must be a registered user to create a league`)
          }
          if (user && user.leagues.length === 5) {
            throw new Error(
              `You have reached the maximum number of leagues allowed`
            )
          }

          const settings = new Settings()
          settings.settings_json = {
            ...NFX_LEAGUE_SETTINGS
          }

          const newTeam = new Team()
          newTeam.name = TeamName
          newTeam.user_id = CommissionerID
          newTeam.picks = []
          newTeam.players = []

          const newLeague = await entityManager.create(League, {
            draft_id: '',
            commissioner_id: CommissionerID,
            commissioner_name: CommissionerName,
            league_name: LeagueName,
            draft_date_time: DraftDateTime,
            settings,
            teams: [newTeam]
          })

          await entityManager.save(League, newLeague)

          return {
            id: newLeague.id,
            CommissionerID: newLeague.commissioner_id,
            LeagueName: newLeague.league_name,
            LeagueSettings: {},
            LeagueTeams: newLeague.teams.map(({ id, user_id }) => {
              return {
                id,
                OwnerID: user_id
              }
            })
          }
        },
        joinLeague(_root, { input }, _context) {
          console.log(input)
          return {
            id: 2,
            LeagueID: 1,
            OwnerID: '71071c6f-1d2b-4657-a617-4a3c8eca00a4'
          }
        },
        async updateLeagueSettings(_root, { settings }, _context) {
          const league = await entityManager.findOne(League, {
            where: { id: settings.LeagueID },
            relations: ['settings']
          })

          if (league) {
            delete settings.LeagueID
            league.settings!.settings_json = settings

            await entityManager.save(League, league)
            return settings
          }
          return 'No associated league for updating settings'
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
              return JSON.parse(currentDraft)
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
  })
  .catch(error => console.log('TypeORM connection error: ', error))
