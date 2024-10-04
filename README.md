# media-accessibility 

[![Maintainability](https://api.codeclimate.com/v1/badges/ed55f20fe3ffd64832af/maintainability)](https://codeclimate.com/github/ecarrizo2/media-accessibility/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ed55f20fe3ffd64832af/test_coverage)](https://codeclimate.com/github/ecarrizo2/media-accessibility/test_coverage)

Work In Progress.

TLDR;
I'm exploring opportunities to gain velocity by having this as a base project
that I can form, remove some of the domain logic and have a new project up and running in no time.

This projects is a POC for several tools:

- Using SST/Ion for Infrastructure as a code and Resource management such as API and Queues Routing, SSL, DNS, etc
- Using TSyringe for Dependency Injection without having to use a framework like NestJS
- Using GitHub Actions for CI/CD

This project in particular solves a problem for some of my other side projects
which is to provide a way to analyse images and create speech from these analysed images description,
the goal is to be using the generated data to add accessibility features to my other projects.

The idea is to be solely used for my own projects and not for commercial purposes.

## For Reviewers and Developers

If you are looking to review/develop/fork this project, please refer to the following documentation:

- [Running the project locally](docs/LOCAL_DEVELOPMENT)
- [Project Structure](docs/PROJECT_STRUCTURE)
- [Git Hooks Documentation](docs/GIT_HOOKS)
- [Conventional Commits](docs/CONVENTIONAL_COMMITS)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- PR Verification Checklist
- CI/CD
