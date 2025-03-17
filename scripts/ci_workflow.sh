#!/bin/bash

# GraphAI CI Workflow Script
# This script is designed to be run in a CI environment to:
# 1. Execute all sample code
# 2. Generate execution result reports
# 3. Detect errors in sample scripts due to specification changes
# 4. Use LLM to generate fix proposals for broken samples
# 5. Add PR comments with reports and fix proposals

# Set up variables
REPORT_FILE="sample_execution_report.md"
FINAL_REPORT="graphai_samples_report.md"
SAMPLES_DIR="$(pwd)/packages/samples"
GRAPH_DATA_DIR="${SAMPLES_DIR}/graph_data"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
MAX_EXECUTION_TIME=30  # Maximum execution time in seconds
PR_NUMBER=""
REPO_OWNER=""
REPO_NAME=""
OPENAI_API_KEY=""
FAILED_SAMPLES_FILE="failed_samples.txt"
FIX_PROPOSALS_FILE="fix_proposals.md"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --pr-number)
      PR_NUMBER="$2"
      shift 2
      ;;
    --repo-owner)
      REPO_OWNER="$2"
      shift 2
      ;;
    --repo-name)
      REPO_NAME="$2"
      shift 2
      ;;
    --openai-api-key)
      OPENAI_API_KEY="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check required parameters
if [ -z "${PR_NUMBER}" ] || [ -z "${REPO_OWNER}" ] || [ -z "${REPO_NAME}" ]; then
    echo "Error: Missing required parameters."
    echo "Usage: $0 --pr-number <PR_NUMBER> --repo-owner <REPO_OWNER> --repo-name <REPO_NAME> [--openai-api-key <OPENAI_API_KEY>]"
    exit 1
fi

# Function to get PR diff
get_pr_diff() {
    echo "Getting PR diff for PR #${PR_NUMBER}..."
    gh pr diff ${PR_NUMBER} > pr_diff.txt
}

# Function to get PR description (may contain release notes)
get_pr_description() {
    echo "Getting PR description for PR #${PR_NUMBER}..."
    gh pr view ${PR_NUMBER} --json body -q .body > pr_description.txt
}

# Run the sample execution script
run_samples() {
    echo "Running sample execution script..."
    bash scripts/run_samples.sh
}

# Extract failed samples
extract_failed_samples() {
    echo "Extracting failed samples..."
    grep -B 2 "**Status**: ❌ Failed" "${FINAL_REPORT}" | grep "Sample path:" | sed 's/Sample path: //' > "${FAILED_SAMPLES_FILE}"
    
    if [ ! -s "${FAILED_SAMPLES_FILE}" ]; then
        echo "No failed samples found."
        return 0
    }
    
    echo "Failed samples:"
    cat "${FAILED_SAMPLES_FILE}"
    return 1
}

# Generate fix proposals using OpenAI
generate_fix_proposals() {
    echo "Generating fix proposals for failed samples..."
    
    if [ ! -s "${FAILED_SAMPLES_FILE}" ]; then
        echo "No failed samples to fix."
        return 0
    }
    
    if [ -z "${OPENAI_API_KEY}" ]; then
        echo "Warning: OpenAI API key not provided. Skipping fix proposal generation."
        return 1
    }
    
    # Create fix proposals file header
    cat > "${FIX_PROPOSALS_FILE}" << EOH
# GraphAI Sample Fix Proposals
Generated: ${TIMESTAMP}

This document contains fix proposals for samples that failed execution due to specification changes.

EOH
    
    # Process each failed sample
    while read -r sample_path; do
        sample_name=$(basename "${sample_path}")
        echo "Generating fix proposal for ${sample_name}..."
        
        # Add sample header to fix proposals
        cat >> "${FIX_PROPOSALS_FILE}" << EOS

## ${sample_name}

### Original Code

\`\`\`
$(cat "${sample_path}")
\`\`\`

### Error

\`\`\`
$(grep -A 20 "${sample_path}" "${REPORT_FILE}" | grep -m 1 -A 10 "Error:")
\`\`\`

### Fix Proposal

EOS
        
        # Generate fix proposal using OpenAI API
        curl -s https://api.openai.com/v1/chat/completions \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer ${OPENAI_API_KEY}" \
          -d "{
            \"model\": \"gpt-4\",
            \"messages\": [
              {
                \"role\": \"system\",
                \"content\": \"You are a helpful assistant that fixes GraphAI sample code that has broken due to specification changes. Analyze the code, error message, PR diff, and PR description to propose a fix.\"
              },
              {
                \"role\": \"user\",
                \"content\": \"I need to fix a GraphAI sample that is failing due to specification changes. Here is the relevant information:\\n\\nSample code:\\n$(cat "${sample_path}")\\n\\nError message:\\n$(grep -A 20 "${sample_path}" "${REPORT_FILE}" | grep -m 1 -A 10 "Error:")\\n\\nPR diff:\\n$(cat pr_diff.txt)\\n\\nPR description (may contain release notes):\\n$(cat pr_description.txt)\\n\\nPlease provide a fixed version of the sample code with an explanation of what was changed and why.\"
              }
            ],
            \"temperature\": 0.7,
            \"max_tokens\": 2000
          }" | jq -r '.choices[0].message.content' >> "${FIX_PROPOSALS_FILE}"
        
        echo "" >> "${FIX_PROPOSALS_FILE}"
    done < "${FAILED_SAMPLES_FILE}"
    
    echo "Fix proposals generated: ${FIX_PROPOSALS_FILE}"
    return 0
}

# Post comment to PR with report and fix proposals
post_pr_comment() {
    echo "Posting comment to PR #${PR_NUMBER}..."
    
    # Create comment file
    cat > pr_comment.md << EOC
# GraphAI Sample Execution Report

This is an automated comment from the GraphAI CI workflow.

## Summary

$(grep -A 5 "## Summary" "${FINAL_REPORT}")

## Failed Samples

$(grep -A 100 "## Failed Samples" "${FINAL_REPORT}" | grep -B 100 "## Timeout Samples" || grep -A 100 "## Failed Samples" "${FINAL_REPORT}")

EOC
    
    # Add fix proposals if available
    if [ -f "${FIX_PROPOSALS_FILE}" ] && [ -s "${FIX_PROPOSALS_FILE}" ]; then
        cat >> pr_comment.md << EOC
## Fix Proposals

Fix proposals have been generated for the failed samples. See the full report for details.

EOC
        
        # Add the first fix proposal as an example
        cat >> pr_comment.md << EOC
### Example Fix Proposal

$(grep -A 50 "## " "${FIX_PROPOSALS_FILE}" | head -n 50)

...

See the full report for more fix proposals.
EOC
    fi
    
    # Post comment to PR
    gh pr comment ${PR_NUMBER} --body-file pr_comment.md
    
    # Upload reports as artifacts if in GitHub Actions
    if [ -n "${GITHUB_ACTIONS}" ]; then
        echo "Uploading reports as artifacts..."
        mkdir -p artifacts
        cp "${REPORT_FILE}" artifacts/
        cp "${FINAL_REPORT}" artifacts/
        if [ -f "${FIX_PROPOSALS_FILE}" ]; then
            cp "${FIX_PROPOSALS_FILE}" artifacts/
        fi
    fi
}

# Main workflow
main() {
    echo "Starting GraphAI CI workflow..."
    
    # Get PR information
    get_pr_diff
    get_pr_description
    
    # Run samples and generate report
    run_samples
    
    # Extract failed samples
    extract_failed_samples
    
    # Generate fix proposals if there are failed samples
    if [ $? -ne 0 ]; then
        generate_fix_proposals
    fi
    
    # Post comment to PR
    post_pr_comment
    
    echo "GraphAI CI workflow completed."
}

# Run the main workflow
main
