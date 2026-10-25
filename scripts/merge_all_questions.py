import json

# Load the 140 official simulation questions
with open("/projects/eprt-cbt/src/data/questionBank.ts") as f:
    text = f.read()

prefix = "export const INITIAL_QUESTIONS: Question[] = "
start_idx = text.find(prefix) + len(prefix)
end_idx = text.rfind(";")
sim_questions = json.loads(text[start_idx:end_idx].strip())

# Load the 1,327 CeLOE extracted questions
with open("/projects/eprt-cbt/src/data/celoeExtractedQuestions.json") as f:
    celoe_questions = json.load(f)

# Re-index celoe questions starting at 141
for i, q in enumerate(celoe_questions):
    q["id"] = 141 + i
    q["questionNumber"] = i + 1

# Combine them:
all_questions = sim_questions + celoe_questions

print(f"Total Combined Questions: {len(all_questions)}")

ts_content = f"""import {{ Question }} from '../types';

export const OFFICIAL_SIMULATION_QUESTIONS: Question[] = {json.dumps(sim_questions, indent=2)};

export const CELOE_QUESTIONS: Question[] = {json.dumps(celoe_questions, indent=2)};

export const INITIAL_QUESTIONS: Question[] = OFFICIAL_SIMULATION_QUESTIONS;
"""

with open("/projects/eprt-cbt/src/data/questionBank.ts", "w") as f:
    f.write(ts_content)

print("[✓] Successfully wrote merged questionBank.ts!")
