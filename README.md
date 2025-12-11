# Azure Container Instance CI/CD Pipeline (Node.js + Docker + GitHub Actions)

This repository demonstrates a minimal, production-minded CI/CD pipeline that builds and deploys a containerized Node.js application to Azure Container Instances (ACI) using GitHub Actions and OpenID Connect (OIDC) for password-less Azure authentication.

Purpose: a hands-on example for containerizing a Node.js app, pushing images to Azure Container Registry (ACR), and deploying to ACI via an automated GitHub Actions workflow.

## Key Features
- Node.js + Express application packaged in Docker
- Image hosting in Azure Container Registry (ACR)
- Automated build, tag, push, and deploy via GitHub Actions
- Secure Azure authentication using OIDCFederated Identity Credentials (no service principal secret stored in repo)
- Deployment target: Azure Container Instances (ACI)

## Project structure
- `index.js` — Minimal Express server (port 3000)
- `Dockerfile` — Container build instructions
- `.github/workflows/deploy.yml` — GitHub Actions CI/CD workflow
- `package.json` — Node.js metadata and dependencies

## Prerequisites
Before enabling the workflow, prepare the following Azure resources and GitHub configuration.

1. Azure resources
   - Resource Group (e.g., `study-rg`)
   - Azure Container Registry (ACR) (e.g., `ajaystudyacr`, login server: `ajaystudyacr.azurecr.io`)
   - Azure Container Instance (ACI) (e.g., `sample-node-container`) — the workflow will create/update this

2. App Registration + OIDC Federated Credential (recommended)
   - Create an Azure App Registration for GitHub Actions.
   - Add a Federated Credential with:
     - Issuer: `https://token.actions.githubusercontent.com`
     - Subject: `repo:<owner>/<repo>:ref:refs/heads/main` (adjust branch as needed)
   - Assign RBAC:
     - `Contributor` (resource-group or subscription) to allow creating/updating ACI
     - `AcrPush` on the ACR to allow pushing container images

3. GitHub repository secrets
Add these repository secrets (Settings → Secrets & variables → Actions):
- `AZURE_CLIENT_ID` — App Registration (client) ID
- `AZURE_TENANT_ID` — Azure Tenant ID
- `AZURE_SUBSCRIPTION_ID` — Azure Subscription ID
- `ACR_ADMIN_PASSWORD` — ACR admin password (only used here for simplicity; consider a service principal or managed identity for production image pulls)

### CI/CD Workflow (`deploy.yml`)

The GitHub Actions workflow triggers on every push to the `main` branch and executes the following sequence:

1.  **Checkout repository:** Gets the latest code.
2.  **Azure Login via OIDC:** Authenticates securely using the configured Federated Credential.
3.  **Build Docker image:** Creates the `sample-node:latest` image.
4.  **Login to ACR:** Authenticates to `ajaystudyacr.azurecr.io`.
5.  **Tag and Push image:** Tags the local image and pushes it to the ACR.
6.  **Deploy to ACI:** Executes an `az container create` command. The command uses the new image to **delete and recreate** the ACI instance, ensuring the latest image is always pulled.

> **💡 Important Learning on ACI Pull Behavior:** Azure Container Instances often cache images. The most reliable method to force an update is to **delete the existing container and recreate it** with the same parameters, ensuring the new image is pulled from ACR. For zero-downtime, the **Blue-Green Deployment** strategy is the real-world standard.


## **What I Learned**

### ✔ How to build and dockerize a Node.js app

### ✔ How to push images to Azure Container Registry

### ✔ Deploying to Azure Container Instances

### ✔ OIDC-based GitHub → Azure authentication (production-grade)

### ✔ Automating deployments with GitHub Actions

### ✔ How ACI handles images (pull behavior, caching)

### ✔ Why restarts/stop-start doesn’t always update

### ✔ Delete + recreate as the simplest student-friendly method

### ✔ Blue-Green deployment as the real production pattern

---

##  Final Result

Whenever you push to the **main** branch:

* A new Docker image is built
* Pushed to ACR
* ACI is redeployed automatically
* Your public endpoint updates after restart/recreate

End-to-end automated deployment system designed exactly like production.

