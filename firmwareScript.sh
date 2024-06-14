#!/bin/bash

# Variables
LOCAL_REPO_PATH="src/main/local-repo"
GITHUB_REPO_URL="https://github.com/priyansu1703/testFile.git"

# Function to update the repository
update_repo() {
  if [ ! -d "$LOCAL_REPO_PATH/.git" ]; then
    # Clone the repository if it doesn't exist
    echo "Cloning the repository..."
    git clone "$GITHUB_REPO_URL" "$LOCAL_REPO_PATH"
  else
    # Pull the latest changes if the repository exists
    echo "Pulling the latest changes..."
    cd "$LOCAL_REPO_PATH" || exit
    git pull
  fi
}

# Run the update function
update_repo


