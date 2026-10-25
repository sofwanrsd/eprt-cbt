#!/usr/bin/env python3
import json
import re
import os
import concurrent.futures
from curl_cffi import requests

COOKIE = os.environ.get("MOODLE_SESSION", "")
if not COOKIE:
    raise SystemExit("Set MOODLE_SESSION dulu (env), jangan hardcode cookie")
HEADERS = {"Cookie": f"MoodleSession={COOKIE}"}
AUDIO_DIR = "/projects/eprt-cbt/public/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

COURSE_URL = "https://onlinelearning.telkomuniversity.ac.id/course/view.php?id=108"

# 1. Fetch course page to get all HVP IDs
print("[*] Fetching Course 108 modules...")
r = requests.get(COURSE_URL, headers=HEADERS, impersonate="chrome120")
hvp_matches = re.findall(r"href=[\"']https://onlinelearning\.telkomuniversity\.ac\.id/mod/hvp/view\.php\?id=(\d+)[\"']", r.text)
hvp_ids = sorted(list(set(hvp_matches)))
print(f"[+] Found {len(hvp_ids)} unique HVP modules!")

extracted_data = {
    "audios": [],
    "questions": [],
    "cards": []
}

def process_hvp(hid):
    url = f"https://onlinelearning.telkomuniversity.ac.id/mod/hvp/view.php?id={hid}"
    try:
        res = requests.get(url, headers=HEADERS, impersonate="chrome120", timeout=12)
        match = re.search(r"H5PIntegration\s*=\s*(\{.*?\});", res.text, re.DOTALL)
        if not match:
            return
        data = json.loads(match.group(1))
        contents = data.get("contents", {})

        for cid_key, cval in contents.items():
            content_url = cval.get("contentUrl", "")
            title = cval.get("title", f"HVP {hid}")
            json_str = cval.get("jsonContent", "{}")
            inner = json.loads(json_str)

            # Look for chapters or subcontents
            all_text = json_str

            # Find all audio paths
            audios = re.findall(r'"path":\s*"([^"]+\.(?:mp3|wav|ogg|m4a))"', json_str)
            for a_rel in audios:
                full_audio_url = f"{content_url}/{a_rel}"
                audio_name = os.path.basename(a_rel)
                local_path = os.path.join(AUDIO_DIR, audio_name)
                extracted_data["audios"].append({
                    "hvpId": hid,
                    "title": title,
                    "url": full_audio_url,
                    "filename": audio_name
                })
                # Download if not exists
                if not os.path.exists(local_path):
                    try:
                        a_res = requests.get(full_audio_url, headers=HEADERS, impersonate="chrome120", timeout=15)
                        if a_res.status_code == 200 and len(a_res.content) > 1000:
                            with open(local_path, "wb") as f:
                                f.write(a_res.content)
                            print(f"[✓] Downloaded audio: {audio_name} ({len(a_res.content)} bytes)")
                    except Exception as e:
                        print(f"[-] Failed audio {audio_name}: {e}")

            # Find Dialog cards (flashcards/questions)
            cards = re.findall(r'"text":\s*"([^"]+)",\s*"answer":\s*"([^"]+)"', json_str)
            for q_t, a_t in cards:
                extracted_data["cards"].append({
                    "hvpId": hid,
                    "module": title,
                    "prompt": q_t,
                    "answer": a_t
                })

    except Exception as e:
        print(f"[-] Error HVP {hid}: {e}")

print(f"[*] Processing {len(hvp_ids)} HVP modules in parallel...")
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
    executor.map(process_hvp, hvp_ids)

print(f"[✓] Extraction finished!")
print(f"    Total Audio files found: {len(extracted_data['audios'])}")
print(f"    Total Flashcards/Cards: {len(extracted_data['cards'])}")

with open("/projects/eprt-cbt/src/data/celoeDumpedQuestions.json", "w") as f:
    json.dump(extracted_data, f, indent=2)

print("[✓] Saved /projects/eprt-cbt/src/data/celoeDumpedQuestions.json")
