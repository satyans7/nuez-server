#!/bin/bash

update_repo(){
  echo "pulling the latest changes"
  git pull
  # touch working.txt
}
# Run the update function
update_repo