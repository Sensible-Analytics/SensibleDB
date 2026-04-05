# SDKs Overview

## TypeScript SDK

```bash
npm install sensibledb-ts
```

```typescript
import SensibleDB from "sensibledb-ts";
const client = new SensibleDB();
const user = await client.query("getUser", { name: "John" });
```

## Python SDK

```bash
pip install sensibledb-py
```

```python
from sensibledb import Client
client = Client(local=True, port=6969)
user = client.query("getUser", {"name": "John"})
```

## Rust SDK (Embedded)

```toml
[dependencies]
sensibledb-db = { version = "1.3", features = ["embedded"] }
```

