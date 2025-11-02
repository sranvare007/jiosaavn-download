# Deployment Guide

This project is configured for automatic deployment to Vercel using GitHub Actions.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A GitHub repository for this project
3. Node.js and npm installed locally

## Setup Instructions

### 1. Create a Vercel Project

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### 2. Get Vercel Credentials

You need three pieces of information from Vercel:

#### A. Vercel Token
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token (you won't be able to see it again!)

#### B. Vercel Organization ID
1. Go to your Vercel project settings
2. Click on "General" tab
3. Scroll down to "Project ID" section
4. Copy your **Team/Organization ID** (starts with `team_...` or `org_...`)

Alternatively, install Vercel CLI and run:
```bash
npm i -g vercel
vercel login
vercel link
cat .vercel/project.json
```

#### C. Vercel Project ID
1. In the same "General" settings page
2. Copy your **Project ID** (starts with `prj_...`)

Or from the CLI output above, look for `"projectId"`

### 3. Add GitHub Secrets

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click "New repository secret"
4. Add the following three secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `VERCEL_TOKEN` | Your Vercel API token | `abc123...` |
| `VERCEL_ORG_ID` | Your Vercel Organization/Team ID | `team_abc123` or `org_xyz789` |
| `VERCEL_PROJECT_ID` | Your Vercel Project ID | `prj_abc123xyz` |

### 4. How It Works

Once set up, the workflow will:

- **On Push to `master` branch**:
  - Install dependencies
  - Run tests (if any)
  - Build the project
  - Deploy to **Production** on Vercel

- **On Pull Request**:
  - Install dependencies
  - Run tests (if any)
  - Build the project
  - Deploy a **Preview** deployment on Vercel

### 5. Verify Deployment

1. Push a commit to the `master` branch:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin master
   ```

2. Go to the "Actions" tab in your GitHub repository
3. You should see the workflow running
4. Once complete, check your Vercel dashboard for the deployment

### 6. View Deployment

- **Production URL**: `https://your-project-name.vercel.app`
- **Custom Domain**: Can be configured in Vercel project settings

## Troubleshooting

### Workflow Fails

1. Check the Actions tab for error logs
2. Verify all three secrets are correctly set
3. Ensure your Vercel project exists and is linked

### Build Fails

1. Test the build locally first: `npm run build`
2. Check for any environment variables needed
3. Review build logs in GitHub Actions

### Deployment Fails

1. Verify Vercel token is valid and not expired
2. Check that Organization ID and Project ID are correct
3. Ensure your Vercel account has sufficient quota

## Manual Deployment (Alternative)

If you prefer to deploy manually or the CI/CD isn't set up yet:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Environment Variables

If your app requires environment variables:

1. Add them in Vercel Project Settings → Environment Variables
2. For GitHub Actions, add them as GitHub Secrets
3. Reference them in the workflow file

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
