# SensibleDB CLI Guide

## Installation

```bash
curl -sSL "https://install.sensibledb.com" | bash
sensibledb --version
```

## Commands

| Command | Description |
|---------|-------------|
| sensibledb init | Initialize a new project |
| sensibledb check | Validate schema and queries |
| sensibledb push dev | Deploy to local instance |
| sensibledb status | Show instance status |
| sensibledb start | Start an instance |
| sensibledb stop | Stop an instance |
| sensibledb logs | Stream instance logs |
| sensibledb prune | Clean up unused resources |
| sensibledb update | Update CLI |

## Project Structure

```
my-project/
+-- sensibledb.toml      # Project configuration
+-- db/
|   +-- schema.hx   # Schema definitions
|   +-- queries.hx  # Query definitions
+-- .sensibledb/         # Build artifacts
```

