declare module 'lodash.shuffle';


declare module "*.json" {
  const value: any;
  const NFL_DATA: any;
  const NFL_ADP: any;
  const NFL_TEAMS: any;
  const NFL_POSITONS: any;

  const NFX_USERS: any;
  const NFX_LEAGUES: any;
  const NFX_TEAMS: any;
  const NFX_SETTINGS: any;
  const NFX_LEAGUE_SETTINGS: any;

  export default value;
  export { NFL_DATA }
  export { NFL_ADP }
  export { NFL_TEAMS }
  export { NFL_POSITONS }

  export { NFX_USERS }
  export { NFX_LEAGUES }
  export { NFX_TEAMS }
  export { NFX_SETTINGS }
  export { NFX_LEAGUE_SETTINGS }
}

