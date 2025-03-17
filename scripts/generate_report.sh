#!/bin/bash

# GraphAI Sample Report Generator
# This script formats the sample execution results into a comprehensive Markdown report

# Set up variables
REPORT_FILE="sample_execution_report.md"
FINAL_REPORT="graphai_samples_report.md"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Check if the execution report exists
if [ ! -f "${REPORT_FILE}" ]; then
    echo "Error: Execution report file not found: ${REPORT_FILE}"
    echo "Please run the sample execution script first."
    exit 1
fi

# Create final report header
cat > "${FINAL_REPORT}" << EOH
# GraphAI Samples Execution Report
Generated: ${TIMESTAMP}

## Overview

This report contains the execution results of GraphAI samples. It provides a summary of which samples executed successfully and which ones failed.

## Summary

EOH

# Count successful and failed samples
SUCCESS_COUNT=$(grep -c "**Status**: ✅ Success" "${REPORT_FILE}")
FAILED_COUNT=$(grep -c "**Status**: ❌ Failed" "${REPORT_FILE}")
TIMEOUT_COUNT=$(grep -c "**Status**: ⚠️ Timeout" "${REPORT_FILE}")
TOTAL_COUNT=$((SUCCESS_COUNT + FAILED_COUNT + TIMEOUT_COUNT))

# Add summary to report
cat >> "${FINAL_REPORT}" << EOS
- **Total Samples**: ${TOTAL_COUNT}
- **Successful**: ${SUCCESS_COUNT}
- **Failed**: ${FAILED_COUNT}
- **Timeout**: ${TIMEOUT_COUNT}

EOS

# Add success rate
if [ ${TOTAL_COUNT} -gt 0 ]; then
    SUCCESS_RATE=$(echo "scale=2; ${SUCCESS_COUNT} * 100 / ${TOTAL_COUNT}" | bc)
    echo "- **Success Rate**: ${SUCCESS_RATE}%" >> "${FINAL_REPORT}"
fi

# Add table of contents
cat >> "${FINAL_REPORT}" << EOT

## Table of Contents

1. [Summary](#summary)
2. [Successful Samples](#successful-samples)
3. [Failed Samples](#failed-samples)
4. [Timeout Samples](#timeout-samples)
5. [Detailed Results](#detailed-results)

EOT

# Add successful samples section
cat >> "${FINAL_REPORT}" << EOS

## Successful Samples

| Sample Name | Type |
|-------------|------|
EOS

# Extract successful samples
grep -B 1 "**Status**: ✅ Success" "${REPORT_FILE}" | grep "###" | while read -r line; do
    sample_info=$(echo "${line}" | sed 's/### \(.*\) (\(.*\))/| \1 | \2 |/')
    echo "${sample_info}" >> "${FINAL_REPORT}"
done

# Add failed samples section
cat >> "${FINAL_REPORT}" << EOS

## Failed Samples

| Sample Name | Type | Error |
|-------------|------|-------|
EOS

# Extract failed samples and their errors
grep -A 20 "**Status**: ❌ Failed" "${REPORT_FILE}" | while read -r line; do
    if [[ "${line}" == "### "* ]]; then
        sample_name=$(echo "${line}" | sed 's/### \(.*\) (\(.*\))/\1/')
        sample_type=$(echo "${line}" | sed 's/### \(.*\) (\(.*\))/\2/')
        
        # Get the error message (first line after the execution output)
        error_line=$(grep -A 20 "${line}" "${REPORT_FILE}" | grep -m 1 "Error:")
        if [ -z "${error_line}" ]; then
            error_line="Unknown error"
        fi
        
        echo "| ${sample_name} | ${sample_type} | ${error_line} |" >> "${FINAL_REPORT}"
    fi
done

# Add timeout samples section
cat >> "${FINAL_REPORT}" << EOS

## Timeout Samples

| Sample Name | Type |
|-------------|------|
EOS

# Extract timeout samples
grep -B 1 "**Status**: ⚠️ Timeout" "${REPORT_FILE}" | grep "###" | while read -r line; do
    sample_info=$(echo "${line}" | sed 's/### \(.*\) (\(.*\))/| \1 | \2 |/')
    echo "${sample_info}" >> "${FINAL_REPORT}"
done

# Add detailed results section
cat >> "${FINAL_REPORT}" << EOS

## Detailed Results

This section contains detailed execution results for each sample.

EOS

# Append the detailed results from the execution report
cat "${REPORT_FILE}" | sed '1,/## Sample Execution Results/d' >> "${FINAL_REPORT}"

echo "Report generation completed. Final report: ${FINAL_REPORT}"
