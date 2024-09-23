# media-accessibility

Work In Progress.

TLDR;
I'm exploring opportunities to gain velocity by having this as a base project
that I can form, remove some of the domain logic and have a new project up and running in no time.

This projects is a POC for several tools:

- Using SST/Ion for Infrastructure as a code and Resource management such as API and Queues Routing, SSL, DNS, etc
- Using TSyringe for Dependency Injection without having to use a framework like NestJS
- Using Github Actions for CI/CD

This project in particular solves a problem for some of my other side projects
which is to provide a way to analyse images and create speech from these analysed images description,
the goal is to be using the generated data to add accessibility features to my other projects.

The idea is to be solely used for my own projects and not for commercial purposes.

## Project Structure

### `src/domain`

Contains the core business logic and domain entities.

- `entities`: Defines the domain entities.
- `enums`: Contains enumerations used across the domain.
- `errors`: Custom error classes for domain-specific exceptions.
- `repositories`: Interfaces for data access layers.
- `services`: ...

### `src/application`

Contains the application layer, which includes command and query handlers and other application services.

- `command-handlers`: Handlers for commands.
- `commands`: Command definition.
- `query-handlers`: Handlers for queries.'
- `queries`: Query definition.
- `services`: Application services that are not part of the domain

### `src/infrastructure`

Contains the infrastructure layer, which includes implementations of repositories and other external services.

- `repositories`: Concrete implementations of the domain repository interfaces.
- `services`: Other type of Services such as Integration with third party services.

### `src/interfaces`

Contains the interface adapters, such as API Request Handlers and Event Subscriber Handlers.

### `src/shared`

Contains shared services that can be used across the codebase.

## Flow Charts
