# Production Deployment

Deploying to production is no different than running the project locally,
preferably, you should have a CI/CD pipeline that will deploy the project to production.

But in some cases, that may be an overhead, so this are the steps to run
the deployment manually

## 1. Make sure your Parameter Store is correctly setup

Parameters can be manually created in AWS or using SST Function helpers
right now the following parameters requires to be created:

`OpenaiApiKey`: Run the following command in your console to has access to your AWS account.

```bash
sst secret set OpenaiApiKey "my-secret-value"
```

## 2. Deploy the project

Deploying to production is quite easy, you just have to run the "deploy" command
If you want to tight the deployment to a specific stage you can use the `--stage` flag.

Furthermore, you can revisit the Documentation on how to automatically assign a Domain to your API
in the SST/Ion Documentation, which this project does not support as it is not needed for the author https://sst.dev/docs/custom-domains

```bash
sst deploy --stage production
```

## 3. Understanding the Deployment Process

The deployment process will take a few minutes, and you can follow the progress in the console,
it will take care for your for anything that needs resolved from the AWS side.
As example if you follow the sst.config file this are the action it will do for you:

- Creating the Hosted Zone
- Creating the SSL Certificates
- Creating the Domain and Route53 Record (if configured)
- Creating the API Gateway
- Creating the Lambda Functions
- Creating the DynamoDB Tables
- Creating the S3 Buckets
- Creating the SQS Queues
- Associating Permissions to Specific resources based on your [link] instructions
- And much more (this is a high level overview)

## 4. Understanding Deployment costs

Depending on your account, you might will be getting into AWS Costs
while this project may fall in the free tier for most of the AWS services
Please make sure that you understand that you may incur into costs
