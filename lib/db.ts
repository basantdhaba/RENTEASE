import { Sequelize } from "sequelize"

let sequelize: Sequelize

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: "mysql",
    dialectModule: require("mysql2"),
    ssl: process.env.DATABASE_SSL === "true",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  })
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "rentease",
    process.env.DB_USER || "root",
    process.env.DB_PASS || "",
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "mysql",
      dialectModule: require("mysql2"),
      logging: false,
    },
  )
}

export default sequelize

