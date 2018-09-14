const { ApolloServer, gql, PubSub } = require('apollo-server')
const { format } = require('date-fns')
const fs = require('fs')
const shuffle = require('lodash.shuffle')
const { RedisPubSub } = require('graphql-redis-subscriptions')
const Redis = require('ioredis')
const faker = require('faker')

const { NFL_DATA } = require('../data/nfl_data_complete.json')
const { NFL_ADP } = require('../data/nfl_adp.json')
const { NFL_TEAMS } = require('../data/nfl_teams.json')
const { NFL_POSITONS } = require('../data/nfl_positions.json')

const { NFX_USERS } = require('../data/nfx_users.json')
const { NFX_LEAGUES } = require('../data/nfx_leagues.json')
const { NFX_TEAMS } = require('../data/nfx_teams.json')
const { NFX_SETTINGS } = require('../data/nfx_settings.json')
const { NFX_LEAGUE_SETTINGS } = require('../data/nfx_league_settings.json')

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

const setupDraft = (leagueID = 1) => {
  // const currentDraft = redis.get(`draft_${leagueID}`)

  // if (currentDraft) {
  //   return currentDraft;
  // } else {
  const league = NFX_LEAGUES.find(league => league.id === 1)
  let teams = league.LeagueTeams
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
      id: teams.length + 1,
      OwnerID: teams.length + 1,
      LeagueID: leagueID,
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

  // redis.set(`draft_${leagueID}`, JSON.stringify({
  //   LeagueID: 1,
  //   CurrentRound: 1,
  //   CurrentUserDrafting: 'John Doe',
  //   DraftDateTime: league.DraftDateTime,
  //   IsDraftComplete: league.IsDraftComplete,
  //   Rounds: 15,
  //   TeamsDrafting: teams
  // }))
  // }

  return {
    LeagueID: 1,
    CurrentRound: 1,
    CurrentUserDrafting: 'John Doe',
    DraftDateTime: league.DraftDateTime,
    IsDraftComplete: league.IsDraftComplete,
    Rounds: 15,
    Teams: teams
  }
}

//#region GraphQL schema
const typeDefs = gql`
  type RosterPosition {
    id: Int
    Name: String
  }

  type Player {
    "Player Info!"
    id: Int
    Rank: Int
    Name: String
    Position: String
    Team: String
    Age: Int
    PassingYards: Float
    PassingTouchDowns: Int
    PassingInterceptions: Int
    RushingYards: Int
    RushingTouchdowns: Int
    ReceivingTouchDowns: Int
    Fumbles: Int
    FubmlesRecovered: Int
    FantasyPoints: Float
    FantasyPointsPerGame: Float
  }

  type ADP_Player {
    id: Int
    Rank: Int
    Name: String
    Position: String
    Team: String
    Age: Int
    FantasyPoints: Float
    AverageDraftPosition: Float
    LineUpPosition: String
  }

  type NFL_Team {
    id: Int
    Team: String
    FullName: String
    ShortName: String
  }

  type LeagueSettings {
    id: Int
    LeagueID: Int
    DraftType: String
    Scoring: String
    MaxTeams: Int
    WaiverType: String
    RosterPositions: [String]
    TradeDeadline: String
  }

  type ConfigValue {
    id: String
    value: String
  }

  type LeagueConfigSetting {
    id: String
    type: String
    text: String
    value: String
    values: [ConfigValue]
    singleValues: [String]
    readOnly: Boolean
  }

  type League {
    id: Int
    DraftID: Int
    DraftDateTime: String
    CommissionerName: String
    CommissionerID: Int
    LeagueName: String
    LeagueTeams: [UserTeam]
    LeagueSettings: LeagueSettings
    Users: [User]
    DateCreated: String
    IsDraftComplete: Boolean
  }

  type User {
    id: Int
    Name: String
    Email: String
    Avatar: String
    Teams: [UserTeam]
    Leagues: [League]
    TimeZone: String
  }

  type UserTeam {
    id: Int
    LeagueID: Int
    Name: String
    OwnerID: Int
    Players: [ADP_Player]
    DateCreated: String
    Picks: [Int]
  }

  type Draft {
    LeagueID: Int
    CurrentRound: Int
    CurrentUserDrafting: String
    DraftDateTime: String
    IsDraftComplete: Boolean
    Rounds: Int
    Teams: [UserTeam]
  }

  # QUERIES
  type Query {
    players: [Player]
    draft: [ADP_Player]
    users: [User]
    userTeams(userId: Int): [UserTeam]
    leagues: [League]
    settings: [LeagueConfigSetting]
    teams: [NFL_Team]
    rosterPositions: [RosterPosition]
  }

  # INPUTS
  input CreateTeamInput {
    name: String
    owner: String
  }

  input CreateLeagueInput {
    LeagueName: String
    CommissionerName: String
    DraftDateTime: String
  }

  input JoinLeagueInput {
    id: String
    name: String
  }

  input UpdateLeagueSettingsInput {
    id: Int
    LeagueID: Int
    DraftType: String
    Scoring: String
    MaxTeams: Int
    WaiverType: String
    RosterPositions: [String]
    TradeDeadline: String
  }

  input PlayerPickInput {
    id: Int
    Name: String
    LineUpPosition: String
  }

  # The mutation root type, used to define all mutations.
  type Mutation {
    createTeam(team: CreateTeamInput!): UserTeam
    createLeague(league: CreateLeagueInput!): League
    updateLeagueSettings(settings: UpdateLeagueSettingsInput!): LeagueSettings
    joinLeague(input: JoinLeagueInput!): UserTeam
    enteredDraft(leagueId: String!): Draft
  }

  # SUBSCRIPTIONS
  type Subscription {
    draftStatusChanged(isDraftStarted: Boolean!): Boolean
    newUserDraftPick(selectedPick: PlayerPickInput!): ADP_Player
  }
`
//#endregion

const DRAFT_STATUS_CHANGED = 'draft_status_changed'
const DRAFT_COMPLETE = 'draft_complete'

const resolvers = {
  Query: {
    // draft - NFX player info used for live draft
    draft: () => NFL_ADP,
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
        CommissionerID: 2,
        IsDraftComplete: false,
        DateCreated: format(new Date(), 'YYYY-MM-DD'),
        LeagueTeams: [
          {
            id: 1,
            OwnerID: 2,
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
    joinLeague(root, { input }, context) {
      console.log(input)
      return {
        id: 2,
        LeagueID: 1,
        OwnerID: 2
      }
    },
    updateLeagueSettings(root, { settings }, context) {
      console.log(settings)
    },
    enteredDraft(leagueID) {
      return setupDraft(leagueID)
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
      subscribe: () => pubsub.asyncIterator('newUserDraftPick')
    }
  }
}

//#region subscriptions
// pubsub.publish('draftStatusChanged', { draftStatusChanged: { isDraftStarted: true } })
// pubsub.publish('userSelectedPick', {
//   newUserDraftPick: { selectedPick: { id: 1, Name: 'Todd Gurley!', Rank: 1 } }
// })

//#endregion

// TODO: Save draft results from (redis?) to DB
const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: true,
  cors: true
})

pubsub.subscribe(DRAFT_STATUS_CHANGED, payload => {
  console.log(payload)
  redis.set('foo', 'bar')
  return { draftStatusChanged: payload.isDraftStarted }
})

//publish events every second
setInterval(() => {
  pubsub.publish(DRAFT_STATUS_CHANGED, {
    draftStatusChanged: { isDraftStarted: true }
  })
}, 10000)

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
