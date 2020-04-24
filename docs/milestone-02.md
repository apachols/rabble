## MVP Milestone 2

### Behavioral requirements

#### Gameplay

- Player can play blanks ✅
- Plays are scored correctly

- 15 x 15 Game board
- Game board has bonus squares

- Shuffled rack order preserved on server
- Bingos are scored correctly
- Victory conditions are implemented

### Technical requirements

- Tests for Rabble game file
- Abstraction for API

- Better state abstraction (and name) for "word you are about to play"
- CheckValidPlay(playerID, playTiles)

- ServerTileRack (G)
- DisplayTileRack (rack.ts)
- ServerGameBoard (G)
- DisplayGameBoard (board.ts)

- CheckValidPlay(playerID, playSquares)

- Security errors for NPM packages
- package.json dev dependencies

- Break out score list component
- Game props need a provider / context component to avoid drilling?
- Add common components like tile, bonus, score display

#### Lobby

- Create screen does not just have a button that says create
- Join screen checks for credentials and waves you through
- Link to invite a friend is sharable
- Link to invite a friend is copyable
- Recent games list has dates and opponents
