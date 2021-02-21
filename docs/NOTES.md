## TODO

### Bugs

- Passing a turn should insert a turn into the turn list

- Improve .env setup instructions in the README

### Features

- AUTHENTICATION

- Hide text box for click to invite a friend button ✅

- Eliminate exchange letters bug by adding Stages to gameplay

- Add a favicon and remove create react app branding

- Recent games list uses a table for display, has a "remove" button for single games

### Tech

- Typescript V4

- SQLify the sqlite adapter (e.g. logs as separate records)

- sqlite3 models also can provide some more sugar to make managing documents easier

- Some sort of script that on deploy will take old games and archive them to separate DB

- Unbork production stack traces somehow

- Add a production check that compares all the turns plus the racks against the letters in the config
