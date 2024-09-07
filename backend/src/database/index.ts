import { Sequelize } from "sequelize";
import { join } from "path"

import migrations from "./migrations";
import config from "../config";

const dbPath = join(__dirname, `db.${config.env}.sqlite`)

export async function runMigrations() {
  await sq.authenticate()
  for (const migration of migrations) {
    await migration.up(sq.getQueryInterface())
  }
}

const sq = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath
})

export default sq;