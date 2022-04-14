from string import punctuation
import random

# Dataset of 7.8 million sentences from Wikipedia by Mike Ortman https://www.kaggle.com/datasets/mikeortman/wikipedia-sentences

file = open("dtlyrics.txt", "r")
lines = file.readlines()

solutions = []

for line in lines:
    line = line.rstrip("\n").rstrip(".")

    if any(letter.isdigit() for letter in line):
        continue
    elif any(p in line for p in punctuation):
        continue
    elif len(line.split()) > 5:
        continue

    solutions.append(line)

random.shuffle(solutions)

truncated_randomised_solutions = solutions

sentencesjs = open("sentencesdt.js", "a")
sentencesjs.write("var sentences = [")

for sentence in truncated_randomised_solutions:
    if sentence == truncated_randomised_solutions[-1]:
        sentencesjs.write('"' + sentence + '"]')
    else:
        sentencesjs.write('"' + sentence + '", ')

