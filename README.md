# mbnp

## Requirements

Docker Machine has to be installed on the operation system.

## CLI

```sh
docker-compose -f "docker-compose.yml" up -d --build  # build & run
open http://localhost:8888                            # open swagger
docker container logs -f -t pr-node                   # monitor logs
docker container logs -f -t pr-node > log.log         # save logs to file
docker-compose -f "docker-compose.yml" down           # stop application
```

## Design

Node.js cluster providing offload capabilities.
Master handles API, db & queue. Express server is used for web server.
Queues are local async loops keeping stack of reviews and notifications.

Review worker searches for inappropriete words from a review, received from Redis pub/sub.
Notification worker simulates sending out emails received from Redis pub/sub and notifies queue in master when msg is sent.
Workers are hot reloaded in case of process failure.

Success response is little different from the specs,
reason is to separate data from additional meta information.

```json
{
    "data":  {
        "productreviewid": 6
    },
    "success": true
}
```

## IDEAS

 - Remote queue
 - Check for started workers before starting api & queue
 - Web server and db pool live in master, what if they were in workers also...
 - If published to AWS then to add security in API Gateway layer and API docs

 ## ISSUES

 - Improve parsing incoming JSON, currently user sees error with full server paths when json is malformed
 - Add unit tests

## DB issues

 - Database found from https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/adventure-works
 - production.product & production.productreview
 - Data missing fro mproduction.product & production.productreview after initial migration
 - [Data errros](./README_DB_MIGRATE_ERRORS)
 - FIX: https://github.com/lorint/AdventureWorks-for-Postgres/pull/4/files
 - FIX: SET session_replication_role = replica;
 - FIX: ALTER USER postgres WITH SUPERUSER;
 - FIX: GRANT ALL PRIVILEGES ON DATABASE "Adventureworks" TO postgres;
 - FIX: psql -d Adventureworks -U postgres < /data/install.sql
 - Decided to create a correct datadump and migrate it via DockerPostgres


```sh
PGDATABASE="Adventureworks" pg_dump -O -x -v \
  --clean \
  --if-exists \
  --disable-triggers \
  -h 127.0.0.1 \
  -U postgres \
  -d Adventureworks > install.sql
```

Extra lines added in the end of install.sql

```sql
TRUNCATE TABLE production.productreview;
ALTER TABLE production.productreview ALTER COLUMN rating DROP NOT NULL;
ALTER TABLE production.productreview ADD COLUMN prohibitedwords BOOLEAN NOT NULL DEFAULT FALSE;
```
