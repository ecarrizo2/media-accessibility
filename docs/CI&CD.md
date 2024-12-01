# CI/CD Workflows Documentation

This document provides an overview and detailed descriptions of the CI/CD workflows used in this project. Each workflow is designed to streamline development, testing, deployment, and release processes.

---

## Table of Contents

1. [Overview](#overview)
2. [Workflows](#workflows)

- [Deploy and Remove SST on PR Environment](#deploy-and-remove-sst-on-pr-environment)
- [PR Verification](#pr-verification)
- [CodeClimate](#codeclimate)
- [Release on Merge to Main](#release-on-merge-to-main)

3. [Secrets](#secrets)
4. [Best Practices](#best-practices)

---

## Overview

Our CI/CD pipelines aim to:

- **Automate repetitive tasks**: Deployment, testing, and release tagging.
- **Ensure code quality**: Enforce linting, formatting, and test coverage standards.
- **Reduce manual intervention**: Provide seamless staging environments for PRs and automate production releases.

These workflows are configured in GitHub Actions and triggered by specific events such as pull requests or commits to the `main` branch.

---

## Workflows

### 1. Deploy and Remove SST on PR Environment

**Purpose**:  
Automates the deployment of temporary staging environments for pull requests. These environments allow isolated testing of changes before merging.

#### Trigger

Triggered by the following pull request events:

- `opened`
- `synchronize`
- `reopened`
- `closed`

#### Jobs

- **Deploy**:  
  Deploys an SST application for the pull request stage. Skips deployment if `[no-depl]` is in the PR title.

- **Remove**:  
  Deletes the SST staging environment when the PR is closed.

#### Key Steps

- Checkout the code.
- Set up Node.js (v20).
- Install dependencies (`npm install`).
- Use `sst` to deploy or remove the stage based on the PR number.

#### Environment Variables

Uses AWS credentials and a secret API key (`OAPK`) for deployment.

---

### 2. PR Verification

**Purpose**:  
Validates code quality and style in pull requests targeting the `main` branch. Ensures all changes meet the project's standards before merging.

#### Trigger

- Pull requests targeting `main`.
- Manual trigger via `workflow_dispatch`.

#### Jobs

- **Format**:
  - Lint the code using `npm run lint`.
  - Check code style with `npm run prettier:check`.
  - Run unit tests and generate coverage reports (`npm run test:cov`).

#### Key Steps

- Checkout the code.
- Set up Node.js (v20).
- Install dependencies.
- Validate formatting, linting, and test coverage.

---

### 3. CodeClimate

**Purpose**:  
Reports code coverage metrics to Code Climate for monitoring over time and maintaining quality standards.

#### Trigger

Triggered by `push` events to the `main` branch.

#### Jobs

- **Report**:
  - Checkout code and set up Node.js.
  - Run tests and generate coverage reports.
  - Upload coverage data to Code Climate using the Test Reporter.

#### Key Steps

- Install the Code Climate Test Reporter.
- Generate and upload test coverage (`npm run test:cov`).

---

### 4. Release on Merge to Main

**Purpose**:  
Automates the release process by tagging the repository, creating GitHub releases, and generating release notes based on conventional commits.

#### Trigger

Triggered by `push` events to the `main` branch.

#### Jobs

- **Release**:
  - Determine the next semantic version using conventional commit messages.
  - Create a new Git tag.
  - Generate and publish a GitHub release with auto-generated notes.

#### Key Steps

1. Fetch all Git tags to determine the current version.
2. Calculate the next version using `conventional-recommended-bump`.
3. Create a Git tag for the new version.
4. Use `actions/create-release` to draft and finalize the release.

---

## Secrets

The following secrets must be configured in your GitHub repository:

| Secret Name             | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | AWS access key for SST deployment.                                        |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for SST deployment.                                        |
| `AWS_REGION`            | AWS region for deployment (e.g., `us-east-1`).                            |
| `GITHUB_TOKEN`          | Token for GitHub Actions to create releases.                              |
| `CODE_CLIMATE_API_KEY`  | API key for sending coverage reports to Code Climate.                     |
| `OAPK`                  | OpenAI API key for using OpenAI Connection secret configuration with SST. |

---

## Best Practices

1. **Use Conventional Commits**:  
   Ensure all commits follow the [conventional commits](https://www.conventionalcommits.org/) format for accurate versioning and release notes.

2. **Monitor Workflow Runs**:  
   Regularly review workflow runs in the GitHub Actions tab for failed jobs and address any issues promptly.

3. **Keep Dependencies Up-to-Date**:  
   Periodically update Node.js and NPM packages to ensure compatibility and security.

4. **Add Notifications**:  
   Consider integrating Slack or email notifications for key events, such as deployment success/failure or new releases.

5. **Use Separate Environments for Secrets**:  
   For staging and production, ensure secrets are environment-specific to avoid conflicts.
