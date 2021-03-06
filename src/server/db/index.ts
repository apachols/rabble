import { Sequelize } from "sequelize-typescript";

const db = (filename?: string): Sequelize =>
  new Sequelize({
    logging: false,
    database: "rabble",
    dialect: "sqlite",
    username: "username",
    password: "password",
    storage: filename || ":memory:",
    models: [__dirname + "/models"],
  });

export default db;
