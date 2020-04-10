## Links

Collins scrabble program and wordlist:
https://www.collinsdictionary.com/scrabble/scrabble-tools/

Stack Exchange with questionable google docs rehost (!):
https://boardgames.stackexchange.com/questions/38366/latest-collins-scrabble-words-list-in-text-file

NASPA Zyzzyva word finder app:
https://scrabbleplayers.org/w/NASPA_Zyzzyva_macOS_Installation

## TODO

- Plays your turn on invalid word. What a challenge!
- Display error on invalid play
- Handle blanks 1: submit word
- Tests for Rabble game file
- Test multiplayer on heroku

- Victory conditions
- Update server scores

- Game board needs component breakout
- Map out tiles in react

- THE TOAST OMG

## Rough Sketch

```

/ => welcome!  link to /auth OR link to /home

/auth => login/signup (Auth0)

/home => MyGamesList, link to /game/create

/game/{roomID}

/game/join/{roomID}

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/home
  list of all open games
    GET /player/{playerId}/games/ => DynamoDB.scan(userId, status=active)
  each one a link to start playing

/create
  store playerId (from auth0) in localstorage
  POST /games/rabble/create => roomID
  redirect to /game/{roomID}

/game/join/{roomID}
  credentials?
    /game/{roomID}
  Else, Form (nickname, )
    POST /games/rabble/{roomID}/join (playerId, playerName) => credentials
      DynamoDB.save(userId, roomId)
    credentials => localstorage

/game/{roomID}
  if not have playerID and nickname and == game playerid and nickname
    redirect to /game/join/{roomID}
  else
    render game

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
GET /player/{playerId}/games/
POST /game/rabble/create => roomID
POST /games/rabble/{roomID}/join (playerId, playerName)
POST /games/rabble/update/{gameID} => hook into game update mechanism and save state to player when game updates
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

 * Server configured with dynamodb backend => write dynamodb database connector...
 √ Game must be created by POST request to the server to avoid "does not exist" error from backend
 * Build GET for player = {games: []}
 * Save game to player (when join? when finish? game page reads game state)

```

## MVP Milestone 1

### Behavioral requirements

#### Lobby

- Player 0 visits rabble.io/, hits Create.
  - POST /games/rabble/create
  - {playerID: 0, gameID: "fromServer"} => local storage
  - Player 0 redirect to game/join/{roomID}
- Player 0 views to game/join/{roomID}.
  - Player 0 chooses nickname
- Player 0 redirect to game/{roomID}
- Game screen has a share link to /game/join/{roomID}
- Player 1 visits game/join/{roomID}
- Player 1 chooses nickname
- Player 1 redirect to game/{roomID}
- Player 0 visits rabble.io, sees a list of active games

#### Gameplay

- Game screen has a share link
- Player has hand of 7 tiles
- Game Screen shows a list of turns, and
- Turn: (1) type in a word with your letters, or (2) pass.
- Only valid dictionary words can be played.
- Score for each player sums the letters played
- Has bag of 98 or 100 scrabble letters, with scores (?)
- Game is over when (1) bag of scrabble letters is done or (2) each player passes 3 times

### Technical requirements

#### Lobby

- rabble.io/ has create game button
- rabble.io/game/join/{roomID} has nickname chooser
- player info is saved in local storage

```
{
  player: {
    nickname: 'chowski'
  },
  games: [
    {
      roomID: 'ug68pvfvM',
      playerID: 0
      nickname: 'chowski'
    }
  ]
}
```

#### Gameplay Client

- rabble.io/game/{roomID} redirects if game info incorrect
- rabble.io/game/{roomID} has share link
- Share link works well with IOS and Android
- rabble.io/game/{roomID} has tile rack
- rabble.io/game/{roomID} has move list (scrollable)
- rabble.io/game/{roomID} has pass button
- rabble.io/game/{roomID} has confirm pass dialog
- rabble.io/game/{roomID} works with phone keyboard up

#### Gameplay Server

- Dictionary is read from file at startup
- Game engine can access the dictionary to check words
- Dictionary is performant on the server - O(1) retrieval time
- Game state includes bag of tiles
- Game state includes letter value map
- Game actions includes draw new tiles to 7 or end of bag
- Game actions includes play and score
- Game actions includes game end after 3x pass each player
- Flatfile for storage, on server where node runs
