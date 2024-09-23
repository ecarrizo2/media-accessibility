# Local Development

This document provides guidelines and instructions for setting up and running the project locally.

## Prerequisites

Ensure you have the following installed on your machine

- Node.js (v20.x or later)
- npm (v10.x or later)
- AWS CLI (configured with appropriate credentials)
- SST CLI (optional, you can work with the node_modules copy).

## Project Setup

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    For now this project do not have a `.env` variables (will expand this docs when ready), but you can find the 
    environment variables in the sst.config.ts at the `ENVIRONMENT` const until then.


4. **Set up AWS Secrets**:
    Ensure you have the necessary secrets set up in AWS Parameter Store, 
    currently there is only one secret used in the project to connect with OpenAPI, 
    if you do not have an account, you can use the mocked responses in the Appropriate service class
    ```
    sst secret set OpenaiApiKey "your-openai-api-key"
   ```

## Running the Project

1. **Start the SST local development environment**:
    ```
    sst dev
    ```

2. **Access the local API**:
    Once the SST environment is running, you can access the local API at the URL provided in the console output.

3. **Debugging Locally**:
   When running the project as `sst dev` it will create a watcher and you will
   be able to see the logs in your cli and update your dev deployment as files changes in your project.

   Additionally, if you want to use the sst console `https://console.sst.dev` it will
      provide you with a visual representation of your local environment, and lot of great features 
      to debug your project deployed in the cloud.

## Project Structure

Refer to the [Project Structure](./PROJECT_STRUCTURE.md) documentation for an overview of the project's directory layout and organization.

## Git Hooks

Refer to the [Git Hooks Documentation](GIT_HOOKS.md) for information on the Git hooks used in this project.

## Commit Message Guidelines

Follow the [Conventional Commits](CONVENTIONAL_COMMITS.md) specification for commit messages.

## Additional Resources

- [SST Documentation](https://sst.dev/docs/)
- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
```
