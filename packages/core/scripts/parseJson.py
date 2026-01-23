import json
import sys
from collections import defaultdict

def originalCode(path, startLine, endLine):
    with open("../" + path, 'r') as file:
        lines = file.readlines() # takes each line in file and store into array

    code = ""
    if startLine == endLine:
        code = "-    " + lines[startLine]
    else:
        for i in range(startLine, endLine + 1):
            code += "-    " + lines[i]

    return code

def replacedCode(path, replacement, startLine, endLine, startCol, endCol):
    with open("../" + path, 'r') as file:
        lines = file.readlines()

        code = ""
        if startLine == endLine:
            code = "+    " + lines[startLine][:startCol] + replacement + lines[startLine][endCol:]
        else:
            code += "+    " + lines[startLine][:startCol]
            code += replacement
            code += lines[endLine][endCol:]
        return code 


jsonPath = sys.argv[1]

with open(jsonPath, 'r') as file:
    data = json.load(file) # converts json to python dictionary
file = list(data["files"])[0]


mutants = data["files"][file]["mutants"]

# dict values are also dicts for status : count
mutantStats = defaultdict(lambda: defaultdict(int))

for mutant in mutants:
    name = mutant["mutatorName"]
    status = mutant["status"]
    replacement = mutant["replacement"]
    startLine = mutant["location"]["start"]["line"]
    startCol = mutant["location"]["start"]["column"]
    endLine = mutant["location"]["end"]["line"]
    endCol = mutant["location"]["end"]["column"]

    original = originalCode(file, startLine - 1, endLine - 1)
    replaced = replacedCode(file, replacement, startLine - 1, endLine - 1, startCol - 1, endCol - 1)

    print(f"Type: {name}, Status: {status}")
    print(f"Replacement: {replacement}")
    print("Location:")
    print(f"    Lines {startLine}-{endLine}, Columns {startCol}-{endCol}")
    print(original)
    print(replaced)
    print()

    mutantStats[name][status] = mutantStats[name].get(status, 0) + 1 # counting mutant types
    
print("-" * 80)
print(f"Results of Mutation Testing on Source File: {file}")
print("-" * 80)
print(f"Total Mutants: {len(mutants)}")
print("-" * 80)
for name, stats in mutantStats.items():
    print(f"Mutant: {name}")
    for status, count in stats.items():
        print(f"    Status: {status}, Count: {count}")
print("-" * 80)

