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
const { NFX_LEAGUE_SETTINGS } = require('../data/nfx_league_settings.json')

const fs = require('fs')

// export const pubsub = new PubSub();

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
    OwnerID: Int
    Players: [ADP_Player]
    DateCreated: String
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
    CommissionerID: String
    LeagueName: String
    LeagueTeams: [UserTeam]
    LeagueSettings: LeagueSettings
    Users: [User]
    DateCreated: String
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
    settings: [LeagueConfigSetting]
  }

  # Inputs 
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

  # The mutation root type, used to define all mutations.
  type Mutation {
    createTeam(team: CreateTeamInput!): UserTeam
    createLeague(league: CreateLeagueInput!): League
    updateLeagueSettings(settings: UpdateLeagueSettingsInput!): LeagueSettings
    joinLeague(input: JoinLeagueInput!): UserTeam
  }
`
//#endregion

const resolvers = {
  Query: {
    // draft - NFX player info used for live draft
    draft: () => NFL_ADP,
    players: () => NFL_DATA,
    teams: () => NFL_TEAMS,
    userTeams: () => NFX_TEAMS,
    leagues: () => NFX_LEAGUES,
    rosterPositions: () => NFL_POSITONS,
    users: () => NFX_USERS,
    settings: () => NFX_SETTINGS
  },
  Mutation: {
    createTeam(team) {
      console.log('Mutation log user', team)
      return {
        id: 1,
        LeagueID: 1,
        Name: 'Boozoo 49',
        OwnerName: 'John Doe',
        Players: [],
        DateCreated: '12-02-2008'
      }
    },
    createLeague(root, { league }, context) {
    // TODO: Save league data to database and create owners team by default
      const leagueData =  Object.assign({}, league, {
        id: 2,
        CommissionerID: 2,
        DraftComplete: false,
        DateCreated: format(new Date(), 'YYYY-MM-DD'),
        LeagueTeams: [{
          id: 1,
          OwnerID: 2,
          LeagueID: 2,
          Name: `${league.CommissionerName} Team`,
          DateCreated: format(new Date(), 'YYYY-MM-DD'),
        }],
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
