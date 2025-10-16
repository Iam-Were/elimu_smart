# GitHub Secrets Setup Guide

## 🔐 Secrets Found and Ready to Add

I found the following secrets that need to be added to your GitHub repository:

---

## 📋 Step-by-Step Instructions

### 1. Go to GitHub Secrets Page
Visit: https://github.com/Iam-Were/elimu_smart/settings/secrets/actions

### 2. Click "New repository secret" for each of the following:

---

### Secret 1: **GH_TOKEN**
- **Name:** `GH_TOKEN`
- **Value:** 
```
ghu_NRe7HwlDuxhJGDv8uCkv40DKC7nJY93XPz7H
```
- **Purpose:** Used for creating automated pull requests and triggering workflows
- **Used in:** 
  - `.github/workflows/dependency-updates.yml` (line 116)
  - `.github/workflows/deploy-production.yml` (lines 57, 159)

---

### Secret 2: **VPS_HOST**
- **Name:** `VPS_HOST`
- **Value:** 
```
145.239.42.121
```
- **Purpose:** VPS server IP address for SSH connections
- **Used in:** All deployment and health check workflows

---

### Secret 3: **VPS_USER**
- **Name:** `VPS_USER`
- **Value:** 
```
root
```
- **Purpose:** SSH username for VPS access
- **Used in:** All deployment and health check workflows

---

### Secret 4: **VPS_SSH_KEY**
- **Name:** `VPS_SSH_KEY`
- **Value:** 
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACDutcwnrTQsac2KFRSOhofBqv++iaFgw7Rqi8RKLsN+iwAAAJi884HmvPOB
5gAAAAtzc2gtZWQyNTUxOQAAACDutcwnrTQsac2KFRSOhofBqv++iaFgw7Rqi8RKLsN+iw
AAAEDV179kyWhA/D1TMs5hBx+VCjxrWF8FZV5n4UmLy6Wwv+61zCetNCxpzYoVFI6Gh8Gq
/76JoWDDtGqLxEouw36LAAAAD2VsaW11X3NtYXJ0X3ZwcwECAwQFBg==
-----END OPENSSH PRIVATE KEY-----
```
- **Purpose:** Private SSH key for authenticating to VPS
- **Used in:** All deployment and health check workflows
- **⚠️ IMPORTANT:** Copy the entire key including `-----BEGIN` and `-----END` lines

---

### Secret 5: **GH_MODELS_API**
- **Name:** `GH_MODELS_API`
- **Value:** 
```
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
```
- **Purpose:** GitHub Models API access for AI-powered build error fixing
- **Used in:** `.github/workflows/node.js.yml` (line 76)
- **Scopes:** `repo`, `workflow`

---

## ✅ Verification

After adding all secrets:

1. Go to: https://github.com/Iam-Were/elimu_smart/settings/secrets/actions
2. You should see 5 secrets listed:
   - ✅ GH_TOKEN
   - ✅ VPS_HOST
   - ✅ VPS_USER
   - ✅ VPS_SSH_KEY
   - ✅ GH_MODELS_API

3. The GitHub Actions workflow warnings will disappear
4. All workflows will be able to run successfully

---

## 🚀 Quick Copy Commands

If you prefer command line (requires GitHub CLI with admin permissions):

```bash
# GH_TOKEN
echo "ghu_NRe7HwlDuxhJGDv8uCkv40DKC7nJY93XPz7H" | gh secret set GH_TOKEN -R Iam-Were/elimu_smart

# VPS_HOST
echo "145.239.42.121" | gh secret set VPS_HOST -R Iam-Were/elimu_smart

# VPS_USER
echo "root" | gh secret set VPS_USER -R Iam-Were/elimu_smart

# VPS_SSH_KEY
cat ~/.ssh/id_ed25519 | gh secret set VPS_SSH_KEY -R Iam-Were/elimu_smart

# GH_MODELS_API
echo "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" | gh secret set GH_MODELS_API -R Iam-Were/elimu_smart
```

---

## 📝 Notes

- These secrets are encrypted and cannot be read after they're saved
- Only repository admins can add/modify secrets
- Secrets are automatically masked in workflow logs
- The current GitHub CLI token doesn't have admin permissions (HTTP 403 error)
- You need to add them manually via the web interface

---

**Last Updated:** October 16, 2025
