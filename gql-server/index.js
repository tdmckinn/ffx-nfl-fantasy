const { ApolloServer, gql } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const { format } = require('date-fns')

const { NFL_DATA } = require('../data/nfl_data_complete.json')
const { NFL_ADP } = require('../data/nfl_adp.json')
const { NFL_TEAMS } = require('../data/nfl_teams.json')
const { NFL_POSITONS } = require('../data/nfl_positions.json')

const { NFX_USERS } = require('../data/nfx_users.json')
const { NFX_LEAGUES } = require('../data/nfx_leagues.json')
const { NFX_TEAMS } = require('../data/nfx_teams.json')
const { NFX_SETTINGS } = require('../data/nfx_settings.json')

const fs = require('fs')

// export const pubsub = new PubSub();

// The GraphQL schema
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
  }

  type NFXTeam {
    id: Int
    Team: String
    FullName: String
    ShortName: String
  }

  type UserTeam {
    id: Int
    LeagueID: Int
    Name: String
    OwnerName: String
    Players: [ADP_Player]
    DateCreated: String
  }

  type Settings {
    LeagueID: Int
    DraftTypes: [String]
    Scoring: [String]
    MaxTeams: [Int]
    WaiverType: String
    RosterPositions: [String]
    TradeDealine: String
  }

  type League {
    id: Int
    DraftID: Int
    CommissionerName: String
    CommissionerID: String
    LeagueName: String
    LeagueTeams: [UserTeam]
    Users: [User]
    DateCreated: String
    Settings: String
    DraftComplete: Boolean
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

  type Query {
    players: [Player]
    draft: [ADP_Player]
    users: [User]
    userTeams: [UserTeam]
    teams: [NFXTeam]
    leagues: [League]
    rosterPositions: [RosterPosition]
  }

  input CreateTeamInput {
    name: String
    owner: String
  }

  input CreateLeagueInput {
    LeagueName: String
    CommissionerName: String
  }

  # The mutation root type, used to define all mutations.
  type Mutation {
    createTeam(team: CreateTeamInput!): UserTeam
    createLeague(league: CreateLeagueInput!): League
  }
`

const resolvers = {
  Query: {
    // draft - NFX player info used for live draft
    draft: () => NFL_ADP,
    players: () => NFL_DATA,
    teams: () => NFL_TEAMS,
    userTeams: () => NFX_TEAMS,
    leagues: () => NFX_LEAGUES,
    rosterPositions: () => NFL_POSITONS,
    users: () => NFX_USERS
  },
  Mutation: {
    createTeam(team) {
      console.log('Mutation log user', team)
      return {
        id: 1,
        LeagueID: 1,
        Name: 'Boozoo',
        OwnerName: 'John Doe',
        Players: [],
        DateCreated: '12-02-2008'
      }
    },
    createLeague(root, { league }, context) {

      NFX_SETTINGS.LeagueID = 2

      const leagueData =  Object.assign({}, league, {
        id: 2,
        CommissionerId: 2,
        DraftComplete: false,
        DateCreated: format(new Date(), 'YYYY-MM-DD HH:MM:SS'),
        LeagueTeams: [{
          teamID: 2
        }],
        Settings: NFX_SETTINGS
      })

      NFX_LEAGUES.push(leagueData)
       
      const newLeagues = {
        NFX_LEAGUES
      }

      console.log(NFX_LEAGUES)

      fs.writeFileSync('../data/nfx_leagues.json', JSON.stringify(newLeagues, null, 2))
      return { id: 2 }
    }
  }
  // Subscription: {
  //   commentAdded: {
  //     subscribe: () => pubsub.asyncIterator('commentAdded')
  //   }
  // }
}

//#region subscriptions
// pubsub.publish('commentAdded', { commentAdded: { id: 1, content: 'Hello!' }})
//#endregion

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
