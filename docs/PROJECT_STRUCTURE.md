## Project Structure

### `src/domain`

Contains the core business logic and domain entities.

- `entities`: Defines the domain entities.
- `enums`: Contains enumerations used across the domain.
- `errors`: Custom error classes for domain-specific exceptions.
- `repositories`: Interfaces for data access layers.
- `services`: Domain services that encapsulate business logic.

### `src/application`

Contains the application layer, which includes command and query handlers and other application services.

- `command-handlers`: Handlers for commands.
- `commands`: Command definitions.
- `query-handlers`: Handlers for queries.
- `queries`: Query definitions.
- `services`: Application services that are not part of the domain.
- `value-objects`: Different value objects that represent different domain concepts also used as DTOs to pass information between services.

### `src/infrastructure`

Contains the infrastructure layer, which includes implementations of repositories and other external services.

- `repositories`: Concrete implementations of the domain repository interfaces.
- `services`: Integrations with third-party services and other infrastructure-related services.

### `src/interfaces`

Contains the interface adapters, such as API request handlers and event subscriber handlers.

- `http`: API request handlers.
- `queue`: Event subscriber handlers.
- `shared`: Any shared code for the different interfaces.

### `src/shared`

Contains shared services and utilities that can be used across the codebase.
