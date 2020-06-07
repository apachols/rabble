import { Table, Column, Model, DataType } from "sequelize-typescript";
import type { LogEntry } from "boardgame.io";

@Table({ freezeTableName: true })
export class Metadata extends Model<Metadata> {
  @Column({ primaryKey: true, type: DataType.STRING })
  docID?: string;

  @Column(DataType.TEXT)
  docString?: string;

  getDocument() {
    const docString = this.getDataValue("docString") as string;
    if (docString) {
      return JSON.parse(docString);
    }
    return {};
  }
}

@Table({ freezeTableName: true })
export class State extends Model<State> {
  @Column({ primaryKey: true, type: DataType.STRING })
  docID?: string;

  @Column(DataType.TEXT)
  docString?: string;

  getDocument() {
    const docString = this.getDataValue("docString") as string;
    if (docString) {
      return JSON.parse(docString);
    }
    return {};
  }
}

@Table({ freezeTableName: true })
export class InitialState extends Model<InitialState> {
  @Column({ primaryKey: true, type: DataType.STRING })
  docID?: string;

  @Column(DataType.TEXT)
  docString?: string;

  getDocument() {
    const docString = this.getDataValue("docString") as string;
    if (docString) {
      return JSON.parse(docString);
    }
    return {};
  }
}

@Table({ freezeTableName: true })
export class Log extends Model<Log> {
  @Column({ primaryKey: true, type: DataType.STRING })
  docID?: string;

  @Column(DataType.TEXT)
  docString?: string;

  getDocument(): { log: LogEntry[] } {
    const docString = this.getDataValue("docString") as string;
    if (docString) {
      return JSON.parse(docString);
    }
    return { log: [] };
  }
}
