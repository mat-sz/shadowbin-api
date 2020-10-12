export = {
  type: 'sqlite',
  database: 'tmp/sqlite.db',
  synchronize: true,
  logging: true,
  entities: ['src/entities/*.ts'],
};
