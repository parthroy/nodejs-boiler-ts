import { Sequelize } from 'sequelize-typescript';
import config from '../config'
class Database {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      host: config.sql.host,
      port: config.sql.port,
      database: config.sql.database,
      schema: config.sql.schema,
      dialect: 'postgres',
      username: config.sql.username,
      password: config.sql.password,
      models: [__dirname + '/models'], // Adjust the path to your models directory
    });
  }

  // Method to establish connection
  public async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');

      // Ensure the schema exists
      await this.ensureSchemaExists();
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  // Method to close connection
  public async close(): Promise<void> {
    try {
      await this.sequelize.close();
      console.log('Database connection closed.');
    } catch (error) {
      console.error('Error closing the database connection:', error);
    }
  }

  // Method to ensure the schema exists
  private async ensureSchemaExists(): Promise<void> {
    try {
      // Use raw query to check/create the schema
      const schema = config.sql.schema;
      await this.sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${config.sql.schema}"`);
      console.log(`Schema "${schema}" is ready.`);
    } catch (error) {
      console.error('Error ensuring schema exists:', error);
    }
  }
  // Method to sync the database (create tables)
  public async syncModels(): Promise<void> {
    try {
      await this.sequelize.sync({ force: false }); // Use force: true to drop existing tables and recreate them
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('Error syncing models:', error);
    }
  }

}

export default new Database();
