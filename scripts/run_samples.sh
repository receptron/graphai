#!/bin/bash

# GraphAI Sample Execution Script
# This script executes GraphAI samples and records the execution results

# Set up variables
REPORT_FILE="sample_execution_report.md"
SAMPLES_DIR="$(pwd)/packages/samples"
GRAPH_DATA_DIR="${SAMPLES_DIR}/graph_data"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
MAX_EXECUTION_TIME=30  # Maximum execution time in seconds

# Create report header
cat > "${REPORT_FILE}" << EOH
# GraphAI Sample Execution Results
Generated: ${TIMESTAMP}

## Summary

This report contains the execution results of GraphAI samples.

## Sample Execution Results

EOH

# Function to execute a YAML sample
execute_yaml_sample() {
    local sample_path="$1"
    local sample_name=$(basename "${sample_path}")
    local sample_type="YAML"
    
    echo "Executing YAML sample: ${sample_name}..."
    
    # Add sample header to report
    cat >> "${REPORT_FILE}" << EOS

### ${sample_name} (${sample_type})

**Sample path**: ${sample_path}

EOS
    
    # Execute the sample with timeout
    local start_time=$(date +%s)
    timeout ${MAX_EXECUTION_TIME}s npx graphai_cli --file "${sample_path}" > /tmp/sample_output.txt 2>&1
    local exit_code=$?
    local end_time=$(date +%s)
    local execution_time=$((end_time - start_time))
    
    # Check execution result
    if [ ${exit_code} -eq 124 ]; then
        # Timeout
        cat >> "${REPORT_FILE}" << EOT
**Status**: ⚠️ Timeout
**Execution time**: ${execution_time}s (timed out after ${MAX_EXECUTION_TIME}s)

\`\`\`
Sample execution timed out after ${MAX_EXECUTION_TIME} seconds.
\`\`\`

EOT
    elif [ ${exit_code} -ne 0 ]; then
        # Error
        cat >> "${REPORT_FILE}" << EOE
**Status**: ❌ Failed
**Execution time**: ${execution_time}s
**Exit code**: ${exit_code}

\`\`\`
$(cat /tmp/sample_output.txt)
\`\`\`

Error: Sample execution failed with exit code ${exit_code}.

EOE
    else
        # Success
        cat >> "${REPORT_FILE}" << EOS
**Status**: ✅ Success
**Execution time**: ${execution_time}s

\`\`\`
$(cat /tmp/sample_output.txt)
\`\`\`

EOS
    fi
}

# Function to execute a TypeScript sample
execute_ts_sample() {
    local sample_path="$1"
    local sample_name=$(basename "${sample_path}")
    local sample_type="TypeScript"
    
    echo "Executing TypeScript sample: ${sample_name}..."
    
    # Add sample header to report
    cat >> "${REPORT_FILE}" << EOS

### ${sample_name} (${sample_type})

**Sample path**: ${sample_path}

EOS
    
    # Execute the sample with timeout
    local start_time=$(date +%s)
    timeout ${MAX_EXECUTION_TIME}s npx ts-node "${sample_path}" > /tmp/sample_output.txt 2>&1
    local exit_code=$?
    local end_time=$(date +%s)
    local execution_time=$((end_time - start_time))
    
    # Check execution result
    if [ ${exit_code} -eq 124 ]; then
        # Timeout
        cat >> "${REPORT_FILE}" << EOT
**Status**: ⚠️ Timeout
**Execution time**: ${execution_time}s (timed out after ${MAX_EXECUTION_TIME}s)

\`\`\`
Sample execution timed out after ${MAX_EXECUTION_TIME} seconds.
\`\`\`

EOT
    elif [ ${exit_code} -ne 0 ]; then
        # Error
        cat >> "${REPORT_FILE}" << EOE
**Status**: ❌ Failed
**Execution time**: ${execution_time}s
**Exit code**: ${exit_code}

\`\`\`
$(cat /tmp/sample_output.txt)
\`\`\`

Error: Sample execution failed with exit code ${exit_code}.

EOE
    else
        # Success
        cat >> "${REPORT_FILE}" << EOS
**Status**: ✅ Success
**Execution time**: ${execution_time}s

\`\`\`
$(cat /tmp/sample_output.txt)
\`\`\`

EOS
    fi
}

# Main execution
echo "Starting GraphAI sample execution..."

# Execute YAML samples
echo "Executing YAML samples..."
for sample_file in $(find "${GRAPH_DATA_DIR}" -name "*.yaml" | sort); do
    execute_yaml_sample "${sample_file}"
done

# Execute TypeScript samples
echo "Executing TypeScript samples..."
for sample_file in $(find "${SAMPLES_DIR}/src" -name "*.ts" -not -path "*/node_modules/*" | sort); do
    # Skip test files and utility files
    if [[ "${sample_file}" != *"test.ts" && "${sample_file}" != *"utils.ts" && "${sample_file}" != *"types.ts" ]]; then
        execute_ts_sample "${sample_file}"
    fi
done

echo "Sample execution completed. Report saved to ${REPORT_FILE}"

# Generate final report
if [ -f "scripts/generate_report.sh" ]; then
    echo "Generating final report..."
    bash scripts/generate_report.sh
fi
