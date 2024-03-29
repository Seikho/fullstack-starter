# Full Stack Starter

**A highly opinionated full-stack starter: TypeScript, Node.JS, Express, CQRS + Event Sourcing, React, and Redux**

## Getting Started

1. Clone the repository to your new project folder:

- `git clone git@github.com:seikho/fullstack-starter my-project`

2. Remove the Git history

- `cd my-project && rm -rf .git`

3. Re-initialise the project

- `git init`
- `git remote add git@github.com:your-username/my-project`

4. Install the project dependencies

- `yarn`

5. Start the databases

- `yarn db`

6. Start the backend + frontend

- With the TypeScript compiler watching: `yarn start:watch`
- Without the TypeScript compiler: `yarn start`
  - Use `Ctrl + Shift + B` or `Cmd + shift + B` within VSCode to build in watch mode

7. Get started!

- http://localhost:1234

## Architecture

- `/src`: Back-end codebase
  - `/api`: Express routers for top-level routes
  - `/db`: Database helpers and migrations
  - `/domain`: Each aggregate (`/domain/agg`), commands (`/domain/cmd`), and associated tests
  - `/ws`: Websocket helpers
  - `/manager`: Process managers
  - `/populator:` Read model populators
- `/web`: Front-end codebase
  - `/page`: High-level pages
  - `/comp`: Re-usabable components
  - `/layout`: Components and styles for the layout
  - `/store`: Redux store, reducers, and sagas
  - `/style`: Global styles

## Inclusions

- React with zustand state management
- Express
- CQRS and Event Sourcing using [evtstore](https://github.com/seikho/evtstore)
- Parcel.js for front-end bundling
- MongoDB

## Utilities

The project includes some helpers with Visual Studio Code and the command line

### VSCode

- `CTRL/CMD`+`SHIFT`+`B`: Builds the back-end in watch mode
- `F5`: Launch the backend with the debugger and starts the frontend

### Terminal

- `yarn up`: Start the databases
- `yarn web:serve`: Starts the front-end in watch mode
- `yarn srv:build`: Cleans and builds the backend
- `yarn srv:start`: Starts the back-end
- `yarn clear`: Deletes the previous build
