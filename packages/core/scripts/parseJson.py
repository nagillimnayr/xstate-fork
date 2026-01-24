from collections import defaultdict
from datetime import datetime
from io import TextIOWrapper
import json
import sys
from pathlib import Path
import os
from typing import TypedDict
import re

def to_snake_case(name):
    # Inserts an underscore between a lowercase letter/digit and an uppercase letter
    s1 = re.sub('([a-z0-9])([A-Z])', r'\1_\2', name)
    # Replaces spaces or hyphens with an underscore and converts to lowercase
    s1 = re.sub(r'[\s-]', '_', s1)
    # Converts the whole string to lowercase
    return s1.lower()

class MutantStats(TypedDict):
    total: int
    killed: int
    survived: int
    timeout: int
    no_coverage: int
    runtime_error: int
    compile_error: int
    ignored: int

def get_diff(
    source: list[str],
    replacement: str,
    start_line: int,
    end_line: int, 
    start_col: int,
    end_col: int
) -> str:
    diff: str = "```diff\n"
    source_lines = source[start_line:end_line + 1]
    for line in source_lines:
        diff += "-" + line
    diff += "+" + source_lines[0][:start_col] + replacement + source_lines[-1][end_col:]
    return diff + "```"

def process_mutants(source_code: list[str], mutants: list[dict], diff_file: TextIOWrapper):
    stats: dict[str, MutantStats] = dict()
    for mutant in mutants:
        if mutant["status"] == "Ignored":
            continue
        id = mutant["id"]
        mutation_operator: str = mutant["mutatorName"]
        status: str = mutant["status"]
        replacement: str = mutant["replacement"]
        start_line = mutant["location"]["start"]["line"]
        start_col = mutant["location"]["start"]["column"]
        end_line = mutant["location"]["end"]["line"]
        end_col = mutant["location"]["end"]["column"]

        if mutation_operator not in stats:
            stats[mutation_operator] = defaultdict(int)
        
        stats[mutation_operator]["total"] += 1
        stats[mutation_operator][to_snake_case(status)] += 1
        
        diff = get_diff(source_code, replacement, start_line - 1, end_line - 1, start_col - 1, end_col - 1)

        stats[mutation_operator][status] += 1

        print(f"### Mutant({id}): {mutation_operator}, Status: {status}\n", file=diff_file)
        print(
            f"**Replacement:** `{replacement.replace("``", "`` `` ``")}`, " + # Escape backticks in replacement
            f"**Start:** {start_line}:{start_col}, " +
            f"**End:** {end_line}:{end_col}\n",
            file=diff_file
        ) 
        print(diff, file=diff_file)
        print(file=diff_file)

    return stats

def main():
    input_json_path = sys.argv[1]
    input_file_name = Path(input_json_path).stem
    if len(sys.argv) < 1:
        raise Exception("No input file provided!")

    with open(input_json_path, 'r') as f:
        data = json.load(f) # converts json to python dictionary

    source_files = list(data["files"])
    output_dir = f"./reports/mutation/{input_file_name}"
    os.makedirs(output_dir, exist_ok=True)
    for source_file in source_files:
        source_file_name = Path(source_file).stem

        diff_path = f"{output_dir}/{source_file_name}.diff.md"
        stats_path = f"{output_dir}/{source_file_name}.stats.md"
        
        mutants = data["files"][source_file]["mutants"]
        with open(source_file, 'r') as file:
            source_code = file.read().splitlines(keepends=True)

        with open(diff_path, 'w') as diff_file, open(stats_path, 'w') as stats_file:
            print(f"# Mutation Testing Diff Report for Source File: `{source_file}`\n\n", file=diff_file)
            print(f"# Mutation Testing Stats Report for Source File: `{source_file}`\n\n", file=stats_file)
            mutant_stats = process_mutants(source_code, mutants, diff_file)
            print("| Mutation Operator | Total | Killed | Survived | Timeout | No Coverage | Runtime Error | Compile Error |", file=stats_file)
            print("| ------ | ------ | ----- | ------ | ------ | ------ | ------ | ------ |", file=stats_file)
            for mutation_operator, stats in mutant_stats.items():
                print(f"| {mutation_operator} | {stats['total']} | {stats['killed']} | {stats['survived']} | {stats['timeout']} | {stats['no_coverage']} | {stats['runtime_error']} | {stats['compile_error']} |", file=stats_file)
      

if __name__ == "__main__":
    main()
