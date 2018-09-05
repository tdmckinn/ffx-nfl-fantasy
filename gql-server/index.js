const { ApolloServer, gql } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')

const { NFL_DATA } = require('../data/nfl_data_complete.json')
const { NFL_ADP } = require('../data/nfl_adp.json')
const { NFL_TEAMS } = require('../data/nfl_teams.json')
const { NFL_POSITONS } = require('../data/nfl_positions.json')

const { NFX_USERS } = require('../data/nfx_users.json')
const { NFX_LEAGUES } = require('../data/nfx_leagues.json')
const { NFX_TEAMS } = require('../data/nfx_teams.json')

// export const pubsub = new PubSub();

// The GraphQL schema
const typeDefs = gql`
  type RosterPosition {
    name: String
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
    id: String
    Team: String
    FullName: String
    ShortName: String
  }

  type UserTeam {
    id: String
    name: String
    ownerName: String
  }

  type League {
    id: String
    name: String
    draftID: String
    ownerID: String
    leagueName: String
    teams: [UserTeam]
    users: [User]
    dateCreated: String
    settings: String
    draftComplete: Boolean
  }

  type User {
    id: String
    name: String
    email: String
    avatar: String
    teams: [UserTeam]
    leagues: [League]
    timeZone: String
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

  input AddTeamInput {
    name: String
    owner: String
  }

  # The mutation root type, used to define all mutations.
  type Mutation {
    # A mutation to add a new channel to the list of channels
    addTeam(team: AddTeamInput!): UserTeam
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
    addTeam(team) {
      console.log('Mutation log user', team)
      return {
        id: '1',
        owner: 'John Doe',
        name: 'Boozoo',
        players: [],
        dateCreated: '12-02-2008'
      }
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
