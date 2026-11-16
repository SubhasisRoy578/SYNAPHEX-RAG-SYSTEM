# SYNAPHEX — Evaluation Framework

## Purpose
This directory houses the RAG (Retrieval-Augmented Generation) evaluation framework, benchmark datasets, ground-truth QA pairs, and automated scoring scripts for SYNAPHEX.

## Structure (Planned for Phase 8)
- `datasets/`: Curated test documents and versioned evaluation question sets (`questions.json`).
- `metrics/`: Custom metric evaluators for:
  - **Retrieval Recall@K**: Measuring whether relevant chunks appear in the top-K retrieved context.
  - **Faithfulness**: Measuring whether the generated answer is strictly grounded in retrieved evidence.
  - **Citation Correctness**: Validating that cited source pages/sections directly support each statement.
  - **Abstention Quality**: Measuring the system's ability to decline answering when evidence is insufficient or contradictory.
- `results/`: Historical evaluation reports and benchmarking runs.

## Rules & Philosophy
1. **No Fabricated Benchmarks**: Never publish or commit simulated evaluation scores or fake accuracy percentages.
2. **Reproducible Evaluation**: All evaluation runs must specify the exact model identifiers, embedding models, chunking parameters, and dataset hashes.
3. **Continuous Verification**: Regression tests will run against this benchmark suite prior to production releases.
