export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  dbName: process.env.DBNAME || '',
  port: +`${process.env.PORT || 3000}`,
  defaultLimit: process.env.DEFAULT_LIMIT || 5,
});
