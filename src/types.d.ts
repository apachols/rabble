type ClientConfig = {
  game: Object;
  board: Object;
};

declare module "boardgame.io/react" {
  export function Client(config: ClientConfig): Any;
}
