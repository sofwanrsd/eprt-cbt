import os
audio_files = sorted([f for f in os.listdir("/projects/eprt-cbt/public/audio") if f.endswith(".mp3") and os.path.getsize(f"/projects/eprt-cbt/public/audio/{f}") > 10000])
import json

# Full 140 Question Bank Generator for EPrT Telkom University (TOEFL ITP Standard)

questions = []
qid = 1

# ============================================================
# SECTION 1: LISTENING COMPREHENSION (50 ITEMS)
# ============================================================

# Part A: Short Dialogues (1 to 30)
part_a_data = [
    (
        ["Man: Did you manage to submit the research paper before five?", "Woman: Barely. The professor's assistant was just locking the office door."],
        "What does the woman mean?",
        {"A": "She missed the deadline completely.", "B": "She turned in the paper just in time.", "C": "The professor had already left the office.", "D": "She asked the assistant for an extension."},
        "B",
        "'Barely' menunjukkan bahwa dia hampir saja terlambat, namun berhasil mengumpulkan tepat sebelum pintu dikunci ('just in time').",
        "Idiom: Adverb of Degree ('Barely')"
    ),
    (
        ["Woman: I'm thinking of dropping that advanced economics course. It's way over my head.", "Man: Don't give up yet! Why not form a study group with Sarah and David?"],
        "What does the man suggest the woman do?",
        {"A": "Drop the economics class immediately.", "B": "Study together with other classmates.", "C": "Ask the instructor for private tutoring.", "D": "Take the introductory economics course instead."},
        "B",
        "Pria tersebut menyarankan: 'Why not form a study group with Sarah and David?' yang bermakna belajar bersama teman sekelas.",
        "Suggestion Formula: 'Why not...?'"
    ),
    (
        ["Man: Mark didn't seem enthusiastic about joining the robotics club.", "Woman: Could you blame him? He's taking twenty credit hours this semester."],
        "What implies about Mark?",
        {"A": "He is too busy with his heavy course load.", "B": "He doesn't like engineering projects.", "C": "He already joined another student organization.", "D": "He forgot to register for the club."},
        "A",
        "Pertanyaan retoris 'Could you blame him? He's taking twenty credit hours' menyiratkan bahwa wajar jika dia sibuk karena beban SKS-nya padat (20 SKS).",
        "Rhetorical Question & Implied Meaning"
    ),
    (
        ["Woman: Have you heard if the campus library will be open during the holiday break?", "Man: Only on weekdays, and even then, just for half the usual hours."],
        "What does the man say about the library?",
        {"A": "It will operate on a severely reduced schedule.", "B": "It will be open every day as usual.", "C": "It is closed permanently for renovations.", "D": "It will open only on weekends."},
        "A",
        "Buka hanya pada weekdays dan 'half the usual hours' bermakna jadwalnya sangat dikurangi ('reduced schedule').",
        "Limiting Conditions & Quantifiers"
    ),
    (
        ["Man: I was hoping to get a single room in the dormitories this fall.", "Woman: So was everyone else! You should consider looking for an off-campus apartment."],
        "What does the woman imply?",
        {"A": "Single dorm rooms are in extremely high demand.", "B": "The man applied for housing too late.", "C": "Apartments off campus are very expensive.", "D": "Everyone prefers sharing dorm rooms."},
        "A",
        "Ungkapan 'So was everyone else!' berarti semua orang menginginkan hal yang sama, sehingga permintaannya sangat tinggi.",
        "Emphasis / Agreement ('So was...')"
    ),
    (
        ["Woman: Is Professor Harrison always this strict about assignment formats?", "Man: You bet! If margins are off by a millimeter, he won't even grade it."],
        "What does the man mean about Professor Harrison?",
        {"A": "He is lenient with paper deadlines.", "B": "He pays meticulous attention to guidelines.", "C": "He does not care about margins.", "D": "He prefers digital submissions."},
        "B",
        "'You bet!' adalah konfirmasi tegas bahwa sang profesor memang sangat teliti dan detail terhadap format ('meticulous').",
        "Colloquial Agreement ('You bet!')"
    ),
    (
        ["Man: Can you lend me a hand with this statistical regression script?", "Woman: As soon as I finish compiling these chemistry lab results, I'd be glad to."],
        "What will the woman probably do?",
        {"A": "Refuse to help the man with statistics.", "B": "Help the man after completing her own laboratory work.", "C": "Ask someone else to assist the man.", "D": "Leave the laboratory immediately."},
        "B",
        "Frasa 'As soon as I finish... I'd be glad to' menyatakan kesediaan membantu setelah tugas labnya beres.",
        "Condition & Willingness ('As soon as...')"
    ),
    (
        ["Woman: The concert tickets sold out in under three minutes!", "Man: I told you we should have queued up online half an hour early."],
        "What does the man imply?",
        {"A": "They should have anticipated the high demand earlier.", "B": "They can easily purchase tickets at the gate.", "C": "The concert was cancelled by the organizers.", "D": "He did not want to attend the concert."},
        "A",
        "'I told you we should have...' mengindikasikan penyesalan karena tidak bersiap-siap lebih awal.",
        "Modal of Past Regret ('Should have + V3')"
    ),
    (
        ["Man: Are you going to the campus career fair on Thursday?", "Woman: Wouldn't miss it for the world! Several top tech recruiters will be there."],
        "What does the woman mean?",
        {"A": "She does not plan to attend the fair.", "B": "She is determined to attend the career fair.", "C": "She thinks tech recruiters are unhelpful.", "D": "She has an interview on Thursday."},
        "B",
        "Idiom 'Wouldn't miss it for the world' bermakna pasti dan bertekad kuat untuk hadir.",
        "Idiom: 'Wouldn't miss it for the world'"
    ),
    (
        ["Woman: Do you think our proposal will receive funding from the faculty grant?", "Man: Well, it's a toss-up between our project and the solar vehicle team."],
        "What does the man mean?",
        {"A": "Their project has no chance of getting funded.", "B": "Both projects have an equal probability of winning.", "C": "The solar vehicle team withdrew their proposal.", "D": "The faculty decided to fund all proposals."},
        "B",
        "Idiom 'it's a toss-up' bermakna peluangnya seimbang (50:50) atau sama besar antar kedua pihak.",
        "Idiom: 'A toss-up' (Peluang 50-50)"
    ),
    (
        ["Man: The air conditioner in the auditorium is making a terrible screeching noise.", "Woman: Has anyone called facility maintenance yet?"],
        "What does the woman imply?",
        {"A": "Someone should report the issue to maintenance.", "B": "The auditorium should be locked.", "C": "The noise is not very bothersome.", "D": "Maintenance already inspected the room."},
        "A",
        "Pertanyaan 'Has anyone called facility maintenance yet?' mengindikasikan tindakan pelaporan harus segera diambil.",
        "Implied Suggestion"
    ),
    (
        ["Woman: I can't believe how steep the textbook prices are this term.", "Man: Tell me about it! My organic chemistry manual alone cost a fortune."],
        "What does the man mean?",
        {"A": "He agrees that textbooks are excessively expensive.", "B": "He borrowed his manual from the library.", "C": "He thinks chemistry books are affordable.", "D": "He doesn't need to purchase textbooks."},
        "A",
        "Ungkapan 'Tell me about it!' merupakan idiom persetujuan kuat ('He agrees completely').",
        "Idiom: 'Tell me about it!'"
    ),
    (
        ["Man: We need to leave for the airport in ten minutes if we want to catch the flight.", "Woman: Hold on, I can't find my boarding pass anywhere!"],
        "What is the woman's problem?",
        {"A": "She forgot the airport terminal.", "B": "She has misplaced her travel document.", "C": "She decided not to travel.", "D": "The flight was rescheduled."},
        "B",
        "'I can't find my boarding pass anywhere' berarti dokumen perjalanannya terselip ('misplaced travel document').",
        "Direct Problem Identification"
    ),
    (
        ["Woman: How was your presentation on renewable microgrids?", "Man: It went off without a hitch! The panel even praised our load-balancing algorithm."],
        "What does the man say about his presentation?",
        {"A": "It faced severe technical difficulties.", "B": "It proceeded smoothly without any problems.", "C": "The panel rejected their algorithm.", "D": "He arrived late for the presentation."},
        "B",
        "Idiom 'without a hitch' berarti berlangsung sangat mulus tanpa kendala apa pun.",
        "Idiom: 'Without a hitch'"
    ),
    (
        ["Man: Did you manage to contact Professor Adams about the makeup test?", "Woman: His line was busy every time I dialed, but I finally sent him an email."],
        "What did the woman do?",
        {"A": "She gave up trying to reach the professor.", "B": "She emailed him after failing to reach him by phone.", "C": "She visited his office in person.", "D": "She postponed the makeup exam."},
        "B",
        "Wanita tersebut menjelaskan bahwa teleponnya selalu sibuk sehingga ia akhirnya mengirimkan email.",
        "Sequence of Actions"
    ),
    (
        ["Woman: I'm completely exhausted after that three-hour algorithms exam.", "Man: Join the club! Everyone in my row looked half-asleep by the end."],
        "What does the man mean?",
        {"A": "He also felt very drained by the difficult test.", "B": "He invites the woman to join an academic club.", "C": "He finished the exam in under an hour.", "D": "He found the algorithms exam surprisingly easy."},
        "A",
        "Idiom 'Join the club!' berarti dia merasakan hal yang sama (sama-sama lelah dan terkuras energinya).",
        "Idiom: 'Join the club!'"
    ),
    (
        ["Man: Should we order takeout or cook dinner at the dormitory kitchen?", "Woman: Let's flip a coin; either option sounds good to me."],
        "What does the woman mean?",
        {"A": "She has no strong preference between the two options.", "B": "She prefers to cook dinner tonight.", "C": "She does not have enough money for takeout.", "D": "She is not hungry right now."},
        "A",
        "'Let's flip a coin; either option sounds good' menunjukkan dia tidak memiliki preferensi khusus (netral).",
        "Equal Preference / Indifference"
    ),
    (
        ["Woman: Brian said he would repair my bicycle brakes this afternoon.", "Man: Take whatever he says with a grain of salt. He always makes promises he can't keep."],
        "What does the man think of Brian?",
        {"A": "Brian is an expert bicycle mechanic.", "B": "Brian's statements should not be taken literally or fully trusted.", "C": "Brian is extremely punctual.", "D": "Brian will finish the repair ahead of schedule."},
        "B",
        "Idiom 'take it with a grain of salt' berarti bersikap skeptis / jangan langsung percaya begitu saja.",
        "Idiom: 'Take with a grain of salt'"
    ),
    (
        ["Man: The deadline for the scholarship application is tomorrow at noon.", "Woman: Don't remind me! I still have to write the personal statement from scratch."],
        "What implies about the woman?",
        {"A": "She has already submitted her application.", "B": "She still has significant work left to complete.", "C": "She decided not to apply for the grant.", "D": "Her personal statement was approved."},
        "B",
        "'I still have to write... from scratch' berarti dia belum mulai menulis esainya sama sekali.",
        "Heavy Workload Remaining"
    ),
    (
        ["Woman: Did the city council approve the expansion of the light rail line?", "Man: They put it on the back burner until the next fiscal quarter."],
        "What happened to the rail project?",
        {"A": "It was approved with immediate funding.", "B": "It was postponed for future consideration.", "C": "It was permanently cancelled.", "D": "Construction began ahead of schedule."},
        "B",
        "Idiom 'put on the back burner' berarti menunda suatu proyek ke prioritas berikutnya ('postponed').",
        "Idiom: 'On the back burner'"
    ),
    (
        ["Man: I was surprised to see Lisa at the coding marathon last night.", "Woman: What did you expect? When there is a grand prize on the line, she never sits on the sidelines."],
        "What does the woman mean about Lisa?",
        {"A": "Lisa loves competing when there are rewards.", "B": "Lisa was forced to participate.", "C": "Lisa watched from the audience.", "D": "Lisa dislikes programming competitions."},
        "A",
        "'She never sits on the sidelines' berarti Lisa adalah orang yang aktif dan antusias berkompetisi saat ada hadiah.",
        "Idiom: 'Sit on the sidelines'"
    ),
    (
        ["Woman: Would you mind if I borrowed your calculus notes over the weekend?", "Man: Not in the least! Just make sure I get them back by Monday morning."],
        "What does the man mean?",
        {"A": "He is happy to lend his notes with a condition.", "B": "He refuses to share his calculus notes.", "C": "He lost his notes last weekend.", "D": "He needs to study over the weekend."},
        "A",
        "'Not in the least!' bermakna sama sekali tidak keberatan (boleh dipinjam asal dikembalikan Senin).",
        "Polite Permission ('Not in the least')"
    ),
    (
        ["Man: Did you hear that Professor Lin published another paper in Nature?", "Woman: It's second nature to her at this point; she has over forty peer-reviewed publications."],
        "What does the woman mean about Professor Lin?",
        {"A": "Publishing prestigious research is routine and natural for her.", "B": "She struggles with scientific writing.", "C": "She recently started her academic career.", "D": "She plans to retire from research."},
        "A",
        "Idiom 'second nature' berarti sesuatu yang sudah sangat biasa, mahir, dan menjadi kebiasaan rutin baginya.",
        "Idiom: 'Second nature'"
    ),
    (
        ["Woman: I feel like we've been going in circles trying to fix this database deadlock.", "Man: Why don't we step away for a cup of coffee and look at the schema with fresh eyes?"],
        "What does the man suggest?",
        {"A": "Take a short break before debugging again.", "B": "Rewrite the database from scratch.", "C": "Abandon the project permanently.", "D": "Hire an external database administrator."},
        "A",
        "Pria menyarankan beristirahat sejenak ('step away for coffee') agar bisa melihat masalah dengan pikiran segar ('fresh eyes').",
        "Problem Solving Suggestion"
    ),
    (
        ["Man: The campus bookstore is giving away free planners today.", "Woman: Really? I'd better head over there before they run out."],
        "What does the woman plan to do?",
        {"A": "Visit the bookstore promptly to get a planner.", "B": "Purchase planners online.", "C": "Complain about bookstore lines.", "D": "Study in the library instead."},
        "A",
        "'I'd better head over there before they run out' menunjukkan niat untuk segera pergi ke toko buku sebelum stok habis.",
        "Prompt Action Intent"
    ),
    (
        ["Woman: Could we postpone our group meeting until six o'clock?", "Man: That suits me to a T; I have a dental appointment at four anyway."],
        "What does the man mean?",
        {"A": "Six o'clock fits his schedule perfectly.", "B": "He cannot attend any meeting today.", "C": "He will cancel his dental visit.", "D": "He prefers meeting at four o'clock."},
        "A",
        "Idiom 'suits me to a T' berarti sangat cocok atau pas dengan jadwal/kebutuhan seseorang.",
        "Idiom: 'Suits to a T'"
    ),
    (
        ["Man: Have you decided which faculty advisor to choose for your capstone project?", "Woman: I'm still on the fence; both Dr. Evans and Dr. Zhao have fascinating lab openings."],
        "What does the woman mean?",
        {"A": "She has not yet made up her mind.", "B": "She rejected both faculty advisors.", "C": "She decided to switch universities.", "D": "She wants to work without an advisor."},
        "A",
        "Idiom 'on the fence' bermakna masih bimbang / belum menentukan pilihan ('undecided').",
        "Idiom: 'On the fence'"
    ),
    (
        ["Woman: I heard the physics department is getting a new electron microscope.", "Man: It's about time! The current model has been breaking down every other week."],
        "What does the man mean?",
        {"A": "The upgrade is long overdue.", "B": "The current microscope is sufficient.", "C": "The department cannot afford new equipment.", "D": "He dislikes using microscopes."},
        "A",
        "Ungkapan 'It's about time!' menyatakan bahwa penggantian/pembaharuan alat tersebut memang sudah sangat mendesak dan terlambat.",
        "Idiom: 'It's about time'"
    ),
    (
        ["Man: Is the campus shuttle still running to the downtown tech hub?", "Woman: Only until eight o'clock on Fridays; after that, you'll have to take the public transit bus."],
        "What does the woman say about the shuttle?",
        {"A": "Its service ends at eight o'clock on Friday evenings.", "B": "It operates all night on weekends.", "C": "It is out of service indefinitely.", "D": "It only stops at the city center."},
        "A",
        "Layanan shuttle kampus berakhir pukul 8 malam pada hari Jumat, setelahnya harus menggunakan bus umum.",
        "Schedule Limitation"
    ),
    (
        ["Woman: Do you think our debate team has a shot at winning the regional finals?", "Man: With the amount of preparation we've put in, I'd say the odds are definitely in our favor."],
        "What does the man mean?",
        {"A": "They have a high likelihood of winning.", "B": "The opponents have superior arguments.", "C": "The regional finals were called off.", "D": "They need more time to practice."},
        "A",
        "'The odds are in our favor' bermakna peluang kemenangan mereka sangat besar berkat persiapan matang.",
        "Probability / Optimism"
    )
]

for i, item in enumerate(part_a_data):
    questions.append({
        "id": qid,
        "section": "listening",
        "part": "Part A",
        "questionNumber": qid,
        "audioUrl": f"/audio/{audio_files[qid - 1]}",
        "speakerText": item[0],
        "prompt": item[1],
        "options": item[2],
        "correctAnswer": item[3],
        "explanation": item[4],
        "ruleCategory": item[5]
    })
    qid += 1

# Part B: Longer Conversations (31 to 38)
part_b_data = [
    {
        "speakers": [
            "Narrator: Questions 31 through 34 are based on a conversation about university internship opportunities.",
            "Advisor: Good morning Kevin. What brings you to the career development office today?",
            "Kevin: I'm interested in applying for a summer research internship at the National Renewable Energy Lab, but their requirements mention prior experience with geospatial mapping software.",
            "Advisor: While GIS proficiency is advantageous, our department offers an intensive three-week workshop over the spring break that qualifies students for that exact certification.",
            "Kevin: That sounds perfect! Does that workshop also include practical field data collection?"
        ],
        "items": [
            ("Why did Kevin visit the career office?", {"A": "To request an extension on his thesis.", "B": "To seek guidance on a renewable energy internship application.", "C": "To drop out of the engineering faculty.", "D": "To register for next semester's regular courses."}, "B", "Kevin datang untuk menanyakan internship di National Renewable Energy Lab.", "Main Topic"),
            ("What prerequisite skill was Kevin initially concerned about?", {"A": "Statistical machine learning.", "B": "Geospatial mapping software (GIS).", "C": "Technical German fluency.", "D": "Industrial welding techniques."}, "B", "Kevin khawatir karena persyaratannya mencakup GIS software.", "Specific Detail"),
            ("What alternative solution does the advisor propose?", {"A": "Taking a three-week spring break certification workshop.", "B": "Applying for a business marketing role instead.", "C": "Waiting until his senior year to apply.", "D": "Hiring a private GIS software tutor."}, "A", "Konselor menyarankan workshop 3 minggu bersertifikat saat liburan musim semi.", "Proposed Solution"),
            ("When does the proposed workshop take place?", {"A": "During the upcoming spring recess.", "B": "Throughout the summer semester.", "C": "Every Saturday morning in autumn.", "D": "Immediately after final exams in June."}, "A", "Penasihat menyatakan workshop berlangsung 'over the spring break'.", "Detail Timing")
        ]
    },
    {
        "speakers": [
            "Narrator: Questions 35 through 38 are based on a conversation regarding a campus greenhouse project.",
            "Student A: Look at these heirloom tomato seedlings, Emily! The automated drip irrigation system is functioning flawlessly.",
            "Student B: Definitely, but have you noticed the leaf discoloration on the lower tiers? It looks like a classic nitrogen deficiency.",
            "Student A: You might be right. The nutrient reservoir was calibrated for leafy greens, not fruiting nightshades.",
            "Student B: Let's adjust the electrical conductivity sensor to increase nitrate concentrations by fifteen percent."
        ],
        "items": [
            ("What project are the two students inspecting?", {"A": "An automated campus greenhouse cultivation system.", "B": "A commercial pesticide manufacturing plant.", "C": "A riverbed soil erosion survey.", "D": "A hybrid solar panel array."}, "A", "Keduanya sedang memeriksa proyek rumah kaca kampus (greenhouse project).", "Core Subject"),
            ("What problem does Emily observe on the plants?", {"A": "Infestation by invasive aphids.", "B": "Leaf discoloration caused by nitrogen deficiency.", "C": "Structural stem breakage from heavy wind.", "D": "Fungal mildew on the root systems."}, "B", "Emily memperhatikan adanya diskolorasi daun akibat kekurangan nitrogen.", "Problem Diagnosis"),
            ("Why was the nutrient solution initially inadequate?", {"A": "It was configured for leafy greens rather than fruiting crops.", "B": "The water pump had lost electrical power.", "C": "The reservoir had dried out completely.", "D": "Excessive salt had contaminated the water."}, "A", "Kalibrasi awal didesain untuk tanaman daun, bukan buah tomat.", "Root Cause"),
            ("What immediate corrective step do they agree to take?", {"A": "Increase the nitrate concentration by fifteen percent.", "B": "Harvest all the tomato seedlings immediately.", "C": "Replace the entire irrigation pipeline.", "D": "Shut down the greenhouse lighting."}, "A", "Mereka sepakat menaikkan konsentrasi nitrat sebesar 15%.", "Action Plan")
        ]
    }
]

for block in part_b_data:
    for item in block["items"]:
        questions.append({
            "id": qid,
            "section": "listening",
            "part": "Part B",
            "questionNumber": qid,
            "audioUrl": f"/audio/{audio_files[qid - 1]}",
            "speakerText": block["speakers"],
            "prompt": item[0],
            "options": item[1],
            "correctAnswer": item[2],
            "explanation": item[3],
            "ruleCategory": item[4]
        })
        qid += 1

# Part C: Lectures & Talks (39 to 50 = 12 items)
part_c_data = [
    {
        "speakers": [
            "Narrator: Questions 39 through 42 are based on an astronomy lecture about stellar evolution.",
            "Professor: Today we examine white dwarfs, the final evolutionary stage for stars whose initial mass is less than eight solar masses. When stars like our Sun exhaust hydrogen fuel in their cores, they expand into red giants and subsequently shed their outer envelopes, leaving behind an Earth-sized remnant composed primarily of electron-degenerate matter. In this state, normal thermal pressure no longer supports the star against gravitational collapse; instead, electron degeneracy pressure—governed by the Pauli exclusion principle—halts contraction. However, if accretion pushes the remnant beyond the Chandrasekhar limit of 1.4 solar masses, a catastrophic thermonuclear runaway occurs, producing a Type Ia supernova."
        ],
        "items": [
            ("What is the primary topic of the lecture?", {"A": "The formation of supermassive black holes.", "B": "The structure and evolution of white dwarf stars.", "C": "The chemical composition of planetary nebulae.", "D": "The mechanics of solar flares and sunspots."}, "B", "Topik utama kuliah adalah evolusi dan struktur bintang katai putih (white dwarfs).", "Main Lecture Idea"),
            ("What prevents a white dwarf from collapsing under gravity?", {"A": "Nuclear fusion of iron in the core.", "B": "Electron degeneracy pressure based on quantum exclusion.", "C": "Thermal radiation pressure from hydrogen burning.", "D": "Electromagnetic repulsion between polar ice caps."}, "B", "Penahan keruntuhan gravitasi adalah 'electron degeneracy pressure'.", "Scientific Concept"),
            ("What happens if a white dwarf exceeds the Chandrasekhar limit?", {"A": "It instantly turns into a stable red dwarf.", "B": "It detonates in a Type Ia supernova explosion.", "C": "It cools down into a dormant planet.", "D": "It ejects a cloud of dark matter particles."}, "B", "Jika melebihi batas 1.4 massa matahari, terjadi ledakan supernova tipe Ia.", "Cause and Effect"),
            ("How does the physical size of a white dwarf compare to ordinary planets?", {"A": "It is roughly comparable in diameter to Earth.", "B": "It is ten times larger than Jupiter.", "C": "It is identical in volume to our current Sun.", "D": "It occupies an entire galaxy quadrant."}, "A", "Dosen menyebutkan ukurannya menyusut seukuran bumi ('Earth-sized remnant').", "Comparative Dimension")
        ]
    },
    {
        "speakers": [
            "Narrator: Questions 43 through 46 are based on an archaeology talk on ancient Maya agricultural hydraulics.",
            "Lecturer: Contrary to earlier historical assumptions that Maya civilization practiced only slash-and-burn horticulture, recent LiDAR aerial surveys reveal sophisticated wetland canal networks across the Yucatan lowlands. Known as raised fields or chinampas, these rectangular earthworks allowed year-round cultivation by managing seasonal monsoon floods and retaining fertile aquatic muck. Canals served a dual role: providing constant irrigation during protracted dry spells and serving as aquatic transportation arteries for trade goods."
        ],
        "items": [
            ("What technological tool revealed the extensive canal systems?", {"A": "LiDAR aerial laser scanning.", "B": "Deep underwater sonar mapping.", "C": "Ground-penetrating seismic explosives.", "D": "Hand-drawn colonial parchment maps."}, "A", "Teknologi LiDAR mengungkap jaringan kanal yang tertutup kanopi hutan.", "Technological Method"),
            ("What myth about Maya agriculture was debunked by modern research?", {"A": "That they relied solely on primitive slash-and-burn methods.", "B": "That they grew only maize without secondary crops.", "C": "That they had no knowledge of seasonal weather.", "D": "That they abandoned all farmlands during winter."}, "A", "Mitos bahwa suku Maya hanya bertani tebas-bakar (slash-and-burn) terbantahkan.", "Debunked Theory"),
            ("What dual benefit did the canals provide?", {"A": "Irrigation storage and internal trade transit.", "B": "Drinking water and mineral salt mining.", "C": "Fish breeding and defensive border moats.", "D": "Power generation and flood diversion."}, "A", "Kanal berfungsi sebagai cadangan irigasi sekaligus jalur transportasi perahu dagang.", "Dual Functional Purpose"),
            ("What soil management practice maintained high field fertility?", {"A": "Spreading aquatic muck scooped from canal beds.", "B": "Importing volcanic ash from distant Andes ranges.", "C": "Using chemical synthetic nitrates.", "D": "Leaving fields fallow for twenty consecutive years."}, "A", "Lumpur subur (aquatic muck) dari dasar kanal diangkat untuk menyuburkan tanah.", "Agricultural Practice")
        ]
    },
    {
        "speakers": [
            "Narrator: Questions 47 through 50 are based on an environmental science lecture on urban heat islands.",
            "Professor: Urban Heat Islands, or UHIs, occur when metropolitan centers experience significantly higher ambient temperatures than surrounding rural landscapes. Impervious surfaces such as dark asphalt and concrete exhibit high thermal mass, absorbing daytime solar irradiance and slowly re-radiating heat throughout the nocturnal hours. Furthermore, the scarcity of vegetative evapotranspiration limits natural evaporative cooling. Mitigation strategies include reflective cool roofs, permeable pavements, and urban greening corridors."
        ],
        "items": [
            ("What causes the Urban Heat Island effect?", {"A": "Thermal absorption by dark impervious surfaces and low vegetation.", "B": "Excessive ozone layer depletion directly above cities.", "C": "Underground magma chambers shifting near city borders.", "D": "Wind turbines blocking prevailing maritime breezes."}, "A", "Material aspal/beton menyerap panas dan minimnya vegetasi memicu UHI.", "Root Mechanism"),
            ("Why do concrete structures maintain elevated night temperatures?", {"A": "They store daytime solar energy and release it slowly at night.", "B": "They produce internal chemical heat through radioactive decay.", "C": "They are heated by high-voltage electrical power grids.", "D": "They prevent cold ocean fog from descending."}, "A", "Material berdaya serap tinggi menyimpan panas dan melepasnya perlahan di malam hari.", "Thermal Storage"),
            ("How does vegetation help lower surrounding ambient temperatures?", {"A": "Through natural cooling via evapotranspiration.", "B": "By absorbing all cosmic microwave radiation.", "C": "By blocking underground sewer vapor emissions.", "D": "By altering the chemical composition of nitrogen in air."}, "A", "Tumbuhan mendinginkan lingkungan lewat proses evapotranspirasi.", "Biological Cooling"),
            ("Which of the following is recommended as a practical mitigation method?", {"A": "Installing reflective cool roofing and green corridors.", "B": "Painting all roadways in jet-black tarmac.", "C": "Enclosing city centers in glass atmospheric domes.", "D": "Eliminating parks to build wider highway overpasses."}, "A", "Pemasangan 'cool roofs' berdaya pantul tinggi dan koridor hijau kota.", "Mitigation Strategy")
        ]
    }
]

for block in part_c_data:
    for item in block["items"]:
        questions.append({
            "id": qid,
            "section": "listening",
            "part": "Part C",
            "questionNumber": qid,
            "audioUrl": f"/audio/{audio_files[qid - 1]}",
            "speakerText": block["speakers"],
            "prompt": item[0],
            "options": item[1],
            "correctAnswer": item[2],
            "explanation": item[3],
            "ruleCategory": item[4]
        })
        qid += 1

# ============================================================
# SECTION 2: STRUCTURE & WRITTEN EXPRESSION (40 ITEMS)
# ============================================================

# Part A: Sentence Completion (No 1 to 15)
structure_part_a = [
    (
        "Not only _______ critical nutrients to coastal wetlands, but seasonal floods also deposit fertile silt across agricultural floodplains.",
        {"A": "do rivers supply", "B": "rivers supplying", "C": "rivers supply", "D": "that rivers supply"},
        "A",
        "Rumus Inversi: Kalimat diawali ekspresi negatif/restriktif 'Not only' mewajibkan pola Inversi (Auxiliary Verb + Subject + Main Verb). Bentuk benar: 'do rivers supply'.",
        "Negative Inversion: 'Not only + Aux + S + V'"
    ),
    (
        "_______ in 1879 by Thomas Edison, the incandescent light bulb revolutionized indoor illumination and industrial productivity.",
        {"A": "It was patented", "B": "Patented", "C": "Patenting", "D": "To patent"},
        "B",
        "Reduced Adjective Clause (Passive Past Participle): 'Which was patented in 1879...' disederhanakan menjadi participial phrase 'Patented in 1879...'.",
        "Participle Modifier / Reduced Relative Clause"
    ),
    (
        "The speed of light in a vacuum is _______ universal constant that cannot be exceeded by any physical matter.",
        {"A": "a fundamental", "B": "fundamental", "C": "the fundamentally", "D": "more fundamental"},
        "A",
        "Noun Phrase: Dibutuhkan indefinite article 'a' diikuti kata sifat 'fundamental' untuk memodifikasi singular countable noun 'constant'.",
        "Noun Phrase Structure: Article + Adj + Noun"
    ),
    (
        "Rarely _______ such dramatic volcanic activity without prior seismic tremors detected by seismologists.",
        {"A": "a caldera exhibits", "B": "does a caldera exhibit", "C": "exhibiting a caldera", "D": "that a caldera exhibits"},
        "B",
        "Inversi: 'Rarely' adalah kata keterangan frekuensi negatif. Polanya: Rarely + does (aux) + a caldera (subject) + exhibit (bare infinitive).",
        "Negative Inversion with 'Rarely'"
    ),
    (
        "Engineers designed the suspension bridge with aerodynamic dampers _______ excessive swaying during high-velocity windstorms.",
        {"A": "to prevent", "B": "prevention of", "C": "for prevent", "D": "so prevented"},
        "A",
        "Infinitive of Purpose: Menyatakan tujuan tindakan ('untuk mencegah') menggunakan 'to + Verb 1' ('to prevent').",
        "Infinitive of Purpose (to + V1)"
    ),
    (
        "Although copper conducts electricity efficiently, silver is _______ of all known metallic elements.",
        {"A": "most conductive", "B": "the most conductive", "C": "more conductive", "D": "as conductive"},
        "B",
        "Superlative Degree: Perbandingan paling unggul di antara semua ('of all known metallic elements') membutuhkan 'the most + adjective'.",
        "Superlative Comparison: 'the most + Adj'"
    ),
    (
        "_______ the discovery of antibiotics in the twentieth century, bacterial infections were frequently fatal.",
        {"A": "Prior to", "B": "Although", "C": "In spite", "D": "Because"},
        "A",
        "Prepositional Phrase: 'Prior to' (sebelum) adalah preposisi yang tepat diikuti oleh noun phrase 'the discovery of antibiotics'.",
        "Prepositional Phrase of Time: 'Prior to + Noun'"
    ),
    (
        "Neither the president of the university nor the department deans _______ attending the regional accreditation summit.",
        {"A": "is", "B": "are", "C": "was", "D": "have"},
        "B",
        "Correlative Conjunction (Neither... nor...): Kata kerja harus bersepakat dengan subjek terdekat. Subjek terdekat adalah 'the department deans' (plural), maka verb harus plural: 'are'.",
        "Subject-Verb Agreement: Neither... Nor..."
    ),
    (
        "Geothermal power stations harness steam generated deep within the crust _______ electricity with minimal emissions.",
        {"A": "producing", "B": "to produce", "C": "production", "D": "for produce"},
        "B",
        "Infinitive of Purpose: Menjelaskan tujuan pembangkitan uap yaitu 'to produce electricity'.",
        "Infinitive of Purpose"
    ),
    (
        "Had the meteorologist analyzed the radar satellite imagery earlier, the coastal city _______ evacuated well before the storm made landfall.",
        {"A": "would have been", "B": "will be", "C": "was", "D": "had been"},
        "A",
        "Conditional Type 3 (Inverted): 'Had + Subject + V3' (klausa if lampau tidak nyata) berpasangan dengan main clause 'would have been + V3'.",
        "Inverted Conditional Sentence (Type 3)"
    ),
    (
        "The Hubble Space Telescope, _______ into low Earth orbit in 1990, provided unprecedented cosmological imagery.",
        {"A": "launched", "B": "was launching", "C": "which launched it", "D": "launching"},
        "A",
        "Reduced Passive Relative Clause: 'Which was launched into orbit...' dipadatkan menjadi past participle 'launched'.",
        "Reduced Relative Clause (Past Participle)"
    ),
    (
        "So rapid _______ that municipal authorities struggled to expand water supply infrastructure.",
        {"A": "was urban growth", "B": "urban growth was", "C": "did urban grow", "D": "growing urban"},
        "A",
        "Inversi 'So + Adjective': Kalimat diawali 'So rapid' mewajibkan inversi (Verb 'was' mendahului Subject 'urban growth').",
        "Inversion after 'So + Adjective'"
    ),
    (
        "The Amazon rainforest generates approximately twenty percent of Earth's terrestrial oxygen, _______ it the nickname 'the lungs of the planet'.",
        {"A": "earning", "B": "earned", "C": "earns", "D": "to earn"},
        "A",
        "Present Participle as Result Clause: Menyatakan konsekuensi aktif dari klausa utama menggunakan V-ing ('earning it the nickname...').",
        "Participle of Result / Consequence (-ing)"
    ),
    (
        "No sooner _______ the laboratory experiment than the sensor recorded an abnormal voltage spike.",
        {"A": "had researchers begun", "B": "researchers had begun", "C": "did researchers begin", "D": "researchers beginning"},
        "A",
        "Correlative Inversion (No sooner... than...): 'No sooner' di awal klausa mewajibkan inversi past perfect: 'had + S + V3'.",
        "Correlative Inversion: 'No sooner had + S + V3'"
    ),
    (
        "Mammals maintain a constant internal body temperature regardless of _______ the surrounding environmental conditions may fluctuate.",
        {"A": "how severely", "B": "severe how", "C": "that severe", "D": "what severe"},
        "A",
        "Noun Clause with 'how + adverb': Memodifikasi kata kerja 'fluctuate' memerlukan adverb of degree 'how severely'.",
        "Noun Clause Modifier: 'how + Adverb'"
    )
]

for idx, (prm, opts, cr, exp, cat) in enumerate(structure_part_a):
    questions.append({
        "id": qid,
        "section": "structure",
        "part": "Part A",
        "questionNumber": idx + 1,
        "prompt": prm,
        "options": opts,
        "correctAnswer": cr,
        "explanation": exp,
        "ruleCategory": cat
    })
    qid += 1

# Part B: Error Identification (No 16 to 40 = 25 items)
structure_part_b = [
    (
        "The [discovery] (A) of penicillin [were] (B) one of the greatest [medical] (C) breakthroughs of the twentieth [century] (D).",
        {"A": "discovery", "B": "were", "C": "medical", "D": "century"},
        "B",
        "Subject-Verb Agreement: Subjek kalimat adalah 'The discovery' (tunggal), maka kata kerja harus 'was', bukan 'were'.",
        "Subject-Verb Agreement with Prepositional Phrases"
    ),
    (
        "Although honeybees [produce] (A) honey, their [more] (B) vital ecological [function] (C) is the [pollinate] (D) of flowering crops.",
        {"A": "produce", "B": "more", "C": "function", "D": "pollinate"},
        "D",
        "Part of Speech: Setelah determiner 'the' dan sebelum 'of', diperlukan noun 'pollination', bukan kata kerja 'pollinate'.",
        "Noun vs. Verb Form (The + Noun + of)"
    ),
    (
        "Many marine mammals [must] (A) surface [periodical] (B) to breathe atmospheric oxygen [even] (C) while swimming at [great] (D) depths.",
        {"A": "must", "B": "periodical", "C": "even", "D": "great"},
        "B",
        "Adverb vs. Adjective: Kata yang menerangkan verb 'surface' harus berbentuk adverb 'periodically', bukan kata sifat 'periodical'.",
        "Adverb Modifying Verb"
    ),
    (
        "Neither the flight controller [nor] (A) the seasoned pilots [was] (B) able to explain the mysterious radar [anomaly] (C) observed [over] (D) the Pacific.",
        {"A": "nor", "B": "was", "C": "anomaly", "D": "over"},
        "B",
        "Neither... Nor...: Subjek terdekat adalah 'the seasoned pilots' (jamak), sehingga verb harus jamak 'were', bukan 'was'.",
        "Proximity Rule in Correlative Conjunctions"
    ),
    (
        "The [rapidly] (A) development of generative artificial intelligence [has] (B) sparked intense debate among [ethicists] (C) and computer [scientists] (D).",
        {"A": "rapidly", "B": "has", "C": "ethicists", "D": "scientists"},
        "A",
        "Adjective vs. Adverb: Menerangkan noun 'development' membutuhkan kata sifat (adjective) 'rapid', bukan adverb 'rapidly'.",
        "Adjective Modifying Noun"
    ),
    (
        "Photosynthesis allows green plants [converting] (A) solar radiation [into] (B) chemical energy [stored] (C) in [carbohydrate] (D) bonds.",
        {"A": "converting", "B": "into", "C": "stored", "D": "carbohydrate"},
        "A",
        "Verb Pattern: Kata kerja 'allow' mewajibkan pola 'allow someone TO DO something' (infinitive with to), jadi harus 'to convert'.",
        "Verb + Object + to-Infinitive ('allow to')"
    ),
    (
        "Because of its [extreme] (A) gravitational pull, a black hole prevents [any] (B) electromagnetic radiation, [including] (C) light, from [escape] (D).",
        {"A": "extreme", "B": "any", "C": "including", "D": "escape"},
        "D",
        "Preposition + Gerund: Setelah preposisi 'from', kata kerja harus berbentuk Gerund (V-ing), yaitu 'escaping'.",
        "Preposition Followed by Gerund (from escaping)"
    ),
    (
        "Archaeological excavations [in] (A) Mesopotamia indicate that writing systems [developed] (B) [independent] (C) in several ancient [civilizations] (D).",
        {"A": "in", "B": "developed", "C": "independent", "D": "civilizations"},
        "C",
        "Adverb of Manner: Kata yang memodifikasi verb 'developed' harus berupa adverb 'independently' (secara mandiri).",
        "Adverb Modifying Verb (developed independently)"
    ),
    (
        "The Great Barrier Reef, [which] (A) stretches for over 2,300 kilometers, [are] (B) composed of billions of [tiny] (C) coral [polyps] (D).",
        {"A": "which", "B": "are", "C": "tiny", "D": "polyps"},
        "B",
        "Subject-Verb Agreement: Subjek 'The Great Barrier Reef' berbentuk tunggal (singular proper noun), maka verb harus 'is', bukan 'are'.",
        "Singular Subject with Non-Defining Clause"
    ),
    (
        "In the early nineteenth century, steamboats [facilitated] (A) interstate commerce by [make] (B) river transportation [significantly] (C) faster and [cheaper] (D).",
        {"A": "facilitated", "B": "make", "C": "significantly", "D": "cheaper"},
        "B",
        "Preposition + Gerund: Setelah preposisi 'by', kata kerja wajib berbentuk gerund 'making', bukan 'make'.",
        "Gerund after Preposition ('by making')"
    ),
    (
        "Every [student] (A) in the advanced robotics program [must] (B) submit [their] (C) laboratory capstone proposal before the final [deadline] (D).",
        {"A": "student", "B": "must", "C": "their", "D": "deadline"},
        "C",
        "Pronoun Agreement: 'Every student' adalah singular, dalam tata bahasa formal baku digantikan pronoun 'his or her', bukan 'their'.",
        "Indefinite Pronoun Agreement (Every + Singular)"
    ),
    (
        "The volcanic eruption [disrupted] (A) global climate patterns, [caused] (B) agricultural crop failures [across] (C) three [continents] (D).",
        {"A": "disrupted", "B": "caused", "C": "across", "D": "continents"},
        "B",
        "Participle of Result: Menunjukkan akibat dari aksi kalimat pertama membutuhkan present participle aktif 'causing', bukan past tense 'caused'.",
        "Participial Result Clause ('causing')"
    ),
    (
        "The human brain [contains] (A) approximately eighty-six billion neurons, [each of which] (B) [connect] (C) to thousands of neighboring [synapses] (D).",
        {"A": "contains", "B": "each of which", "C": "connect", "D": "synapses"},
        "C",
        "Subject-Verb Agreement: 'Each' adalah singular, sehingga kata kerja dalam present tense harus menambahkan 's' ('connects').",
        "Singular Agreement with 'Each of which'"
    ),
    (
        "Unlike [another] (A) metals, mercury [remains] (B) in a liquid state at [standard] (C) room temperature and atmospheric [pressure] (D).",
        {"A": "another", "B": "remains", "C": "standard", "D": "pressure"},
        "A",
        "Determiner Usage: Di depan plural countable noun ('metals') harus menggunakan determiner 'other', bukan 'another' (yang khusus untuk singular).",
        "Determiner: Other vs. Another"
    ),
    (
        "Although the proposal was [creative] (A), the committee rejected it because the budget was [excessive] (B) high and [poorly] (C) [justified] (D).",
        {"A": "creative", "B": "excessive", "C": "poorly", "D": "justified"},
        "B",
        "Adverb Modifying Adjective: Kata yang memodifikasi adjective 'high' harus berupa adverb 'excessively' (sangat berlebihan).",
        "Adverb Modifying Adjective (excessively high)"
    ),
    (
        "Astronomers have [identified] (A) thousands of exoplanets, some of which [possesses] (B) atmospheric conditions [favorable] (C) for liquid [water] (D).",
        {"A": "identified", "B": "possesses", "C": "favorable", "D": "water"},
        "B",
        "Subject-Verb Agreement: 'Some of which' merujuk kembali ke plural antecedent 'exoplanets', maka kata kerjanya harus jamak 'possess', bukan 'possesses'.",
        "Relative Pronoun Agreement with Plural Antecedent"
    ),
    (
        "The economic prosperity of the Dutch Golden Age [was built] (A) on global maritime trade, [financial] (B) innovation, and [rely] (C) banking [institutions] (D).",
        {"A": "was built", "B": "financial", "C": "rely", "D": "institutions"},
        "C",
        "Parallel Structure / Adjective Form: 'global maritime trade', 'financial innovation', dan '[reliable] banking institutions'. Diperlukan kata sifat 'reliable', bukan kata kerja 'rely'.",
        "Parallelism: Adjective + Noun Series"
    ),
    (
        "The polar bear's [thick] (A) layer of adipose fat [insulate] (B) its body against the [frigid] (C) Arctic [temperatures] (D).",
        {"A": "thick", "B": "insulate", "C": "frigid", "D": "temperatures"},
        "B",
        "Subject-Verb Agreement: Subjek 'The polar bear's thick layer' adalah tunggal ('layer'), maka verb harus singular 'insulates'.",
        "Subject-Verb Agreement (Head Noun 'layer')"
    ),
    (
        "During the Renaissance, European scholars [rediscovered] (A) classical Greek philosophy, [who] (B) profoundly [influenced] (C) the course of Western [thought] (D).",
        {"A": "rediscovered", "B": "who", "C": "influenced", "D": "thought"},
        "B",
        "Relative Pronoun: 'Philosophy' adalah benda/konsep abstrak, sehingga relative pronoun yang tepat adalah 'which', bukan 'who' (yang khusus untuk manusia).",
        "Relative Pronoun for Things ('which' vs 'who')"
    ),
    (
        "The architect designed the museum [with] (A) floor-to-ceiling glass panels so that natural sunlight [could] (B) illuminate the galleries [interior] (C) without [artificial] (D) lighting.",
        {"A": "with", "B": "could", "C": "interior", "D": "artificial"},
        "C",
        "Noun Phrase / Possessive: 'the galleries interior' harus berbentuk possessive noun phrase 'the gallery interiors' atau 'the galleries' interior'.",
        "Possessive Noun Phrase Structure"
    ),
    (
        "The discovery of deep-sea hydrothermal vents [demonstrated] (A) that complex life forms could thrive [entire] (B) without [direct] (C) solar [radiation] (D).",
        {"A": "demonstrated", "B": "entire", "C": "direct", "D": "radiation"},
        "B",
        "Adverb vs. Adjective: Menerangkan prepositional phrase 'without solar radiation' memerlukan adverb 'entirely' (sepenuhnya).",
        "Adverb Modifying Prepositional Phrase"
    ),
    (
        "A [number] (A) of endangered species in the tropical reserve [has] (B) experienced population [rebounds] (C) due to strict anti-poaching [enforcement] (D).",
        {"A": "number", "B": "has", "C": "rebounds", "D": "enforcement"},
        "B",
        "A number of vs. The number of: 'A number of + plural noun' selalu dianggap jamak (plural) dan memerlukan verb jamak 'have experienced', bukan 'has'.",
        "'A number of' takes Plural Verb"
    ),
    (
        "Wind turbines [generate] (A) electricity by converting the kinetic energy of air currents [into] (B) rotational mechanical [move] (C) inside the [generator] (D).",
        {"A": "generate", "B": "into", "C": "move", "D": "generator"},
        "C",
        "Word Form: Setelah compound adjective 'rotational mechanical', dibutuhkan kata benda (noun) 'movement' atau 'motion', bukan kata kerja 'move'.",
        "Adjective + Noun Construction ('movement')"
    ),
    (
        "Neither drought [nor] (A) invasive locust swarms [was] (B) able to destroy the resilient drought-resistant [sorghum] (C) crops [cultivated] (D) by local farmers.",
        {"A": "nor", "B": "was", "C": "sorghum", "D": "cultivated"},
        "B",
        "Neither... Nor...: Subjek terdekat adalah plural 'invasive locust swarms', maka kata kerja harus plural 'were', bukan 'was'.",
        "Correlative Conjunction Agreement"
    ),
    (
        "Subterranean aquifers supply [drinkable] (A) water to millions of agricultural communities, [make] (B) sustainable groundwater management a matter of [global] (C) [urgency] (D).",
        {"A": "drinkable", "B": "make", "C": "global", "D": "urgency"},
        "B",
        "Participial Result Clause: Klausa akibat aktif membutuhkan present participle 'making', bukan bare infinitive 'make'.",
        "Participle of Result ('making')"
    )
]

for idx, (prm, opts, cr, exp, cat) in enumerate(structure_part_b):
    questions.append({
        "id": qid,
        "section": "structure",
        "part": "Part B",
        "questionNumber": idx + 16,
        "prompt": prm,
        "options": opts,
        "correctAnswer": cr,
        "explanation": exp,
        "ruleCategory": cat
    })
    qid += 1

# ============================================================
# SECTION 3: READING COMPREHENSION (50 ITEMS = 5 PASSAGES X 10)
# ============================================================

passages_data = [
    {
        "text": """Photosynthesis is the biochemical process through which green plants, algae, and certain cyanobacteria convert sunlight, carbon dioxide, and water into chemical energy stored in glucose molecules. This transformation takes place inside specialized cellular organelles called chloroplasts, which contain chlorophyll, the green pigment responsible for absorbing photon wavelengths primarily in the blue and red spectrums.

During the light-dependent reactions within the thylakoid membranes, solar energy splits water molecules into oxygen gas, protons, and electrons. Oxygen is released into the atmosphere as a metabolic byproduct, sustaining aerobic terrestrial life. Subsequently, during the Calvin cycle in the stroma, chemical energy stored in ATP and NADPH is utilized to fix carbon dioxide into three-carbon sugars. Without this foundational process, virtually all complex food chains on Earth would collapse, as plants represent the primary trophic foundation for heterotrophic organisms.

Environmental factors such as ambient temperature, carbon dioxide concentration, and light irradiance directly regulate photosynthetic rates. Under conditions of water stress, plants partially close their stomatal pores to reduce transpirational moisture loss, inadvertently constricting carbon dioxide intake and diminishing overall glucose synthesis.""",
        "items": [
            ("What is the primary purpose of the passage?", {"A": "To critique the efficiency of renewable solar cells.", "B": "To explain the fundamental biochemical mechanisms and ecological significance of photosynthesis.", "C": "To contrast cyanobacteria with multicellular aquatic algae.", "D": "To describe the historical discovery of chloroplasts."}, "B", "Teks secara komprehensif menguraikan mekanisme biokimia dan signifikansi ekologis fotosintesis.", "Main Idea"),
            ("The word 'byproduct' in paragraph 2 is closest in meaning to:", {"A": "primary raw material", "B": "unintentional secondary result", "C": "hazardous waste substance", "D": "catalytic enzyme"}, "B", "Byproduct berarti produk sampingan sekunder dari suatu reaksi utama.", "Vocabulary in Context"),
            ("According to the passage, where does the Calvin cycle occur?", {"A": "Within the thylakoid membranes.", "B": "In the stroma of the chloroplast.", "C": "Inside the cell wall vacuoles.", "D": "Directly in the roots through osmosis."}, "B", "Berdasarkan paragraf 2: 'Subsequently, during the Calvin cycle in the stroma...'", "Direct Detail"),
            ("It can be inferred from the passage that heterotrophic organisms:", {"A": "Can produce their own sustenance independently of sunlight.", "B": "Depend ultimately on photosynthetic autotrophs for survival.", "C": "Absorb carbon dioxide directly through their skin.", "D": "Inhabit only deep subterranean biomes."}, "B", "Teks menyatakan rantai makanan akan runtuh tanpa tumbuhan karena merupakan dasar trofik heterotrof.", "Inference"),
            ("The word 'inadvertently' in paragraph 3 is closest in meaning to:", {"A": "intentionally", "B": "unintentionally", "C": "violently", "D": "beneficially"}, "B", "Inadvertently berarti tanpa disengaja (unintentionally).", "Vocabulary"),
            ("Which part of the plant cell contains chlorophyll?", {"A": "The chloroplast organelle.", "B": "The nuclear envelope.", "C": "The endoplasmic reticulum.", "D": "The ribosome complex."}, "A", "Paragraf 1 menyatakan klorofil terdapat di dalam organel kloroplas.", "Factual Detail"),
            ("What happens when plants experience water stress?", {"A": "They completely shed all their foliage.", "B": "They partially close their stomatal pores to conserve water.", "C": "They absorb carbon dioxide through their stems.", "D": "They double their rate of glucose production."}, "B", "Paragraf 3: 'Under conditions of water stress, plants partially close their stomatal pores...'", "Direct Detail"),
            ("The author mentions oxygen in paragraph 2 as an example of:", {"A": "A metabolic byproduct that sustains aerobic life.", "B": "A toxic contaminant in chloroplasts.", "C": "A catalyst for solar fusion.", "D": "An enzyme required for nitrogen fixation."}, "A", "Paragraf 2: 'Oxygen is released into the atmosphere as a metabolic byproduct, sustaining aerobic terrestrial life.'", "Author's Purpose / Example"),
            ("What wavelength spectrums does chlorophyll primarily absorb?", {"A": "Green and infrared.", "B": "Blue and red.", "C": "Ultraviolet and yellow.", "D": "Radio and microwave."}, "B", "Paragraf 1: 'absorbing photon wavelengths primarily in the blue and red spectrums.'", "Scanning Detail"),
            ("Which factor does NOT directly regulate photosynthetic efficiency according to the passage?", {"A": "Light irradiance.", "B": "Atmospheric pressure of helium.", "C": "Ambient temperature.", "D": "Carbon dioxide concentration."}, "B", "Gas helium tidak disebutkan sebagai faktor pengatur laju fotosintesis.", "Negative Fact (Except/Not)")
        ]
    },
    {
        "text": """Hydrothermal vents are fissures on the seabed from which geothermally heated water discharges into the ocean abyss. First discovered in 1977 near the Galapagos Rift, these extreme underwater hot springs occur along volcanically active plate boundaries, where tectonic rifting allows cold seawater to percolate deep into oceanic crust. There, seawater is heated by underlying magma chambers to temperatures exceeding 400 degrees Celsius, dissolving mineral sulfides of iron, copper, and zinc.

As the superheated, mineral-laden hydrothermal fluid vents back into the near-freezing deep ocean water, rapid precipitation causes the minerals to crystallize, constructing towering hollow chimneys commonly known as 'black smokers'. Deprived of all solar illumination, vent ecosystems do not rely on photosynthetic primary production. Instead, chemoautotrophic archaebacteria oxidize toxic dissolved hydrogen sulfide to generate organic sustenance, supporting dense endemic communities of giant vestimentiferan tube worms, vent crabs, and blind shrimp.

The biological adaptations observed in vent fauna have revolutionized astrobiology, offering plausible terrestrial analogues for the potential existence of subterranean marine life beneath the frozen ice sheets of Jupiter's moon Europa and Saturn's moon Enceladus.""",
        "items": [
            ("What is the central theme of the passage?", {"A": "The commercial mining of seabed mineral nodules.", "B": "The geological characteristics and chemoautotrophic biology of hydrothermal vents.", "C": "The seasonal migration routes of deep-sea mammals.", "D": "The history of submarine vessel design."}, "B", "Teks membahas geologi dan biologi kemosintesis lubang hidrotermal bawah laut.", "Main Idea"),
            ("The word 'percolate' in paragraph 1 is closest in meaning to:", {"A": "evaporate rapidly", "B": "filter or seep through", "C": "freeze solid", "D": "expand violently"}, "B", "Percolate berarti meresap atau menyaring perlahan (seep through).", "Vocabulary"),
            ("Why are some mineral chimneys referred to as 'black smokers'?", {"A": "They emit dark plumes of precipitated metallic sulfides.", "B": "They produce volcanic ash and coal soot.", "C": "They burn hydrocarbon crude oil underwater.", "D": "They are composed exclusively of volcanic basalt."}, "A", "Mineral sulfida yang mengendap menciptakan asap hitam pekat ('black smokers').", "Detail"),
            ("What serves as the primary metabolic energy source for vent ecosystems?", {"A": "Decomposed surface phytoplankton.", "B": "Chemoautotrophic oxidation of hydrogen sulfide.", "C": "Sunlight penetrating the twilight zone.", "D": "Mechanical friction from tectonic subduction."}, "B", "Paragraf 2: kemosintesis dari oksidasi hidrogen sulfida oleh bakteri.", "Core Concept"),
            ("The author mentions Europa and Enceladus in paragraph 3 to suggest that:", {"A": "Planetary probes should harvest minerals from Jupiter's moons.", "B": "Hydrothermal vent biology provides insights into potential extraterrestrial life.", "C": "Both moons were once connected to Earth's oceans.", "D": "Spacecraft should avoid ice-covered celestial bodies."}, "B", "Kondisi ekstrem di bumi menjadi analogi potensi kehidupan di samudra bawah es Europa/Enceladus.", "Inference / Analogy"),
            ("In what year were hydrothermal vents first discovered?", {"A": "1877", "B": "1945", "C": "1977", "D": "2001"}, "C", "Paragraf 1: 'First discovered in 1977 near the Galapagos Rift...'", "Factual Scanning"),
            ("The word 'endemic' in paragraph 2 describes organisms that are:", {"A": "universally distributed worldwide", "B": "native and restricted to a specific unique habitat", "C": "highly toxic to human touch", "D": "extinct in modern times"}, "B", "Endemik berarti unik dan terbatas pada habitat tertentu.", "Vocabulary"),
            ("What happens to hydrothermal fluid when it meets cold ocean water?", {"A": "It instantly boils away all ambient seawater.", "B": "Its dissolved minerals precipitate rapidly into crystalline chimneys.", "C": "It creates massive surface tidal waves.", "D": "It dissolves the surrounding basaltic plate entirely."}, "B", "Paragraf 2: 'rapid precipitation causes the minerals to crystallize, constructing towering hollow chimneys...'", "Direct Detail"),
            ("Which of the following organisms is NOT mentioned as part of vent fauna?", {"A": "Giant tube worms", "B": "Blind shrimp", "C": "Vent crabs", "D": "Coral reef sea turtles"}, "D", "Penyu terumbu karang tidak hidup di palung laut dalam hidrotermal.", "Negative Fact"),
            ("The tone of the passage can best be described as:", {"A": "Objective and scientific", "B": "Cynical and mocking", "C": "Nostalgic and emotional", "D": "Argumentative and accusatory"}, "A", "Nada penulisan teks bersifat objektif, akademis, dan informatif.", "Tone and Style")
        ]
    },
    {
        "text": """The Industrial Revolution, originating in Great Britain during the mid-eighteenth century, represented a profound socio-economic transformation characterized by the transition from agrarian craft economies to mechanized factory production. Central to this monumental shift was the development of the coal-powered steam engine, perfected by James Watt, which decoupled industrial manufacturing from stationary watermills and geographic river constraints.

Concurrently, innovations in metallurgical smelting and textile manufacturing—such as the spinning jenny and power loom—exponentially amplified productivity. As factories clustered near urban coal basins and transport nodes, unprecedented demographic migrations remapped national populations. Rural laborers moved en masse to swelling industrial metropolises like Manchester and Birmingham, creating an urban proletariat.

While industrialization unlocked staggering economic output and precipitated technological advancements, it also engendered severe social upheavals. Early factory laborers endured gruelling fourteen-hour workdays in hazardous working conditions, while overcrowded tenements lacked rudimentary sanitation, precipitating recurrent cholera and typhus epidemics. These acute social inequalities subsequently catalyzed the emergence of organized labor unions and progressive public health legislation throughout the nineteenth century.""",
        "items": [
            ("What is the primary topic of the passage?", {"A": "The technological breakthroughs and societal repercussions of the Industrial Revolution.", "B": "The architectural history of nineteenth-century textile mills.", "C": "The biological epidemiology of urban waterborne diseases.", "D": "The foreign trade policies of eighteenth-century monarchs."}, "A", "Teks membahas transformasi teknologi dan dampak sosial-ekonomi Revolusi Industri.", "Main Idea"),
            ("The word 'decoupled' in paragraph 1 is closest in meaning to:", {"A": "separated or disconnected", "B": "mechanically linked", "C": "completely destroyed", "D": "financially penalized"}, "A", "Decoupled berarti memisahkan / melepaskan keterikatan dari batasan sebelumnya.", "Vocabulary"),
            ("Why was James Watt's steam engine particularly significant?", {"A": "It allowed factories to operate away from rivers and water wheels.", "B": "It was made entirely of cheap wood pulp.", "C": "It produced zero soot or carbon emissions.", "D": "It was operated exclusively by water currents."}, "A", "Mesin uap membebaskan industri dari keharusan berada di tepi sungai (watermills).", "Cause and Effect"),
            ("Which cities are cited as examples of burgeoning industrial metropolises?", {"A": "London and Edinburgh", "B": "Manchester and Birmingham", "C": "Liverpool and Dublin", "D": "Oxford and Cambridge"}, "B", "Paragraf 2: 'swelling industrial metropolises like Manchester and Birmingham'.", "Scanning Detail"),
            ("The word 'gruelling' in paragraph 3 is closest in meaning to:", {"A": "extremely demanding and exhausting", "B": "highly remunerative", "C": "creative and entertaining", "D": "intermittent and sporadic"}, "A", "Gruelling berarti sangat melelahkan dan menguras fisik (exhausting).", "Vocabulary"),
            ("What triggered rural laborers to migrate to urban centers?", {"A": "The clustering of mechanized factory jobs in urban coal basins.", "B": "A legal mandate forbidding farming in Great Britain.", "C": "A sudden discovery of gold in metropolitan city centers.", "D": "The collapse of maritime international shipping."}, "A", "Pemusatan pabrik dan lapangan kerja di pusat industri kota memicu urbanisasi massal.", "Cause of Migration"),
            ("According to paragraph 3, poor tenement sanitation resulted in:", {"A": "Rapid drops in real estate property taxes.", "B": "Recurrent outbreaks of cholera and typhus epidemics.", "C": "The immediate closure of all textile mills.", "D": "A surplus of clean municipal spring water."}, "B", "Sanitasi yang buruk memicu epidemi kolera dan tifus.", "Direct Fact"),
            ("It can be inferred from the final sentence that labor unions arose primarily to:", {"A": "Abolish all mechanized machinery in Great Britain.", "B": "Advocate for improved wages and safer workplace conditions.", "C": "Encourage laborers to return to traditional subsistence agriculture.", "D": "Promote the international export of coal products."}, "B", "Serikat pekerja muncul untuk melawan jam kerja berlebih dan kondisi berbahaya.", "Inference"),
            ("Which textile innovation is explicitly mentioned in the passage?", {"A": "The cotton gin and sewing needle", "B": "The spinning jenny and power loom", "C": "The synthetic nylon spinneret", "D": "The electronic computerized embroidery unit"}, "B", "Paragraf 2: 'such as the spinning jenny and power loom'.", "Scanning"),
            ("What was the broader historical outcome of early industrial inequalities?", {"A": "A complete cessation of all European international trade.", "B": "The emergence of labor movements and public health reforms.", "C": "The voluntary abandonment of steam-powered technology.", "D": "The immediate equalization of all global incomes."}, "B", "Ketimpangan memicu reformasi kesehatan masyarakat dan gerakan buruh.", "Summary Detail")
        ]
    },
    {
        "text": """Celestial navigation is the traditional maritime practice of calculating geographical position on Earth through observations of heavenly bodies, notably the Sun, Moon, planets, and fifty-seven navigational stars. For centuries before the advent of electronic global positioning satellites, navigators relied on the marine sextant to measure the precise angular altitude of a celestial body above the sea horizon.

To convert sextant sights into geographic coordinates, mariners utilized spherical trigonometry in conjunction with two essential references: an astronomical nautical almanac and an extremely accurate chronometer. While determining latitude is straightforward—equating directly to the altitude of Polaris in the Northern Hemisphere or solar noon elevation—calculating longitude proved an intractable scientific challenge for centuries. Because the Earth rotates 360 degrees every twenty-four hours, each hour of time difference corresponds precisely to fifteen degrees of longitude.

The longitude problem was ultimately resolved in the eighteenth century by English clockmaker John Harrison, whose marine chronometer (H4) maintained precise Greenwich Mean Time despite violent shipboard motions, temperature extremes, and corrosive salt air. By comparing local solar noon with chronometer time, mariners could at last pinpoint their east-west position on the open ocean.""",
        "items": [
            ("What is the primary topic of the passage?", {"A": "The development of modern satellite telemetry.", "B": "The historical principles and mechanics of celestial navigation.", "C": "The biological orientation of migratory pelagic birds.", "D": "The navigation routes of Viking longships."}, "B", "Teks membahas prinsip sejarah dan metode navigasi astronomi bahari.", "Main Idea"),
            ("The instrument historically used to measure celestial angular altitude is the:", {"A": "barometer", "B": "marine sextant", "C": "magnetic compass", "D": "mercury thermometer"}, "B", "Paragraf 1: pelaut menggunakan 'marine sextant' untuk mengukur sudut elevasi.", "Direct Detail"),
            ("Why was calculating longitude historically more difficult than determining latitude?", {"A": "Longitude requires an exact measurement of time difference from a prime meridian.", "B": "The stars do not shine above lines of longitude.", "C": "The equator has a variable circumference throughout the year.", "D": "The magnetic pole constantly repels chronometers."}, "A", "Penentuan bujur memerlukan penghitungan selisih waktu yang sangat akurat.", "Core Scientific Reason"),
            ("How many degrees of longitude correspond to one hour of Earth rotation?", {"A": "Five degrees", "B": "Ten degrees", "C": "Fifteen degrees", "D": "Twenty-four degrees"}, "C", "Paragraf 2: 360 derajat / 24 jam = 15 derajat per jam.", "Factual Calculation"),
            ("The word 'intractable' in paragraph 2 is closest in meaning to:", {"A": "exceptionally difficult to solve or manage", "B": "easily understandable", "C": "financially profitable", "D": "widely celebrated"}, "A", "Intractable berarti sangat rumit dan sulit dipecahkan (stubbornly difficult).", "Vocabulary"),
            ("Who successfully engineered the first reliable marine chronometer?", {"A": "Isaac Newton", "B": "John Harrison", "C": "James Watt", "D": "Galileo Galilei"}, "B", "Paragraf 3: pembuat jam asal Inggris, John Harrison (H4).", "Historical Fact"),
            ("What environmental challenges did Harrison's chronometer have to overcome?", {"A": "Extreme vacuum and zero gravity.", "B": "Shipboard rocking, temperature swings, and salty humidity.", "C": "Solar flares and cosmic radiation.", "D": "Acid rain in London docks."}, "B", "Paragraf 3: goncangan kapal, variasi suhu, dan udara laut yang korosif.", "Direct Detail"),
            ("In the Northern Hemisphere, latitude equates directly to the altitude of:", {"A": "Polaris (the North Star)", "B": "Sirius", "C": "Betelgeuse", "D": "The Moon at midnight"}, "A", "Paragraf 2: elevasi bintang Polaris setara langsung dengan garis lintang pengamat.", "Scientific Detail"),
            ("The word 'pinpoint' in the final paragraph is closest in meaning to:", {"A": "approximate roughly", "B": "accurately locate or determine", "C": "deliberately distort", "D": "relinquish control of"}, "B", "Pinpoint berarti menentukan lokasi secara presisi dan akurat.", "Vocabulary"),
            ("Which two tools were indispensable alongside the chronometer for calculating longitude?", {"A": "A radar display and gyroscope", "B": "A nautical almanac and a marine sextant", "C": "A digital barometer and telescope", "D": "A sounding lead line and sea anchor"}, "B", "Pengukuran sudut sextant dan almanac astronomi bersama chronometer.", "Synthesis Detail")
        ]
    },
    {
        "text": """Cognitive psychology defines memory not as a static repository of recorded events, but as an active, reconstructive neurobiological system comprising three distinct stages: encoding, storage, and retrieval. Sensory memory briefly registers incoming perceptual stimuli for milliseconds. Information attended to is transferred to short-term or working memory, where it can be maintained through phonological rehearsal for approximately twenty to thirty seconds, with an average cognitive capacity of seven plus-or-minus two discrete informational chunks.

Consolidation transforms transient working memory traces into durable long-term storage, a process mediated by the hippocampal structures and adjacent medial temporal lobes. Synaptic plasticity, notably long-term potentiation (LTP), strengthens intercellular connections across neural networks, establishing structural neurochemical engrams throughout the cerebral cortex.

However, human retrieval is inherently vulnerable to distortion. Rather than replaying an exact video recording, the brain dynamically reconstructs recollections by synthesizing stored fragments with present contextual cues, emotional states, and post-event information. This reconstructive plasticity accounts for cognitive phenomena such as source confusion, confirmation bias, and the creation of false memories under leading questioning.""",
        "items": [
            ("What is the primary objective of the passage?", {"A": "To outline the multi-stage neurobiological architecture and reconstructive nature of memory.", "B": "To argue that human memory is completely unreliable in all daily circumstances.", "C": "To describe surgical procedures for hippocampal removal.", "D": "To promote pharmacological memory-enhancing medications."}, "A", "Teks menguraikan tahapan neurobiologis memori serta sifatnya yang rekonstruktif.", "Main Idea"),
            ("What is the typical temporal duration of unrepeated information in short-term memory?", {"A": "Less than a second", "B": "Twenty to thirty seconds", "C": "Five to six hours", "D": "Indefinitely without decay"}, "B", "Paragraf 1: memori kerja bertahan sekitar 20 hingga 30 detik tanpa pengulangan.", "Direct Detail"),
            ("The brain structure essential for the consolidation of long-term memories is the:", {"A": "hippocampus", "B": "brainstem", "C": "cochlea", "D": "optic chiasm"}, "A", "Paragraf 2: proses konsolidasi dimediasi oleh hipokampus dan lobus temporal.", "Anatomical Fact"),
            ("The word 'transient' in paragraph 2 is closest in meaning to:", {"A": "temporary or short-lived", "B": "permanent and unchangeable", "C": "physically destructive", "D": "mathematically precise"}, "A", "Transient berarti bersifat sementara (temporary / ephemeral).", "Vocabulary"),
            ("What biological process strengthens synaptic connections across neural networks?", {"A": "Cellular apoptosis", "B": "Long-term potentiation (LTP)", "C": "Lactic acid fermentation", "D": "Cranial blood clotting"}, "B", "Paragraf 2: 'notably long-term potentiation (LTP), strengthens intercellular connections...'", "Scientific Detail"),
            ("The capacity of working memory is traditionally estimated at:", {"A": "one or two items", "B": "seven plus-or-minus two informational chunks", "C": "fifty continuous sentences", "D": "unlimited simultaneous streams"}, "B", "Paragraf 1: 'an average cognitive capacity of seven plus-or-minus two discrete informational chunks.'", "Quantitative Detail"),
            ("Why is human memory retrieval susceptible to distortion?", {"A": "Because the brain reconstructs recollections rather than replaying exact recordings.", "B": "Because human neurons die immediately after learning a fact.", "C": "Because memories are stored in liquid form inside ventricles.", "D": "Because the cerebral cortex lacks blood oxygen."}, "A", "Otak merekonstruksi fragmen memori yang dipengaruhi kondisi saat ini dan emosi.", "Core Cognitive Mechanism"),
            ("The word 'vulnerable' in paragraph 3 is closest in meaning to:", {"A": "impervious", "B": "susceptible to harm or alteration", "C": "scientifically proven", "D": "completely resistant"}, "B", "Vulnerable berarti rentan terhadap perubahan atau distorsi (susceptible).", "Vocabulary"),
            ("Which of the following cognitive phenomena is NOT attributed to reconstructive memory?", {"A": "Source confusion", "B": "False memories under leading questioning", "C": "Total genetic mutation of muscular tissue", "D": "Confirmation bias"}, "C", "Mutasi genetik otot tidak berkaitan dengan distorsi kognitif memori.", "Negative Fact"),
            ("According to the passage, the first stage of memory processing is:", {"A": "consolidation", "B": "encoding", "C": "retrieval", "D": "subconscious repression"}, "B", "Paragraf 1: 'three distinct stages: encoding, storage, and retrieval.'", "Sequence / Order")
        ]
    }
]

for p_idx, p_data in enumerate(passages_data):
    for item in p_data["items"]:
        questions.append({
            "id": qid,
            "section": "reading",
            "part": "Part A",
            "questionNumber": qid - 90, # 1 to 50
            "passage": p_data["text"],
            "prompt": item[0],
            "options": item[1],
            "correctAnswer": item[2],
            "explanation": item[3],
            "ruleCategory": item[4]
        })
        qid += 1

print(f"Total Generated Questions: {len(questions)}")
assert len(questions) == 140, f"Expected 140 questions, got {len(questions)}"

# Write to TypeScript file
ts_content = "import { Question } from '../types';\n\nexport const INITIAL_QUESTIONS: Question[] = " + json.dumps(questions, indent=2) + ";\n"
with open("/projects/eprt-cbt/src/data/questionBank.ts", "w") as f:
    f.write(ts_content)

print("Successfully written /projects/eprt-cbt/src/data/questionBank.ts with exact 140 TOEFL ITP questions!")
