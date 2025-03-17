# GraphAI Sample Execution Scripts

This directory contains scripts for executing GraphAI samples and generating reports on the results.

## Scripts Overview

1. `run_samples.sh` - Executes GraphAI samples and records execution results
2. `generate_report.sh` - Generates Markdown reports from execution results
3. `ci_workflow.sh` - CI workflow script for automated testing and reporting
4. `fix_sample.sh` - Generates fix proposals for failed samples

## Usage

### Sample Execution

To run all samples and generate a report:

```bash
./scripts/run_samples.sh
```

This script will:

1. Execute GraphAI YAML samples
2. Execute GraphAI TypeScript samples
3. Record execution results in `sample_execution_report.md`
4. Generate a final report in `graphai_samples_report.md`

### Environment Variables

The scripts require API keys for various services:

```
RESPONSE_API_KEY=your_response_api_key
MISTRAL_API_KEY=your_mistral_api_key
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_API_KEY=your_google_api_key
```

If API keys are not provided, dummy keys will be used and API requests will fail.

## Report Format

The generated reports include:

1. Total number of executed samples
2. Number and list of successful samples
3. Number and list of failed samples with error messages
4. Number and list of timed-out samples
5. Detailed execution results for each sample
