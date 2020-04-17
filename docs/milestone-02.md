## MVP Milestone 1

### Behavioral requirements

#### Gameplay

- Player can play blanks
- Plays are scored correctly

- 15 x 15 Game board
- Game board has bonus squares

- Shuffled rack order preserved on server
- Bingos are scored correctly
- Victory conditions are implemented

### Technical requirements

- Tests for Rabble game file
- Abstraction for API

- CheckValidPlay(playerID, playTiles)

- ServerTileRack (G)
- DisplayTileRack (rack.ts)
- ServerGameBoard (G)
- DisplayGameBoard (board.ts)

- CheckValidPlay(playerID, playSquares)

- Security errors for NPM packages
- package.json dev dependencies

- Add common components like tile, bonus, score display

#### Lobby

- Create screen does not just have a button that says create
- Join screen checks for credentials and waves you through
- Link to invite a friend is sharable
- Link to invite a friend is copyable
- Recent games list has dates and opponents
