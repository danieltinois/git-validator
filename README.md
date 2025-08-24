# 🚀 git-validator

A simple CLI tool to validate **commits** and **branches** following:

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

It automatically installs a **`pre-push` Git hook** that blocks invalid pushes.  
Supports **custom configuration**, **detailed error reports**, and **auto-suggestions** for corrections.

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/danieltinois/git-validator.git
cd git-validator
npm install
npm run build
```

---

## ⚡ Usage

### 1. Install the hook in your repository

Inside the repository you want to protect, run:

```bash
npx git-validator init
```

This will automatically create the `.husky/pre-push` (if Husky is detected) or `.git/hooks/pre-push` hook.

---

### 2. Run validations manually

You can also validate manually:

```bash
# Validate a commit message
npx git-validator commit "feat: add login"

# Validate a branch name
npx git-validator branch "feature/new-feature"
```

---

## ✅ Examples

### Valid commits

- `feat: add login`
- `fix(auth): correct password hashing`
- `chore: update dependencies`
- `refactor(api): improve performance`
- `docs: update README`

### Invalid commits (with auto-suggestions)

- `fiz: corrigir bug no login`  
  → 💡 Example: `fix: corrigir bug no login`

- `WIP: implementando tela de login`  
  → 💡 Example: `feat: implementando tela de login`

- `corrigir bug no login`  
  → 💡 Example: `feat: corrigir bug no login`

- `feat: add a very very very very very very very very very very very long message`  
  → 💡 Example: `feat: add a very very very very very very very very very long...`

---

### Valid branches

- `feature/new-feature`
- `hotfix/fix-bug`
- `release/v1.0.0`
- `bugfix/minor-adjustment`
- `support/legacy`
- `feature/correção-login` ✅ (supports accents)

### Invalid branches (with auto-suggestions)

- `featuree/login`  
  → 💡 Example: `feature/login`

- `bug/login`  
  → 💡 Example: `bugfix/login`

- `login`  
  → 💡 Example: `feature/login`

- `feature/teste com espaço`  
  → 💡 Example: `feature/teste-com-espaço`

---

## ⚙️ Configuration

You can customize rules with a `.gitvalidatorrc.json` file in your project:

```json
{
  "commitTypes": ["feat", "fix", "chore", "docs", "refactor"],
  "branchPrefixes": ["feature", "hotfix", "release", "bugfix"],
  "maxCommitLength": 120
}
```

---

## 🔧 Development

Run in dev mode (without build):

```bash
npm run dev branch "feature/test"
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

---

## 🌍 Using in other projects

There are two ways to use it in other repositories:

### 1. Via `npx` (without global install)

Inside the project you want to protect:

```bash
npx git-validator init
```

This installs the `pre-push` hook and you’re ready to go 🚀

---

### 2. Global installation

If you want to use it in any project without installing locally:

```bash
npm install -g git-validator
```

Now in any repository:

```bash
git-validator init
```

---

## 🧪 Tests

We use **Jest** for automated tests.  
Examples covered:

- Commit autocorrections (`fiz` → `fix`, `fet` → `feat`, etc.)
- Blocking WIP/fixup/squash commits
- Branch autocorrections (`featuree/` → `feature/`, `bug/` → `bugfix/`)
- Unicode support (commits and branches with accents)

Run tests:

```bash
yarn jest
```

---

## 📌 Roadmap

- [x] Allow configuration via `.gitvalidatorrc`
- [x] Advanced commit validation (body, footer, BREAKING CHANGE, WIP, etc.)
- [x] Friendly error reports with auto-suggestions
- [x] Branch autocorrection with Unicode support
- [x] Jest automated tests
- [ ] Publish to npm
- [ ] Provide a GitHub Action for CI/CD validation
- [ ] GitLab CI support
- [ ] "fix" mode to auto-correct commits
- [ ] Strict mode (block WIP, fixup, squash, pushes to main)
