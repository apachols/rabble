import { Table, Column, Model, DataType } from "sequelize-typescript";
import type { LogEntry } from "boardgame.io";

@Table({ freezeTableName: true })
export class Metadata extends Model<Metadata> {
  @Column({ primaryKey: true })
  docID?: string;

  @Column(DataType.TEXT)
  docString?: string;

  getDocument() {
    return this.docString ? JSON.parse(this.docString) : {};
  }
}

@Table({ freezeTableName: true })
export class State extends Model<State> {
  @Column({ primaryKey: true })
  docID?: string;

  @Column(DataType.TEXT)
  docString?: string;

  getDocument() {
    return this.docString ? JSON.parse(this.docString) : {};
  }
}

@Table({ freezeTableName: true })
export class InitialState extends Model<InitialState> {
  @Column({ primaryKey: true })
  docID?: string;

  @Column(DataType.TEXT)
  docString?: string;

  getDocument() {
    return this.docString ? JSON.parse(this.docString) : {};
  }
}

@Table({ freezeTableName: true })
export class Log extends Model<Log> {
  @Column({ primaryKey: true })
  docID?: string;

  @Column(DataType.TEXT)
  docString?: string;

  getDocument(): { log: LogEntry[] } {
    return this.docString ? JSON.parse(this.docString) : {};
  }
}
