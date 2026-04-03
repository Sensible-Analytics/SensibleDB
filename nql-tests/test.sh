#!/bin/bash



# Check if file number argument is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <file_number>"
    exit 1
fi

file_name=$1


nexus compile --path "/Users/xav/GitHub/nexus-db-core/nql-tests/tests/$file_name" --output "/Users/xav/GitHub/nexus-db-core/nexus-container/src"
output=$(cargo check --manifest-path "/Users/xav/GitHub/nexus-db-core/nexus-container/Cargo.toml")
if [ $? -ne 0 ]; then
    echo "Error: Cargo check failed"
    echo "Cargo check output: $output"
    exit 1
fi

echo "Cargo check passed"
