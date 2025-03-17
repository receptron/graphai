#!/bin/bash

# GraphAI Sample Fix Script
# This script generates fix proposals for failed GraphAI samples using OpenAI

# Set up variables
REPORT_FILE="sample_execution_report.md"
FINAL_REPORT="graphai_samples_report.md"
FAILED_SAMPLES_FILE="failed_samples.txt"
FIX_PROPOSALS_FILE="fix_proposals.md"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
OPENAI_API_KEY=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --openai-api-key)
      OPENAI_API_KEY="$2"
      shift 2
      ;;
    --sample)
      SAMPLE_PATH="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check required parameters
if [ -z "${OPENAI_API_KEY}" ]; then
    echo "Error: OpenAI API key is required."
    echo "Usage: $0 --openai-api-key <OPENAI_API_KEY> [--sample <SAMPLE_PATH>]"
    exit 1
fi

# Extract failed samples if no specific sample provided
if [ -z "${SAMPLE_PATH}" ]; then
    echo "Extracting failed samples from report..."
    
    if [ ! -f "${FINAL_REPORT}" ]; then
        echo "Error: Report file not found: ${FINAL_REPORT}"
        echo "Please run the sample execution script first."
        exit 1
    fi
    
    grep -B 2 "**Status**: ❌ Failed" "${FINAL_REPORT}" | grep "Sample path:" | sed 's/Sample path: //' > "${FAILED_SAMPLES_FILE}"
    
    if [ ! -s "${FAILED_SAMPLES_FILE}" ]; then
        echo "No failed samples found."
        exit 0
    fi
    
    echo "Failed samples:"
    cat "${FAILED_SAMPLES_FILE}"
else
    echo "${SAMPLE_PATH}" > "${FAILED_SAMPLES_FILE}"
fi

# Create fix proposals file header
cat > "${FIX_PROPOSALS_FILE}" << EOH
# GraphAI Sample Fix Proposals
Generated: ${TIMESTAMP}

This document contains fix proposals for samples that failed execution.

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
$(grep -A 20 "${sample_path}" "${REPORT_FILE}" | grep -m 1 -A 10 "Error:" || echo "Error information not available")
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
            \"content\": \"You are a helpful assistant that fixes GraphAI sample code that has broken. Analyze the code and error message to propose a fix.\"
          },
          {
            \"role\": \"user\",
            \"content\": \"I need to fix a GraphAI sample that is failing. Here is the relevant information:\\n\\nSample code:\\n$(cat "${sample_path}")\\n\\nError message:\\n$(grep -A 20 "${sample_path}" "${REPORT_FILE}" | grep -m 1 -A 10 "Error:" || echo "Error information not available")\\n\\nPlease provide a fixed version of the sample code with an explanation of what was changed and why.\"
          }
        ],
        \"temperature\": 0.7,
        \"max_tokens\": 2000
      }" | jq -r '.choices[0].message.content' >> "${FIX_PROPOSALS_FILE}"
    
    echo "" >> "${FIX_PROPOSALS_FILE}"
done < "${FAILED_SAMPLES_FILE}"

echo "Fix proposals generated: ${FIX_PROPOSALS_FILE}"
