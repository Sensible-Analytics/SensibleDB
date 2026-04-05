# SensibleDB Rebranding Plan

## Overview

Rebrand NexusDB → SensibleDB across the entire repository, including code, documentation, CI/CD, icons, and GitHub repository.

---

## Phase 1: GitHub Repository Rename

### 1.1 Rename Repository
- **Current:** `Sensible-Analytics/NexusDB` (or `rprabhat/NexusDB`)
- **Target:** `Sensible-Analytics/SensibleDB`
- **Action:** Use GitHub Settings → Repository name → Rename
- **Impact:** GitHub auto-redirects old URLs, but all local remotes must be updated

### 1.2 Update All Local Remotes
```bash
git remote set-url origin https://github.com/Sensible-Analytics/SensibleDB.git
git remote set-url nexusdb https://github.com/Sensible-Analytics/SensibleDB.git
```

### 1.3 Update All References in Code
- `README.md` badges, links, clone URLs
- `CONTRIBUTING.md` URLs
- `CODE_OF_CONDUCT.md` references
- `mkdocs.yml` site_url, repo_url
- CI workflow URLs (`gh pr`, `gh run` commands)
- `install.sh` download URLs

---

## Phase 2: Directory & Package Renaming

### 2.1 Rename Top-Level Directories
| Current | Target |
|---------|--------|
| `nexus-cli/` | `sensibledb-cli/` |
| `nexus-db/` | `sensibledb-db/` |
| `nexus-explorer/` | `sensibledb-explorer/` |
| `nexus-container/` | `sensibledb-container/` |
| `nexus-macros/` | `sensibledb-macros/` |
| `nql-tests/` | `nql-tests/` (keep — NQL is the query language name) |

### 2.2 Update Root `Cargo.toml` Workspace Members
```toml
# Before
members = ["nexus-cli", "nexus-db", "nexus-explorer", "nexus-container", "nexus-macros"]

# After
members = ["sensibledb-cli", "sensibledb-db", "sensibledb-explorer", "sensibledb-container", "sensibledb-macros"]
```

### 2.3 Update Each Crate's `Cargo.toml`
| Crate | Field | Before | After |
|-------|-------|--------|-------|
| `sensibledb-cli` | `name` | `nexus-cli` | `sensibledb-cli` |
| `sensibledb-cli` | `description` | "NexusDB CLI" | "SensibleDB CLI" |
| `sensibledb-db` | `name` | `nexus-db` | `sensibledb-db` |
| `sensibledb-db` | `description` | "NexusDB engine" | "SensibleDB engine" |
| `sensibledb-explorer` | `name` | `nexus-explorer` | `sensibledb-explorer` |
| `sensibledb-container` | `name` | `nexus-container` | `sensibledb-container` |
| `sensibledb-macros` | `name` | `nexus-macros` | `sensibledb-macros` |

### 2.4 Update Inter-Crate Dependencies
Every `Cargo.toml` that references `nexus-db`, `nexus-cli`, etc. must be updated to `sensibledb-db`, `sensibledb-cli`, etc.

**Files affected:** ~15 `Cargo.toml` files across the workspace

### 2.5 Update `Cargo.lock`
- Run `cargo generate-lockfile` after all Cargo.toml updates
- Verify `cargo build --workspace` succeeds

---

## Phase 3: Code-Level Text Replacement

### 3.1 Scope: 3,086 occurrences across 307 files

### 3.2 Replacement Categories

#### A. Product Names (case-sensitive)
| Find | Replace | Context |
|------|---------|---------|
| `NexusDB` | `SensibleDB` | Product name in strings, docs, comments |
| `Nexus` | `SensibleDB` | When used as product shorthand |
| `nexusdb` | `sensibledb` | URLs, package names, module paths |
| `NEXUS` | `SENSIBLE` | Environment variables, constants |

#### B. Module/Import Paths
| Find | Replace | Files |
|------|---------|-------|
| `use nexus_db` | `use sensibledb_db` | All Rust source files |
| `use nexus_cli` | `use sensibledb_cli` | Rust source files |
| `nexus_gateway` | `sensibledb_gateway` | Rust source (internal module) |
| `nexus_engine` | `sensibledb_engine` | Rust source (internal module) |
| `nexusc` | `sensibledbc` | Rust source (compiler module) |

#### C. Configuration Files
| File | Changes |
|------|---------|
| `nexus-explorer/tauri.conf.json` | `productName: "SensibleDB Explorer"`, `identifier: "com.sensible-db.explorer"` |
| `mkdocs.yml` | `site_name: "SensibleDB"`, `repo_name: "Sensible-Analytics/SensibleDB"` |
| `.github/workflows/*.yml` | All job names, step names, references |

#### D. CLI Commands & Help Text
| File | Changes |
|------|---------|
| `sensibledb-cli/src/main.rs` | CLI app name, help text |
| `sensibledb-cli/src/commands/*.rs` | Command descriptions mentioning NexusDB |

### 3.3 What NOT to Change
- `NQL` — the query language name stays (NexusQL → keep as NQL)
- `nexus.toml` → rename to `sensibledb.toml` (config file)
- Git history — do NOT rewrite (too destructive)

---

## Phase 4: Icon & Brand Assets

### 4.1 Current State
| File | Status |
|------|--------|
| `assets/sensible-db-logo.svg` | ✅ Already exists — SensibleDB logo |
| `assets/sensible-db-icon.svg` | ✅ Already exists — SensibleDB icon |
| `assets/full_logo.png` | ❌ Old NexusDB logo — replace |
| `nexus-explorer/icons/128x128.png` | ❌ Old icon — replace |
| `nexus-explorer/icons/128x128@2x.png` | ❌ Old icon — replace |
| `nexus-explorer/icons/32x32.png` | ❌ Old icon — replace |

### 4.2 Actions
1. **Replace `assets/full_logo.png`** → Export from `assets/sensible-db-logo.svg` as PNG
2. **Replace all `nexus-explorer/icons/*.png`** → Export from `assets/sensible-db-icon.svg` at required sizes:
   - `32x32.png` → 32×32px
   - `128x128.png` → 128×128px
   - `128x128@2x.png` → 256×256px (retina)
3. **Update `tauri.conf.json`** icon paths if needed
4. **Update `mkdocs.yml`** theme logo to use SensibleDB SVG

### 4.3 Favicon & Web Assets
- `nexus-explorer/src/frontend/index.html` — update `<title>`, `<link rel="icon">`
- `nexus-explorer/src/frontend/src/App.tsx` — update header brand text

---

## Phase 5: Documentation Rewrite

### 5.1 MkDocs Site (`docs/`)

#### Files to Update (all `.md` files in `docs/`)
| Directory | Files | Action |
|-----------|-------|--------|
| `docs/overview/` | about.md, when-to-use.md, distinctive-features.md | Rewrite intro, rename NexusDB → SensibleDB |
| `docs/getting-started/` | installation.md, intro.md | Update all commands, URLs, product names |
| `docs/features/` | overview.md, table-partitioning.md, table-partitioning-feature-plan.md | Update references |
| `docs/cli/` | getting-started.md | Update CLI name, commands |
| `docs/nexusql/` | overview.md | Consider renaming to `docs/nql/` |
| `docs/sdks/` | overview.md | Update SDK references |
| `docs/programming-interfaces/` | 5-minutes.md | Update examples |
| `docs/architecture/` | diagrams/system-context.mmd | Update diagram labels |
| `docs/design/` | explorer-redesign.md | Update product name |

### 5.2 Root Documentation Files
| File | Action |
|------|--------|
| `README.md` | Full rewrite — product name, badges, clone URL, quick start |
| `CONTRIBUTORS.md` | Update project name references |
| `CODE_OF_CONDUCT.md` | Update project name |
| `CONTRIBUTING.md` | Update repo URLs, project name |
| `ARCHITECTURAL_GUARDRAILS.md` | Update project name |
| `TASK_COMPLETION_SUMMARY.md` | Update project name |

### 5.3 MkDocs Configuration (`mkdocs.yml`)
```yaml
site_name: SensibleDB
site_description: SensibleDB - The graph database for connected data
repo_name: Sensible-Analytics/SensibleDB
repo_url: https://github.com/Sensible-Analytics/SensibleDB
edit_uri: edit/main/docs/

nav:
  - Home: index.md
  - Getting Started:
    - Introduction: getting-started/intro.md
    - Installation: getting-started/installation.md
  # ... rest stays the same
```

### 5.4 Crate-Level Documentation
- `nexus-db/src/lib.rs` — update `//!` doc comments
- `nexus-cli/src/lib.rs` — update doc comments
- `nexus-cli/README.md` — update
- `nexus-cli/TESTING.md` — update
- `nexus-cli/ENTERPRISE_CLI_TEST_PLAN.md` — update
- `nexus-db/src/nexusc/analyzer/README.md` — update
- `nexus-db/src/nexusc/generator/README.md` — update
- `nexus-db/src/nexusc/parser/README.md` — update
- `nexus-db/src/nexus_engine/tests/README.md` — update
- `nql-tests/README.md` — update

---

## Phase 6: CI/CD & Infrastructure

### 6.1 GitHub Actions (`.github/workflows/`)
| Workflow | Changes |
|----------|---------|
| `e2e-tests.yml` | Update job names, repo references |
| `cli_tests.yml` | Update if uncommented |
| Any other workflows | Update repo URLs, package names |

### 6.2 Docker
| File | Changes |
|------|---------|
| `nexus-db/Dockerfile` | Update image name, labels |
| `nexus-container/Cargo.lock` | Regenerate after rename |

### 6.3 Install Script
| File | Changes |
|------|---------|
| `nexus-cli/install.sh` | Update download URLs, binary name |

---

## Phase 7: Config File Renaming

### 7.1 User Config Files
| Current | Target |
|---------|--------|
| `nexus.toml` | `sensibledb.toml` |
| `.nexus/` directory | `.sensibledb/` |

### 7.2 Files to Update for Config Path Changes
- `sensibledb-cli/src/config.rs` — default config path
- `sensibledb-cli/src/project.rs` — project file detection
- `sensibledb-cli/src/commands/init.rs` — template generation
- All `nql-tests/tests/*/nexus.toml` → rename to `sensibledb.toml`

---

## Execution Order & Dependencies

```
Phase 1 (Repo Rename) ──────────────────────────────────────┐
                                                            │
Phase 2 (Directory Rename) ──→ Phase 2.5 (Cargo.lock) ──────┤
                              │                              │
Phase 3 (Code Text Replace) ──┘                              │
                              │                              │
Phase 4 (Icons) ──────────────┤                              │
                              │                              │
Phase 5 (Documentation) ──────┤                              │
                              │                              │
Phase 6 (CI/CD) ──────────────┤                              │
                              │                              │
Phase 7 (Config Files) ───────┘                              │
                                                             │
                          ┌──────────────────────────────────┘
                          │
                     VERIFY: cargo build --workspace
                     VERIFY: cargo test --workspace
                     VERIFY: npx playwright test
                     VERIFY: mkdocs build
                     VERIFY: gh workflow run
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Broken inter-crate dependencies | HIGH | Update all Cargo.toml files atomically in one commit |
| CI pipeline failures | MEDIUM | Test locally with `cargo build --workspace` before pushing |
| Documentation link rot | LOW | Use search-and-replace with regex for URLs |
| Git history confusion | LOW | Do NOT rewrite history; use `git mv` for renames |
| Icon export quality | LOW | Use SVG source files for clean exports |

---

## Estimated Effort

| Phase | Effort | Parallelizable |
|-------|--------|----------------|
| Phase 1: Repo Rename | 5 min | No |
| Phase 2: Directory Rename | 30 min | No |
| Phase 3: Code Text Replace | 1 hour | Yes (by crate) |
| Phase 4: Icons | 15 min | No |
| Phase 5: Documentation | 2 hours | Yes (by doc section) |
| Phase 6: CI/CD | 30 min | Yes |
| Phase 7: Config Files | 30 min | No |
| **Verification** | **1 hour** | No |
| **Total** | **~5 hours** | |

---

## Success Criteria

1. `cargo build --workspace` succeeds with zero errors
2. `cargo test --workspace` passes all tests
3. `npx playwright test` passes all 65 E2E tests
4. `mkdocs build` produces clean documentation site
5. All GitHub Actions workflows pass on push
6. `sensibledb-cli --help` shows "SensibleDB CLI" branding
7. SensibleDB Explorer shows SensibleDB branding in UI
8. No remaining references to "NexusDB" in user-facing text (code-internal module names acceptable)
9. GitHub repository accessible at `github.com/Sensible-Analytics/SensibleDB`
10. All documentation links resolve correctly
