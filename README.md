# Dependency Graveyard 🪦

**Is your Node.js project haunted by dead dependencies?**

`Dependency Graveyard` scans your `package.json` against the npm registry to identify:
- 🚫 **Abandoned packages** (last update > 2 years ago)
- ⚠️ **Deprecated packages** (marked as deprecated by author)
- 🔒 **Security risks** (coming soon via audit integration)

## Why use this?
Stale dependencies are a security risk and a maintenance burden. Identifying them early prevents "software rot".

## Installation

No installation required. Run directly with `npx` (soon) or clone and run:

```bash
git clone https://github.com/geniomido/dependency-graveyard.git
cd dependency-graveyard
node dependency_graveyard.js
```

## Usage

Run the script in the root of your Node.js project:

```bash
# Scan current directory
node /path/to/dependency_graveyard.js

# Scan specific directory
node /path/to/dependency_graveyard.js /path/to/your/project
```

## Output Example

```
Found 42 dependencies. Scanning...
[WARN] request: Deprecated (Use 'axios' or 'node-fetch' instead)
[DEAD] jade: Last updated 8 years ago (2015-12-30)
...
Summary: 2 Dead, 1 Deprecated.
```

## License
MIT © Geniom
