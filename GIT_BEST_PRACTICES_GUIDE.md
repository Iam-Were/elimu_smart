# Git Best Practices Guide

A comprehensive guide to using Git effectively for software development projects.

## 🌳 Git Core Concepts

### Repository Structure
```
Remote Repository (GitHub/GitLab)
    ↕ git push/pull
Local Repository (.git folder)
    ↕ git commit/checkout
Staging Area (Index)
    ↕ git add/reset
Working Directory (Your files)
```

## 📋 Essential Git Workflow

### 1. Daily Development Flow
```bash
# Start work session
git pull origin main          # Get latest changes
git status                    # Check current state

# Make changes to files
# Edit code, add features, fix bugs

# Review changes
git status                    # See what changed
git diff                      # Review specific changes

# Stage changes
git add .                     # Stage all changes
git add specific-file.txt     # Stage specific file

# Commit changes
git commit -m "Clear, descriptive message"

# Share work
git push origin main          # Send to remote repository
```

### 2. Best Practices for Commits

#### Good Commit Messages:
```bash
# ✅ GOOD: Clear, specific, action-oriented
git commit -m "Fix user login validation error"
git commit -m "Add search functionality to dashboard"
git commit -m "Update documentation for API endpoints"

# ❌ BAD: Vague, unclear
git commit -m "fixes"
git commit -m "changes"
git commit -m "work in progress"
```

#### Commit Frequency:
```bash
# ✅ IDEAL: Small, logical commits
- Fix one bug per commit
- Add one feature per commit
- Update documentation separately
- Each commit should have a single purpose

# ❌ AVOID: Massive commits
- Don't commit 50 files with "lots of changes"
- Don't mix bug fixes with new features
- Don't commit broken/incomplete work
```

## 🔀 Branching Strategies

### Simple Branch Workflow (Recommended)
```bash
# Create feature branch
git checkout -b feature/user-authentication
git checkout -b fix/login-bug
git checkout -b docs/api-updates

# Work on branch
# Make commits as you develop

# Merge back to main
git checkout main
git pull origin main          # Get latest
git merge feature/user-authentication
git push origin main
git branch -d feature/user-authentication  # Clean up
```

### When to Use Branches:
- **New features** - Always use a branch
- **Bug fixes** - Use branch for complex fixes
- **Experiments** - Definitely use branches
- **Small fixes** - Can commit directly to main (if you're solo)

## 🛠️ Git Commands You Need Daily

### Status & Information
```bash
git status              # What's changed?
git log --oneline -10   # Recent commits
git diff                # What changed (unstaged)?
git diff --staged       # What's ready to commit?
git show HEAD           # Last commit details
```

### Making Changes
```bash
git add .               # Stage everything
git add file.txt        # Stage specific file
git commit -m "message" # Commit with message
git commit -am "msg"    # Stage and commit (tracked files only)
```

### Undoing Things
```bash
git restore file.txt    # Undo changes to file
git restore --staged .  # Unstage files
git reset HEAD~1        # Undo last commit (keep changes)
git reset --hard HEAD~1 # Undo last commit (lose changes)
```

### Remote Operations
```bash
git push origin main    # Send commits to remote
git pull origin main    # Get latest from remote
git fetch origin        # Check for updates (don't merge)
git remote -v           # Show remote repositories
```

## 🎯 Git Best Practices

### 1. Commit Early, Commit Often
```bash
# ✅ GOOD: Regular small commits
Day 1: "Add user model"
Day 1: "Add user validation"
Day 1: "Add user tests"
Day 2: "Fix validation edge case"

# ❌ BAD: Rare large commits
Week 1: "Complete user system with tests and fixes"
```

### 2. Write Meaningful Commit Messages
```bash
# ✅ EXCELLENT: Explains what and why
git commit -m "Fix React useEffect dependency warning in UserProfile

- Add userId to dependency array
- Prevents infinite re-renders
- Resolves console warning in development"

# ✅ GOOD: Clear what was done
git commit -m "Add user authentication validation"

# ❌ BAD: Doesn't help future you
git commit -m "stuff"
```

### 3. Keep Working Directory Clean
```bash
# Check status frequently
git status

# Clean state should show:
"On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean"
```

### 4. Use .gitignore Properly
```bash
# .gitignore file should exclude:
node_modules/
.env
*.log
dist/
build/
.DS_Store
```

## 🚨 Common Git Problems & Solutions

### "My commit history is messy"
```bash
# Interactive rebase to clean up
git rebase -i HEAD~3   # Edit last 3 commits
```

### "I committed to wrong branch"
```bash
# Move last commit to different branch
git checkout correct-branch
git cherry-pick main
git checkout main
git reset --hard HEAD~1
```

### "I need to undo my last commit"
```bash
# Keep the changes, undo commit
git reset --soft HEAD~1

# Lose the changes completely
git reset --hard HEAD~1
```

### "Files keep showing as modified"
```bash
# Line ending issues (Windows/Mac)
git config --global core.autocrlf true   # Windows
git config --global core.autocrlf input  # Mac/Linux
```

## ⚡ Pro Tips

### 1. Configure Git Properly
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"  # Use VS Code
```

### 2. Useful Aliases
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
```

### 3. Visual Tools Help
- **VS Code** - Built-in Git interface
- **GitHub Desktop** - Simple GUI
- **GitKraken** - Professional Git client
- **Command line + git log --graph** - Visual branch history

## 🎯 Git Workflow Examples

### For Solo Development:
```bash
# Daily workflow
git pull origin main
# Make changes
git add .
git commit -m "Descriptive message"
git push origin main
```

### For Team Development:
```bash
# Feature workflow
git checkout main
git pull origin main
git checkout -b feature/new-feature
# Make changes and commits
git checkout main
git pull origin main  # Get latest
git merge feature/new-feature
git push origin main
git branch -d feature/new-feature
```

## 📋 Git Command Cheat Sheet

### Basic Commands
| Command | Description |
|---------|-------------|
| `git init` | Initialize new repository |
| `git clone <url>` | Copy repository from remote |
| `git status` | Check working directory status |
| `git add <file>` | Stage file for commit |
| `git commit -m "message"` | Commit staged changes |
| `git push origin main` | Upload commits to remote |
| `git pull origin main` | Download and merge remote changes |

### Branching Commands
| Command | Description |
|---------|-------------|
| `git branch` | List branches |
| `git branch <name>` | Create new branch |
| `git checkout <branch>` | Switch to branch |
| `git checkout -b <branch>` | Create and switch to branch |
| `git merge <branch>` | Merge branch into current |
| `git branch -d <branch>` | Delete branch |

### History Commands
| Command | Description |
|---------|-------------|
| `git log` | Show commit history |
| `git log --oneline` | Compact commit history |
| `git diff` | Show unstaged changes |
| `git diff --staged` | Show staged changes |
| `git show <commit>` | Show specific commit |

### Undoing Commands
| Command | Description |
|---------|-------------|
| `git restore <file>` | Discard changes to file |
| `git restore --staged <file>` | Unstage file |
| `git reset HEAD~1` | Undo last commit (keep changes) |
| `git reset --hard HEAD~1` | Undo last commit (lose changes) |
| `git revert <commit>` | Create new commit that undoes previous |

## 🎓 Learning Resources

### Online Resources
- [Official Git Documentation](https://git-scm.com/doc)
- [GitHub Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [Learn Git Branching (Interactive)](https://learngitbranching.js.org/)

### Recommended Reading
- **Pro Git Book** (free online)
- **Git documentation** (git-scm.com)
- **GitHub Flow guide**
- **Git branching strategies**

## ⚠️ Important Notes

### Things to Never Do
- **Never** force push to shared branches (`git push --force`)
- **Never** commit passwords, API keys, or sensitive data
- **Never** commit large binary files (images, videos, executables)
- **Never** rewrite history on shared branches

### Things to Always Do
- **Always** pull before starting work
- **Always** review changes before committing (`git diff`)
- **Always** write clear commit messages
- **Always** keep commits focused and atomic

---

**Key Principle**: Git works best when you **commit small changes frequently** with **clear messages** that help you understand what you did and why you did it.

**Remember**: Git is a tool to help you track changes and collaborate effectively. Use it consistently, and it will make your development workflow much smoother and more reliable.