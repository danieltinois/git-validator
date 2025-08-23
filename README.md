# 🚀 git-validator

A simple CLI tool to validate **commits** and **branches** following:

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

It automatically installs a **`pre-push` Git hook** that blocks invalid pushes.

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

This will automatically create the `.git/hooks/pre-push` hook.

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

### Invalid commits

- `login done`
- `adjustments`
- `bug fixed`

---

### Valid branches

- `feature/new-feature`
- `hotfix/fix-bug`
- `release/v1.0.0`
- `bugfix/minor-adjustment`

### Invalid branches

- `Bugfix/NewFeature` (uppercase not allowed)
- `fix/wrong-prefix` (prefix not allowed)
- `feature new` (spaces not allowed)

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

## 📌 Roadmap

- [ ] Allow configuration via `.gitvalidatorrc` (custom regex for commits/branches)
- [ ] Publish to npm
- [ ] Provide a GitHub Action for CI/CD validation
- [ ] GitLab CI support
