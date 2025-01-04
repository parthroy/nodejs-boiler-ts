import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file variables into process.env

// Define the schema for your environment variables
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  // SQL
  SQL_DATABASE: Joi.string().required().description('SQL DATABASE'),
  SQL_USERNAME: Joi.string().required().description('SQL USERNAME'),
  SQL_PASSWORD: Joi.string().required().description('SQL PASSWORD'),
  SQL_HOST: Joi.string().required().description('SQL HOST'),
  SQL_PREFIX: Joi.string().required().description('SQL PREFIX'),
  SQL_DB_LOGS: Joi.boolean().required().description('SQL DB_LOGS').default(false),
  SQL_DB_UPDATES: Joi.boolean().required().description('SQL DB_UPDATES').default(false),
  SQL_DB_SYNC: Joi.boolean().required().description('SQL DB_SYNC').default(false),
  SQL_DB_PORT: Joi.number().required().description('SQL SQL_DB_PORT').default(5432),
  SQL_SCHEMA: Joi.string().required().description('SQL SCHEMA'),
})
  .unknown()
  .required();

// Validate the environment variables
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Configuration object that will be exported
const config = {
  sql: {
    database: envVars.SQL_DATABASE,
    username: envVars.SQL_USERNAME,
    password: envVars.SQL_PASSWORD,
    host: envVars.SQL_HOST,
    prefix: envVars.SQL_PREFIX,
    alter: envVars.SQL_DB_UPDATES,
    logs: envVars.SQL_DB_LOGS,
    sync: envVars.SQL_DB_SYNC,
    port: envVars.SQL_DB_PORT,
    schema: envVars.SQL_SCHEMA
  },
  env: envVars.NODE_ENV,
  port: envVars.PORT,
};

export default config;
