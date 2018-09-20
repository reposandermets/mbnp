#!/bin/bash

export PGUSER=postgres
psql <<- SHELL
  ALTER USER postgres WITH SUPERUSER;
  CREATE DATABASE "Adventureworks";
  GRANT ALL PRIVILEGES ON DATABASE "Adventureworks" TO postgres;
SHELL
psql -d Adventureworks -U postgres < /data/install.sql
