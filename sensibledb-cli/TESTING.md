# SensibleDB CLI Testing Guide

For each of these, make sure you're in the sensibledb-cli directory.
Then, create a directory called test-(some name).
`cd` into that directory.
Instead of the `sensibledb` command in the commands below, use `cargo run -- <args passed to sensibledb>`.

## Local Flows (Non-Cloud Testing)

- `sensibledb init` with default settings; check sensibledb.toml created with empty template and ./db/ queries path
- `sensibledb init --path /custom/path` with custom directory; verify project created in specified location
- `sensibledb init --template custom_template` with custom template; confirm template applied correctly
- `sensibledb init --queries-path ./custom-queries/` with custom queries directory; validate queries path set correctly
- `sensibledb check` to validate all instances; verify all configurations and queries validated
- `sensibledb check my-instance` to validate specific instance; confirm only specified instance checked
- `sensibledb compile` to compile queries; verify queries compiled to default output
- `sensibledb compile --path ./custom-output --output my-instance` with custom settings; check compilation to specified path and instance
- `sensibledb build my-instance` to build local Docker instance; verify Dockerfile and docker-compose.yml generated; confirm Docker image built successfully
- `sensibledb push my-instance` to deploy local Docker instance; verify container starts and is accessible on configured port
- `sensibledb start my-instance` to start existing local Docker instance; verify container starts without rebuild
- `sensibledb stop my-instance` to stop running local Docker instance; confirm container stops cleanly
- `sensibledb status` to view all instances; confirm all instances listed with correct status and Docker container states
- `sensibledb prune` to clean unused resources; verify containers, images cleaned while preserving volumes
- `sensibledb prune my-instance` to clean specific instance resources; confirm only specified instance cleaned
- `sensibledb prune --all` to clean all instances; verify all project instances cleaned
- `sensibledb metrics full` to enable full metrics; verify metrics collection enabled
- `sensibledb metrics basic` to enable basic metrics; confirm reduced metrics collection
- `sensibledb metrics off` to disable metrics; verify metrics collection disabled
- `sensibledb metrics status` to check metrics state; confirm current metrics setting displayed
- `sensibledb update` to upgrade to latest version; verify CLI updated successfully
- `sensibledb update --force` to force update; confirm update proceeds even if already latest
- `sensibledb init` in directory with existing sensibledb.toml; verify appropriate error message
- `sensibledb build non-existent-instance` with invalid instance; confirm error for missing instance
- `sensibledb start my-instance` without building first; verify error about missing docker-compose.yml
- `sensibledb build my-instance` without Docker installed/running; confirm Docker availability error
- `sensibledb push my-instance` without Docker daemon running; verify Docker daemon error
- `sensibledb add` with conflicting instance names; verify duplicate name error

## Cloud/Remote Flows

## Project Initialization

- `sensibledb init --cloud` with cloud instance; verify cloud instance configured in sensibledb.toml
- `sensibledb init --cloud --cloud-region eu-west-1` with custom region; check region set correctly
- `sensibledb init --ecr` with ECR instance; confirm ECR instance added to config
- `sensibledb init --fly` with Fly.io instance; verify Fly instance created with default settings
- `sensibledb init --fly --fly-auth token --fly-volume-size 50 --fly-vm-size performance-2x --fly-public false` with custom Fly settings; check all parameters applied

## Instance Management

- `sensibledb add my-instance --cloud` to add cloud instance; verify instance added to existing project
- `sensibledb add my-ecr --ecr` to add ECR instance; confirm ECR instance configured
- `sensibledb add my-fly --fly --fly-volume-size 30` to add Fly instance with custom volume; check instance created with correct volume size
- `sensibledb delete my-instance` to remove instance; verify instance completely removed from config and infrastructure

## Build and Deployment

- `sensibledb build my-instance` to build instance; verify build process completes successfully
- `sensibledb push my-instance` to deploy instance; confirm instance deployed and running
- `sensibledb start my-instance` to start existing instance; verify instance starts without rebuild
- `sensibledb stop my-instance` to stop running instance; confirm instance stops cleanly

## Data Operations

- `sensibledb sync my-instance` to sync source files from remote; verify local queries updated from instance
- `sensibledb sync` in a workspace without sensibledb.toml; ensure standard and enterprise clusters are selectable

## Authentication

- `sensibledb auth login` to authenticate with SensibleDB Cloud; verify login successful and credentials stored
- `sensibledb auth logout` to sign out; confirm credentials cleared
- `sensibledb auth create-key my-cluster` to generate API key; verify key created for specified cluster

## Error Scenarios

- `sensibledb push` without building first; verify appropriate build dependency error
- Commands requiring authentication without login; confirm proper authentication error messages
