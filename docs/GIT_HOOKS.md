# Git Hooks Documentation

This document provides an overview of the Git hooks used in this project.

## 1. `commit-msg` Hook

**Purpose**: Ensures commit messages follow the Conventional Commits format, conventional commits
messages will also be used to automatically created the software version.

**Location**: `git-hooks/commit-msg`

**functionality**:

- Reads the commit message.
- Validates it against a regex pattern.
- If invalid, prints an error and aborts the commit.

## 2. `pre-commit` Hook

**Purpose**: Formats and lint-fix staged files before committing

**Location**: `git-hooks/pre-commit`

**functionality**:

- Runs Prettier on staged .js and .ts files.
- Adds formatted files back to the commit.
- Runs ESLint with --fix on staged files.
- Adds auto-fixed files back to the commit.
- When Linting errors it still allows you to commit to avoid blocking speed.

## 3. `pre-push` Hook

**Purpose**: (Optional) Runs ESLint on all files and disallows pushing if there are errors, it also run the
codebase test, making sure that your pushed changes will pass in the PR Pipelines.

**Location**: `git-hooks/pre-push`

**functionality**:

- Runs ESLint on all files in the ./src directory.
- If ESLint finds errors, the push is aborted.
- Runs the test suite
- If Tests find errors, the push is aborted.
