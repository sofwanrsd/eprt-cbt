#!/usr/bin/env python3
import json
import re
import os
import html
from curl_cffi import requests

COOKIE = os.environ.get("MOODLE_SESSION", "")
if not COOKIE:
    raise SystemExit("Set MOODLE_SESSION dulu (env), jangan hardcode cookie")
HEADERS = {"Cookie": f"MoodleSession={COOKIE}"}
AUDIO_DIR = "/projects/eprt-cbt/public/audio"

COURSE_URL = "https://onlinelearning.telkomuniversity.ac.id/course/view.php?id=108"

print("[*] Fetching Course 108 modules...")
r = requests.get(COURSE_URL, headers=HEADERS, impersonate="chrome120")
hvp_matches = re.findall(r"href=[\"']https://onlinelearning\.telkomuniversity\.ac\.id/mod/hvp/view\.php\?id=(\d+)[\"']", r.text)
hvp_ids = sorted(list(set(hvp_matches)))
print(f"[+] Found {len(hvp_ids)} unique HVP modules!")

extracted_questions = []
qid = 1

def clean_html(text):
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return " ".join(text.split()).strip()

for hid in hvp_ids:
    url = f"https://onlinelearning.telkomuniversity.ac.id/mod/hvp/view.php?id={hid}"
    try:
        res = requests.get(url, headers=HEADERS, impersonate="chrome120", timeout=12)
        match = re.search(r"H5PIntegration\s*=\s*(\{.*?\});", res.text, re.DOTALL)
        if not match:
            continue
        data = json.loads(match.group(1))
        contents = data.get("contents", {})

        for cid_key, cval in contents.items():
            mod_title = cval.get("title", f"Module {hid}")
            json_str = cval.get("jsonContent", "{}")
            inner = json.loads(json_str)

            # Determine section
            section = "structure"
            if "listening" in mod_title.lower():
                section = "listening"
            elif "reading" in mod_title.lower():
                section = "reading"

            def search_elements(obj):
                global qid
                if isinstance(obj, dict):
                    # MultiChoice
                    if "answers" in obj and ("question" in obj or "text" in obj):
                        prompt = clean_html(obj.get("question") or obj.get("text", ""))
                        answers = obj.get("answers", [])
                        if prompt and len(answers) >= 2:
                            opts = {}
                            correct_opt = "A"
                            letters = ["A", "B", "C", "D", "E"]
                            for i, ans in enumerate(answers[:4]):
                                let = letters[i]
                                ans_text = clean_html(ans.get("text", ""))
                                opts[let] = ans_text
                                if ans.get("correct") is True:
                                    correct_opt = let

                            # fill remaining options if less than 4
                            while len(opts) < 4:
                                next_let = letters[len(opts)]
                                opts[next_let] = "-"

                            extracted_questions.append({
                                "id": qid,
                                "section": section,
                                "part": "Part A" if section == "structure" else ("Part B" if section == "listening" else "Part A"),
                                "questionNumber": len(extracted_questions) + 1,
                                "prompt": prompt,
                                "options": opts,
                                "correctAnswer": correct_opt,
                                "explanation": f"Soal resmi dari CeLOE EPrT Prep Level 1: {mod_title}.",
                                "ruleCategory": f"CeLOE Official: {mod_title}"
                            })
                            qid += 1

                    for k, v in obj.items():
                        search_elements(v)
                elif isinstance(obj, list):
                    for item in obj:
                        search_elements(item)

            search_elements(inner)

    except Exception as e:
        print(f"[-] Error HVP {hid}: {e}")

print(f"[✓] Extracted {len(extracted_questions)} real questions from CeLOE HVP modules!")

# Save to dumped_questions.json
with open("/projects/eprt-cbt/src/data/celoeExtractedQuestions.json", "w") as f:
    json.dump(extracted_questions, f, indent=2)

print("[✓] Saved to /projects/eprt-cbt/src/data/celoeExtractedQuestions.json")
