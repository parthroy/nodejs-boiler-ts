import config from "../config";


function dbName(tableName: string): string {
  return `${config.sql.prefix}_${tableName}`;
}
export { dbName };
