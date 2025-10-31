# Vercel CI/CD Setup Guide

This guide explains how to set up automatic preview deployments on Vercel for pull requests.

## Overview

When a pull request is created against the `master` branch, a preview deployment will automatically be created on Vercel. The deployment URL will be:
- Posted as a comment on the PR
- Visible in the GitHub Actions run output

## Prerequisites

1. A Vercel account
2. The project connected to Vercel
3. GitHub repository secrets configured

## Setup Steps

### 1. Create a Vercel Account and Project

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Import your GitHub repository or create a new project
3. Configure the project settings:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 2. Get Vercel Credentials

#### Get Vercel Token
1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Set scope to "Full Account"
5. Copy the token (you won't be able to see it again)

#### Get Vercel Organization ID
1. Go to your [Vercel Account Settings](https://vercel.com/account)
2. Copy your **Team ID** or **User ID** (this is your ORG_ID)
   - For personal accounts, this is under "Your ID"
   - For team accounts, go to Team Settings

#### Get Vercel Project ID
1. Go to your project on Vercel
2. Click on "Settings"
3. Scroll down and copy the **Project ID**

**Alternative method using Vercel CLI:**
```bash
npm i -g vercel
vercel login
vercel link
cat .vercel/project.json
```

The `.vercel/project.json` file will contain both `orgId` and `projectId`.

### 3. Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VERCEL_TOKEN` | Your Vercel token from step 2 | `abc123...` |
| `VERCEL_ORG_ID` | Your Vercel organization/user ID | `team_xxxxx` or `user_xxxxx` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | `prj_xxxxx` |

### 4. Test the Setup

1. Create a new branch
   ```bash
   git checkout -b test-deployment
   ```

2. Make a small change and commit
   ```bash
   git commit --allow-empty -m "Test: trigger preview deployment"
   ```

3. Push the branch
   ```bash
   git push origin test-deployment
   ```

4. Create a pull request against `master`

5. Check the **Actions** tab in your GitHub repository
   - You should see the "Preview Deployment" workflow running
   - Once complete, a comment with the deployment URL will be added to your PR

## Workflow Details

The workflow does the following:
1. Checks out the code
2. Sets up Node.js 18
3. Installs dependencies using `npm ci`
4. Builds the project using `npm run build`
5. Deploys to Vercel
6. Comments the deployment URL on the PR
7. Displays the URL in the workflow output

## Troubleshooting

### Workflow fails with "VERCEL_TOKEN not found"
- Ensure you've added all three secrets to your repository
- Secret names must match exactly (case-sensitive)

### Deployment fails with "Project not found"
- Verify your `VERCEL_PROJECT_ID` is correct
- Ensure the project exists in your Vercel account

### Build fails
- Test the build locally: `npm run build`
- Check the workflow logs for specific error messages

### No comment on PR
- Check that the workflow has `pull-requests: write` permission
- Verify the workflow completed successfully

## Additional Configuration

### Custom Domain
If you want to use a custom domain for preview deployments, add this to `vercel.json`:
```json
{
  "alias": ["your-preview-domain.com"]
}
```

### Environment Variables
To add environment variables for Vercel deployments:
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add your variables (they'll be available in all deployments)

## Files Created

- `vercel.json` - Vercel configuration
- `.github/workflows/preview-deployment.yml` - GitHub Actions workflow

## Support

For issues with:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **GitHub Actions**: Check the Actions tab in your repository
- **This setup**: Review the workflow logs for detailed error messages
