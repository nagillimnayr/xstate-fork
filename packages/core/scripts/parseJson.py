from collections import defaultdict
from datetime import datetime
import json
import sys

def originalCode(path, startLine, endLine):
    with open(path, 'r') as f:
        lines = f.readlines() # takes each line in file and store into array

    code = ""
    if startLine == endLine:
        code = "-    " + lines[startLine]
    else:
        for i in range(startLine, endLine + 1):
            code += "-    " + lines[i]

    return code

def replacedCode(path, replacement, startLine, endLine, startCol, endCol):
    with open(path, 'r') as f:
        lines = f.readlines()

        code = ""
        if startLine == endLine:
            code = "+    " + lines[startLine][:startCol] + replacement + lines[startLine][endCol:]
        else:
            code += "+    " + lines[startLine][:startCol] + replacement + lines[endLine][endCol:]
        return code 

def mutationReport(file, data):
    mutants = data["files"][file]["mutants"]

    # dict values are also dicts for status : count
    mutantStats = defaultdict(lambda: defaultdict(int))

    print("## Mutants")
    for mutant in mutants:
        name = mutant["mutatorName"]
        status = mutant["status"]
        replacement = mutant["replacement"]
        startLine = mutant["location"]["start"]["line"]
        startCol = mutant["location"]["start"]["column"]
        endLine = mutant["location"]["end"]["line"]
        endCol = mutant["location"]["end"]["column"]

        mutantStats[name][status] = mutantStats[name].get(status, 0) + 1 # counting mutant types

        original = originalCode(file, startLine - 1, endLine - 1)
        replaced = replacedCode(file, replacement, startLine - 1, endLine - 1, startCol - 1, endCol - 1)
        printMutantDiff(name, status, replacement, original, replaced, startLine, endLine, startCol, endCol)

    printMutationCount(file, mutants, mutantStats)
        
def printMutantDiff(name, status, replacement, original, replaced, startLine, endLine, startCol, endCol):
    print(f"**Type**: {name}, **Status**: {status}")
    print()
    print(f"**Replacement**: {replacement}")
    print()
    print(f"**Lines** {startLine}-{endLine}, **Columns** {startCol}-{endCol}")
    print("```diff")
    print(original, end="")
    print(replaced, end="")
    print("```")
    print()

def printMutationCount(file, mutants, mutantStats):
    print(f"## Results of Mutation Testing on Source File: {file}")
    print()
    print(f"### Total Mutants: {len(mutants)}")
    print()
    for name, stats in mutantStats.items():
        print(f"#### Mutant: {name}")
        for status, count in stats.items():
            print(f"&ensp;**Status**: {status}, **Count**: {count}")
            print()
    print()

def main():
    jsonPath = sys.argv[1]
    with open(jsonPath, 'r') as f:
        data = json.load(f) # converts json to python dictionary

    o = sys.stdout
    date = datetime.today().strftime('%Y-%m-%d')
    path = f"./reports/mutation/mutation-{date}.md"
    with open(path, 'w') as f:
        sys.stdout = f
        files = list(data["files"])
        for file in files:
            print("___")
            print(f"# Mutation Testing on Source File: {file}")
            print("___")
            mutationReport(file, data)
    sys.stdout = o

if __name__ == "__main__":
    main()


