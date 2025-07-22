# GitHub Repository Setup Commands

After creating your repository on GitHub, run these commands in order:

## 1. Add the remote repository
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## 2. Verify the remote was added correctly
```bash
git remote -v
```

## 3. Push to GitHub
```bash
git push -u origin main
```

## 4. Verify everything is working
```bash
git status
```

## Example (replace with your actual repository URL):
```bash
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values
git remote add origin https://github.com/yuha-kim/vm-agent-bulk-visualization.git
git push -u origin main
```

## If you encounter authentication issues:
- Make sure you're signed into GitHub
- You might need to use a Personal Access Token instead of password
- GitHub may prompt you to authenticate via browser

## Future workflow:
After initial setup, you can use these commands for ongoing development:
```bash
git add .                    # Stage changes
git commit -m "Your message" # Commit changes
git push                     # Push to GitHub
``` 