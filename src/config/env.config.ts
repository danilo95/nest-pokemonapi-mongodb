export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  dbName: process.env.DBNAME || '',
  port: Number(process.env.PORT || 3000),
  defaultLimit: Number(process.env.DEFAULT_LIMIT || 5),
});
