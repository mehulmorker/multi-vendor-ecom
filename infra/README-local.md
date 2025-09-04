# Local Development Infrastructure

This document provides instructions for setting up and running the local development infrastructure using Docker Compose.

## Services Included

- PostgreSQL (Database)
- Redis (Cache)
- Kafka (Event Streaming)
- Zookeeper (for Kafka)
- Elasticsearch (Search)
- Minio (S3 Compatible Storage)
- Keycloak (Authentication & Authorization)
- ClickHouse (Analytics Database - Placeholder)

## Getting Started

1.  **Ensure Docker is Running**: Make sure Docker Desktop or your Docker daemon is running on your machine.

2.  **Start Infrastructure**: Navigate to the project root and run the following command to start all services in detached mode:

    ```bash
    yarn infra:up
    ```

3.  **Verify Services (Optional)**: You can check the status of your Docker containers:
    ```bash
    docker-compose -f ./infra/docker-compose.yml ps
    ```

## Important Credentials & Access

| Service           | Host        | Port(s)                        | User         | Password     | Notes                                                          |
| :---------------- | :---------- | :----------------------------- | :----------- | :----------- | :------------------------------------------------------------- |
| **PostgreSQL**    | `localhost` | `5432`                         | `user`       | `password`   | Database: `ecom_db`                                            |
| **Redis**         | `localhost` | `6379`                         | N/A          | N/A          |                                                                |
| **Kafka**         | `localhost` | `9092`                         | N/A          | N/A          |                                                                |
| **Elasticsearch** | `localhost` | `9200`, `9300`                 | N/A          | N/A          | No security enabled for local development                      |
| **Minio (S3)**    | `localhost` | `9000` (API), `9001` (Console) | `minioadmin` | `minioadmin` | Access Minio Console at `http://localhost:9001`                |
| **Keycloak**      | `localhost` | `8080`                         | `admin`      | `admin`      | Access Keycloak Admin Console at `http://localhost:8080/admin` |
| **ClickHouse**    | `localhost` | `8123`, `9000`                 | `user`       | `password`   | Database: `analytics_db`                                       |

## Stopping Infrastructure

To stop and remove all the services defined in `docker-compose.yml`, run:

```bash
yarn infra:down
```

This will stop the containers and remove the networks and volumes created by `docker-compose up`.
