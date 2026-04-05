# Installation

## Prerequisites

- **Rust** 1.75.0 or higher
- **Docker Desktop** (for local development)
- **LMDB** system library

## Steps

### 1. Install SensibleDB CLI

```bash
curl -sSL "https://install.sensibledb.com" | bash
sensibledb --version
```

### 2. Initialize Project

```bash
mkdir my-project && cd my-project
sensibledb init
```

### 3. Write Schema and Queries

**schema.hx:**
```nql
N::User {
    INDEX name: String,
    email: String,
    created_at: Date DEFAULT NOW
}

E::Follows {
    From: User,
    To: User,
    Properties: { since: Date }
}
```

**queries.hx:**
```nql
QUERY createUser(name: String, email: String) =>
    user <- AddN<User>({name: name, email: email})
    RETURN user

QUERY getUser(name: String) =>
    user <- N<User>({name: name})
    RETURN user
```

### 4. Check and Deploy

```bash
sensibledb check
sensibledb push dev
```

### 5. Test

```bash
curl -X POST http://localhost:6969/createUser \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

## Best Practices

- Always run `sensibledb check` before deploying
- Use `build_mode = "release"` for production
- Never commit credentials to version control

