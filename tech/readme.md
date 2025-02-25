## TypeORM instructions
* Create a new entity in [directory](/apps/service-core/src/common/entities)
* Add a new entity to [import array](/apps/service-core/src/common/entities/index.ts)
* Generate a new migration for this entity

```bash
$ yarn run typeorm:migration:generate ./apps/service-core/src/common/migrations/{name}
# example
$ yarn run typeorm:migration:generate ./apps/service-core/src/common/migrations/create-users
```

* Add a new migration to [import array](/apps/service-core/src/common/migrations/index.ts)
* Additional useful commands

```bash
# create a new empty migration
$ yarn run typeorm:migration:create ./apps/service-core/src/common/migrations/{name}

# run all pending migrations to check
$ yarn run typeorm:migration:up

# revert all recently ran migrations
$ yarn run typeorm:migration:down
```


## Start working
### Running common containers
```bash
# This command starts containers with Postgres, RabbitMQ, and Redis
$ docker compose -f docker-compose.common.yml up -d

# This command starts containers with ELK
# ELK does not need to be run during development
$ docker compose -f docker-compose.elk.yml up -d
```
