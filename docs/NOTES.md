## TODO

### Features

- Add stages to gameplay so that players can make shuffle moves outside of their turn

- Drag & Drop for Tile Rack: https://react-dnd.github.io/react-dnd/docs/tutorial

- Add a favicon and remove create react app branding

- Recent games list uses a table for display, has a "remove" button for single games

### Tech

- SQLify the sqlite adapter (e.g. logs as separate records)
- sqlite3 models also can provide some more sugar to make managing documents easier
- Some sort of script that on deploy will take old games and archive them to separate DB

- Unbork production stack traces somehow

- Add an integration test that checks all the turns plus the racks against the config

- Add .env setup instructions to README
