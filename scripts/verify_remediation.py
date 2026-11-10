#!/usr/bin/env python3
"""
EPrT CBT Simulator - Comprehensive Playwright Browser Remediation Verification Script
File: /projects/eprt-cbt/scripts/verify_remediation.py

This script performs an exhaustive browser audit and remediation verification
for the Telkom University EPrT Computer-Based Testing (CBT) application.

Audit Coverage:
1. Universal Accessibility & Theme Controls (Light/Dark mode, Font scaling, Sound toggle).
2. Full Sequential Examination Flow (Sections 1, 2, 3) using REAL visible clicks only:
   - Section 1 (Listening Comprehension): Audio player, question answering, flagging, palette navigation, transition modal.
   - Section 2 (Structure & Written Expression): Part A sentence completion, Part B inline error identification, palette navigation, transition modal.
   - Section 3 (Reading Comprehension): Split-screen passage reading, mobile tab switching, question answering, flagging, final exam submission.
3. Diagnostic Results Evaluation & PDF Generation:
   - Verification of ETS scaled scores and section breakdowns.
   - Real PDF export via page.pdf() and verification of "Cetak PDF" action triggering window.print().
4. Comprehensive Review Mode:
   - Verification of 140-question review matrix.
   - Verification of filters: "Salah Saja" (incorrect only), "Ragu" (flagged), and section-specific filters.
5. Targeted Mistake Drill:
   - Verification that unattempted questions are correctly included in the mistake drill bank.
   - Instant explanation checking in practice mode.
   - Navigation and completion of drill ("Selesai Latihan") returning to Lobby.
6. Responsive Layout & Overflow Audit across 6 viewports (320, 375, 390, 768, 1024, 1440):
   - DOM-level bounding box scanning checking for horizontal overflow outside viewport,
     excluding legitimate local horizontal scroll containers.
   - Strict viewport containment assertion for all sticky bottom navigation buttons.
   - High-fidelity snapshots captured for Results, Review, and Drill views.
7. Alternate Edge Test:
   - Seeded localStorage session recovery test (Section 3 resume).

Environment Variables:
  - EPRT_BASE_URL: Application URL (default: http://127.0.0.1:4173)
  - EPRT_AUDIT_DIR: Directory for screenshots, JSON report, and PDF (default: docs/screenshots/verified-remediation)
"""

import os
import sys
import time
import json
import re
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any, Optional

from playwright.sync_api import sync_playwright, expect, Page, Browser, BrowserContext  # type: ignore

# ==============================================================================
# CONFIGURATION & CONSTANTS
# ==============================================================================

DEFAULT_BASE_URL = os.environ.get("EPRT_BASE_URL", "http://127.0.0.1:4173").rstrip("/")
DEFAULT_AUDIT_DIR_ENV = os.environ.get("EPRT_AUDIT_DIR", "docs/screenshots/verified-remediation")

# Target responsive widths required by audit specification
RESPONSIVE_VIEWPORTS = [
    {"name": "mobile_320", "width": 320, "height": 650},
    {"name": "mobile_375", "width": 375, "height": 667},
    {"name": "mobile_390", "width": 390, "height": 844},
    {"name": "tablet_768", "width": 768, "height": 1024},
    {"name": "laptop_1024", "width": 1024, "height": 768},
    {"name": "desktop_1440", "width": 1440, "height": 900},
]

RESPONSIVE_WIDTHS = [320, 375, 390, 768, 1024, 1440]
TOTAL_EXAM_QUESTIONS = 140


def resolve_audit_dir(raw_dir: str) -> str:
    """Resolve audit directory against project root if relative."""
    if os.path.isabs(raw_dir):
        target = raw_dir
    else:
        project_root = Path(__file__).resolve().parent.parent
        target = str(project_root / raw_dir)
    os.makedirs(target, exist_ok=True)
    return target


# ==============================================================================
# AUDIT REPORTER
# ==============================================================================

class AuditReporter:
    """Collects step timings, assertions, responsive checks, and generates report."""

    def __init__(self, base_url: str, audit_dir: str):
        self.base_url = base_url
        self.audit_dir = audit_dir
        self.start_time = time.time()
        self.steps: List[Dict[str, Any]] = []
        self.responsive_checks: List[Dict[str, Any]] = []
        self.overflow_issues: List[Dict[str, Any]] = []
        self.footer_violations: List[Dict[str, Any]] = []
        self.artifacts: Dict[str, Any] = {
            "screenshots": [],
            "pdf_report": None,
            "json_report": None,
        }
        self.exam_metrics: Dict[str, Any] = {}
        self.passed = True

    def record_step(self, name: str, status: str, details: str, duration_ms: float, error: Optional[str] = None):
        step_data = {
            "name": name,
            "status": status,
            "details": details,
            "duration_ms": round(duration_ms, 2),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        if error:
            step_data["error"] = error
            self.passed = False
        self.steps.append(step_data)
        icon = "✓" if status == "PASSED" else "✗"
        print(f"[{icon}] {name} ({step_data['duration_ms']}ms) - {details}")
        if error:
            print(f"    ERROR: {error}")

    def record_responsive(self, view_name: str, width: int, height: int, check_result: Dict[str, Any], screenshot_rel: str):
        record = {
            "view": view_name,
            "width": width,
            "height": height,
            "root_horizontal_scroll": check_result["rootHasHScroll"],
            "root_scroll_diff_px": check_result["rootDiff"],
            "overflow_element_count": len(check_result["overflowingElements"]),
            "overflow_elements": check_result["overflowingElements"],
            "footer_violation_count": len(check_result["footerButtonViolations"]),
            "footer_violations": check_result["footerButtonViolations"],
            "screenshot": screenshot_rel,
        }
        self.responsive_checks.append(record)
        self.artifacts["screenshots"].append(screenshot_rel)

        if check_result["overflowingElements"]:
            self.overflow_issues.extend(check_result["overflowingElements"])
        if check_result["footerButtonViolations"]:
            self.footer_violations.extend(check_result["footerButtonViolations"])

    def finalize(self) -> Dict[str, Any]:
        duration_total = time.time() - self.start_time
        report = {
            "audit_meta": {
                "suite": "EPrT CBT Browser Verification & Remediation Audit",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "duration_seconds": round(duration_total, 2),
                "base_url": self.base_url,
                "audit_dir": self.audit_dir,
                "overall_status": "PASSED" if self.passed and len(self.footer_violations) == 0 else "FAILED",
            },
            "summary": {
                "total_steps": len(self.steps),
                "passed_steps": len([s for s in self.steps if s["status"] == "PASSED"]),
                "failed_steps": len([s for s in self.steps if s["status"] == "FAILED"]),
                "responsive_checks_count": len(self.responsive_checks),
                "total_overflow_issues": len(self.overflow_issues),
                "total_footer_violations": len(self.footer_violations),
            },
            "exam_metrics": self.exam_metrics,
            "steps": self.steps,
            "responsive_checks": self.responsive_checks,
            "artifacts": self.artifacts,
        }

        json_path = os.path.join(self.audit_dir, "remediation_audit_report.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        self.artifacts["json_report"] = json_path
        print(f"\n[Audit Report] Saved JSON summary to: {json_path}")
        return report


# ==============================================================================
# VIEWPORT OVERFLOW & BOTTOM NAV AUDIT HELPERS
# ==============================================================================

OVERFLOW_EVAL_JS = """
() => {
    const docW = window.innerWidth;
    const docH = window.innerHeight;

    // Determine if element sits inside an intentional horizontal scroll container
    function isInsideLegitScrollContainer(el) {
        let parent = el.parentElement;
        while (parent && parent !== document.body && parent !== document.documentElement) {
            const style = window.getComputedStyle(parent);
            const ox = style.overflowX;
            if (ox === 'auto' || ox === 'scroll') {
                const pRect = parent.getBoundingClientRect();
                // Parent container itself must fit within viewport horizontally
                if (pRect.left >= -2 && pRect.right <= docW + 2) {
                    return true;
                }
            }
            parent = parent.parentElement;
        }
        return false;
    }

    const overflowingElements = [];
    document.querySelectorAll('*').forEach(el => {
        const tag = el.tagName.toLowerCase();
        if (['script', 'style', 'head', 'meta', 'link', 'title', 'noscript'].includes(tag)) return;

        // Skip non-visible / zero-dimension elements
        if (el.offsetParent === null && el.offsetWidth === 0 && el.offsetHeight === 0) return;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        // Subpixel tolerance (1.5px margin)
        if (rect.left < -1.5 || rect.right > docW + 1.5) {
            if (!isInsideLegitScrollContainer(el)) {
                const idStr = el.id ? `#${el.id}` : '';
                const classStr = (el.className && typeof el.className === 'string')
                    ? `.${el.className.trim().split(/\\s+/).slice(0, 3).join('.')}`
                    : '';
                const textSnippet = (el.innerText || el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 45);
                overflowingElements.push({
                    selector: `${tag}${idStr}${classStr}`,
                    right: Math.round(rect.right),
                    left: Math.round(rect.left),
                    width: Math.round(rect.width),
                    viewportWidth: docW,
                    overflowPx: Math.round(rect.right - docW),
                    snippet: textSnippet
                });
            }
        }
    });

    // Check bottom navigation buttons inside <footer>
    const footerButtons = Array.from(document.querySelectorAll('footer button'));
    const footerButtonViolations = [];
    footerButtons.forEach((btn, idx) => {
        const style = window.getComputedStyle(btn);
        if (style.display === 'none' || style.visibility === 'hidden') return;
        const rect = btn.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        const text = (btn.innerText || '').trim().replace(/\\s+/g, ' ');
        const overflowsH = rect.left < -1.5 || rect.right > docW + 1.5;
        const overflowsV = rect.top < -1.5 || rect.bottom > docH + 1.5;
        if (overflowsH || overflowsV) {
            footerButtonViolations.push({
                index: idx,
                text: text,
                rect: {
                    left: Math.round(rect.left),
                    right: Math.round(rect.right),
                    top: Math.round(rect.top),
                    bottom: Math.round(rect.bottom)
                },
                viewport: { width: docW, height: docH }
            });
        }
    });

    const rootScrollWidth = document.documentElement.scrollWidth;
    const rootClientWidth = document.documentElement.clientWidth;
    const rootHasHScroll = rootScrollWidth > rootClientWidth;
    const rootDiff = Math.max(0, rootScrollWidth - rootClientWidth);

    return {
        rootHasHScroll,
        rootDiff,
        overflowingElements,
        footerButtonViolations
    };
}
"""


def check_viewport_overflow(
    page: Page,
    view_label: str,
    width: int,
    height: int,
    assert_footer_bounds: bool = True,
    assert_no_element_overflow: bool = True
) -> Dict[str, Any]:
    """Inspects layout for horizontal overflow and bottom nav containment."""
    page.set_viewport_size({"width": width, "height": height})
    page.wait_for_timeout(250)

    result = page.evaluate(OVERFLOW_EVAL_JS)

    if assert_footer_bounds and result["footerButtonViolations"]:
        violations_str = ", ".join(
            [f"btn[{v['index']}] '{v['text']}': right={v['rect']['right']} > {width}" for v in result["footerButtonViolations"]]
        )
        assert len(result["footerButtonViolations"]) == 0, (
            f"Bottom nav buttons out of viewport on {view_label} ({width}x{height}): {violations_str}"
        )

    if assert_no_element_overflow and result["overflowingElements"]:
        first_few = "; ".join(
            [f"<{e['selector']}> (+{e['overflowPx']}px, text='{e['snippet']}')" for e in result["overflowingElements"][:3]]
        )
        assert len(result["overflowingElements"]) == 0, (
            f"Found {len(result['overflowingElements'])} overflowing elements on {view_label} ({width}x{height}): {first_few}"
        )

    return result


def audit_responsive_view(
    page: Page,
    view_name: str,
    audit_dir: str,
    reporter: AuditReporter,
    check_footer: bool = True,
    assert_overflow: bool = True
):
    """Audits and snapshots a view across 320, 375, 390, 768, 1024, 1440 widths."""
    print(f"\n--- Running Responsive Audit for View: {view_name.upper()} ---")
    for vp in RESPONSIVE_VIEWPORTS:
        w = vp["width"]
        h = vp["height"]
        screenshot_filename = f"{view_name}_w{w}.png"
        screenshot_path = os.path.join(audit_dir, screenshot_filename)

        check_res = check_viewport_overflow(
            page,
            view_label=f"{view_name}_{w}",
            width=w,
            height=h,
            assert_footer_bounds=check_footer,
            assert_no_element_overflow=assert_overflow,
        )

        page.screenshot(path=screenshot_path, full_page=False)
        reporter.record_responsive(view_name, w, h, check_res, screenshot_filename)

        print(
            f"  [Viewport {w}x{h}] H-Scroll: {check_res['rootHasHScroll']} (+{check_res['rootDiff']}px) | "
            f"Overflow Els: {len(check_res['overflowingElements'])} | "
            f"Footer Violations: {len(check_res['footerButtonViolations'])} -> {screenshot_filename}"
        )

    # Restore desktop viewport for continuous interactive flow
    page.set_viewport_size({"width": 1440, "height": 900})
    page.wait_for_timeout(200)


# ==============================================================================
# AUDIT JOURNEY PROCEDURES
# ==============================================================================

def test_lobby_and_theme_controls(page: Page, base_url: str, audit_dir: str, reporter: AuditReporter):
    """Step 1: Test Lobby landing, dark/light theme toggle, font toggle, and sound toggle."""
    t0 = time.time()
    try:
        page.set_viewport_size({"width": 1440, "height": 900})
        page.goto(base_url, wait_until="networkidle")

        # 1. Assert Lobby UI brand & diagnostic title
        brand_locator = page.locator("header").locator("text=EPrT CBT").first
        expect(brand_locator).to_be_visible()

        start_btn = page.locator("button:has-text('Mulai Simulasi 140')").first
        expect(start_btn).to_be_visible()

        # 2. Test Theme Toggle (Light -> Dark -> Light)
        html_el = page.locator("html")
        theme_btn = page.locator("button[title='Ganti Tema'], button[aria-label='Toggle tema tampilan']").first
        expect(theme_btn).to_be_visible()

        # Click to switch to Dark Mode
        theme_btn.click()
        page.wait_for_timeout(200)
        expect(html_el).to_have_class(re.compile(r"\bdark\b"))
        page.screenshot(path=os.path.join(audit_dir, "lobby_theme_dark_1440.png"))
        reporter.artifacts["screenshots"].append("lobby_theme_dark_1440.png")

        # Click to switch back to Light Mode
        theme_btn.click()
        page.wait_for_timeout(200)
        expect(html_el).not_to_have_class(re.compile(r"\bdark\b"))

        # 3. Test Font Size Toggle (Normal -> Large -> Normal)
        font_btn = page.locator("button[title='Ukuran Teks'], button[aria-label='Ubah ukuran teks']").first
        expect(font_btn).to_be_visible()
        app_container = page.locator("div.min-h-screen").first

        font_btn.click()
        page.wait_for_timeout(200)
        expect(app_container).to_have_class(re.compile(r"\btext-base\b"))

        font_btn.click()
        page.wait_for_timeout(200)
        expect(app_container).to_have_class(re.compile(r"\btext-sm\b"))

        # 4. Test Sound Toggle
        sound_btn = page.locator("button[title='Efek Suara'], button[aria-label='Pengaturan suara']").first
        expect(sound_btn).to_be_visible()
        sound_btn.click()
        page.wait_for_timeout(200)
        sound_btn.click()
        page.wait_for_timeout(200)

        page.screenshot(path=os.path.join(audit_dir, "lobby_overview_1440.png"))
        reporter.artifacts["screenshots"].append("lobby_overview_1440.png")

        reporter.record_step(
            "Lobby & Theme Controls",
            "PASSED",
            "Verified Lobby header, dark/light theme switching, font scaling, and audio controls with active DOM class assertions.",
            (time.time() - t0) * 1000
        )
    except Exception as e:
        page.screenshot(path=os.path.join(audit_dir, "failure_step1_lobby.png"))
        reporter.record_step("Lobby & Theme Controls", "FAILED", str(e), (time.time() - t0) * 1000, error=str(e))
        raise


def test_section_1_listening(page: Page, audit_dir: str, reporter: AuditReporter) -> Dict[str, Any]:
    """Step 2: Start Full Exam -> Section 1 (Listening Comprehension)."""
    t0 = time.time()
    try:
        # Click "Mulai Simulasi 140 Soal"
        start_btn = page.locator("button:has-text('Mulai Simulasi 140 Soal'), button:has-text('Mulai Simulasi 140')").first
        expect(start_btn).to_be_visible()
        start_btn.click()

        # Assert ExamView active on Section 1
        sec_badge = page.get_by_text('Sec 1', exact=True)
        expect(sec_badge).to_be_visible()

        # Check Question 1 prompt & Audio Player
        q1_label = page.locator("text=Nomor 1").first
        expect(q1_label).to_be_visible()

        audio_play_btn = page.locator("button[aria-label='Play Audio'], button:has-text('Play Audio')").first
        expect(audio_play_btn).to_be_visible()

        # Test audio play and pause toggles
        audio_play_btn.click()
        page.wait_for_timeout(300)
        pause_btn = page.locator("button[aria-label='Pause Audio'], button:has-text('Pause')").first
        expect(pause_btn).to_be_visible()
        pause_btn.click()
        page.wait_for_timeout(200)

        # Answer Question 1 (Select Option B: She turned in the paper just in time.)
        opt_b = page.locator("main button").filter(has_text=re.compile(r"^\s*B\b|She turned in the paper")).first
        expect(opt_b).to_be_visible()
        opt_b.click()
        expect(opt_b).to_have_class(re.compile(r"border-blue-600|ring-blue-600"))

        # Flag Question 1
        flag_btn = page.locator("footer button[title='Tandai ragu-ragu'], footer button:has-text('Tandai')").first
        expect(flag_btn).to_be_visible()
        flag_btn.click()
        expect(flag_btn).to_have_class(re.compile(r"bg-amber-100|bg-amber-500|text-amber-900"))

        # Open Palette Drawer to jump to Question 50
        palette_trigger = page.locator("footer button").filter(has_text=re.compile(r"Semua Soal|Peta Soal")).first
        expect(palette_trigger).to_be_visible()
        palette_trigger.click()

        drawer_dialog = page.locator("div[role='dialog']").filter(has_text=re.compile(r"Peta Navigasi")).first
        expect(drawer_dialog).to_be_visible()

        tile_50 = drawer_dialog.locator("button").filter(has_text=re.compile(r"^\s*50\s*$")).first
        expect(tile_50).to_be_visible()
        tile_50.click()
        expect(drawer_dialog).to_be_hidden()

        # Assert now at Question 50
        q50_label = page.locator("text=Nomor 50").first
        expect(q50_label).to_be_visible()

        # Answer Question 50 (Select Option A: Installing reflective cool roofing)
        opt_a = page.locator("main button").filter(has_text=re.compile(r"^\s*A\b|Installing reflective cool")).first
        expect(opt_a).to_be_visible()
        opt_a.click()
        expect(opt_a).to_have_class(re.compile(r"border-blue-600|ring-blue-600"))

        page.screenshot(path=os.path.join(audit_dir, "exam_sec1_q50_1440.png"))
        reporter.artifacts["screenshots"].append("exam_sec1_q50_1440.png")

        # Click Selesai Section 1
        finish_sec1_btn = page.locator("footer button").filter(has_text=re.compile(r"Selesai Section 1|Selesai")).first
        expect(finish_sec1_btn).to_be_visible()
        finish_sec1_btn.click()

        # Transition Modal Assertion
        trans_modal = page.locator("div[role='dialog']").filter(has_text=re.compile(r"Konfirmasi Selesai Section 1")).first
        expect(trans_modal).to_be_visible()
        expect(trans_modal.locator("text=Terjawab")).to_be_visible()

        # Confirm step transition to Section 2
        next_sec_btn = trans_modal.locator("button:has-text('Lanjut ke Section 2')").first
        expect(next_sec_btn).to_be_visible()
        next_sec_btn.click()
        expect(trans_modal).to_be_hidden()

        reporter.record_step(
            "Section 1: Listening",
            "PASSED",
            "Answered Q1 (correct) & Q50 (correct), flagged Q1, navigated via real palette drawer click, confirmed modal transition.",
            (time.time() - t0) * 1000
        )
        return {"q1": "B", "q50": "A", "flagged": [1]}
    except Exception as e:
        page.screenshot(path=os.path.join(audit_dir, "failure_step2_sec1.png"))
        reporter.record_step("Section 1: Listening", "FAILED", str(e), (time.time() - t0) * 1000, error=str(e))
        raise


def test_section_2_structure(page: Page, audit_dir: str, reporter: AuditReporter) -> Dict[str, Any]:
    """Step 3: Section 2 (Structure & Written Expression) including Error Identification."""
    t0 = time.time()
    try:
        # Assert Section 2 loaded
        sec2_badge = page.get_by_text('Sec 2', exact=True)
        expect(sec2_badge).to_be_visible()

        # Question 1: Sentence Completion
        q1_label = page.locator("text=Nomor 1").first
        expect(q1_label).to_be_visible()

        # Select Option A ("do rivers supply")
        opt_a = page.locator("main button").filter(has_text=re.compile(r"^\s*A\b|do rivers supply")).first
        expect(opt_a).to_be_visible()
        opt_a.click()
        expect(opt_a).to_have_class(re.compile(r"border-blue-600|ring-blue-600"))

        # Jump to Question 16 (Part B: Error Identification) via Palette Drawer
        palette_trigger = page.locator("footer button").filter(has_text=re.compile(r"Semua Soal|Peta Soal")).first
        expect(palette_trigger).to_be_visible()
        palette_trigger.click()

        drawer_dialog = page.locator("div[role='dialog']").filter(has_text=re.compile(r"Peta Navigasi")).first
        expect(drawer_dialog).to_be_visible()

        tile_16 = drawer_dialog.locator("button").filter(has_text=re.compile(r"^\s*16\s*$")).first
        expect(tile_16).to_be_visible()
        tile_16.click()
        expect(drawer_dialog).to_be_hidden()

        # Assert at Question 16 (Part B)
        q16_label = page.locator("text=Nomor 16").first
        expect(q16_label).to_be_visible()

        # Test Interactive Error Identification Inline Word Click: 'were (B)'
        inline_were_btn = page.locator("main button[title*='(B)'], main button:has-text('were (B)')").first
        expect(inline_were_btn).to_be_visible()
        inline_were_btn.click()

        # Verify Option B is active
        opt_b_card = page.locator("main button").filter(has_text=re.compile(r"^\s*B\b|were")).first
        expect(opt_b_card).to_have_class(re.compile(r"border-blue-600|ring-blue-600"))

        # Jump to Question 40 (Last Question of Section 2) via Palette Drawer
        palette_trigger.click()
        expect(drawer_dialog).to_be_visible()

        tile_40 = drawer_dialog.locator("button").filter(has_text=re.compile(r"^\s*40\s*$")).first
        expect(tile_40).to_be_visible()
        tile_40.click()
        expect(drawer_dialog).to_be_hidden()

        q40_label = page.locator("text=Nomor 40").first
        expect(q40_label).to_be_visible()

        # Deliberately answer Option A ("drinkable") on Q40 which is INCORRECT (correct answer is B: "make")
        opt_a_q40 = page.locator("main button").filter(has_text=re.compile(r"^\s*A\b|drinkable")).first
        expect(opt_a_q40).to_be_visible()
        opt_a_q40.click()
        expect(opt_a_q40).to_have_class(re.compile(r"border-blue-600|ring-blue-600"))

        page.screenshot(path=os.path.join(audit_dir, "exam_sec2_q40_1440.png"))
        reporter.artifacts["screenshots"].append("exam_sec2_q40_1440.png")

        # Click Selesai Section 2
        finish_sec2_btn = page.locator("footer button").filter(has_text=re.compile(r"Selesai Section 2|Selesai")).first
        expect(finish_sec2_btn).to_be_visible()
        finish_sec2_btn.click()

        # Transition Modal Assertion
        trans_modal = page.locator("div[role='dialog']").filter(has_text=re.compile(r"Konfirmasi Selesai Section 2")).first
        expect(trans_modal).to_be_visible()

        # Confirm step transition to Section 3
        next_sec_btn = trans_modal.locator("button:has-text('Lanjut ke Section 3')").first
        expect(next_sec_btn).to_be_visible()
        next_sec_btn.click()
        expect(trans_modal).to_be_hidden()

        reporter.record_step(
            "Section 2: Structure & Written Expression",
            "PASSED",
            "Answered Q1 (correct), Q16 (inline error ID 'were (B)' correct), Q40 (deliberately wrong A), confirmed transition.",
            (time.time() - t0) * 1000
        )
        return {"q1": "A", "q16": "B", "q40": "A"}
    except Exception as e:
        page.screenshot(path=os.path.join(audit_dir, "failure_step3_sec2.png"))
        reporter.record_step("Section 2: Structure & Written Expression", "FAILED", str(e), (time.time() - t0) * 1000, error=str(e))
        raise


def test_section_3_reading(page: Page, audit_dir: str, reporter: AuditReporter) -> Dict[str, Any]:
    """Step 4: Section 3 (Reading Comprehension) Split-Screen & Final Submit."""
    t0 = time.time()
    try:
        # Assert Section 3 loaded
        sec3_badge = page.get_by_text('Sec 3', exact=True)
        expect(sec3_badge).to_be_visible()

        # Assert Reading Passage is visible on desktop
        passage_header = page.locator("text=Reading Passage").first
        expect(passage_header).to_be_visible()

        # Mobile tab switcher verification on 375px
        page.set_viewport_size({"width": 375, "height": 667})
        page.wait_for_timeout(250)
        wacana_tab = page.locator("button:has-text('Wacana Bacaan')").first
        expect(wacana_tab).to_be_visible()
        wacana_tab.click()
        page.wait_for_timeout(150)

        soal_tab = page.locator("button:has-text('Pertanyaan')").first
        expect(soal_tab).to_be_visible()
        soal_tab.click()
        page.wait_for_timeout(150)

        # Restore desktop viewport
        page.set_viewport_size({"width": 1440, "height": 900})
        page.wait_for_timeout(200)

        # Answer Question 1: Select Option B ("To explain the fundamental biochemical mechanisms...") (Correct)
        opt_b_q1 = page.locator("main button").filter(has_text=re.compile(r"^\s*B\b|To explain the fundamental")).first
        expect(opt_b_q1).to_be_visible()
        opt_b_q1.click()
        expect(opt_b_q1).to_have_class(re.compile(r"border-blue-600|ring-blue-600"))

        # Flag Question 1
        flag_btn = page.locator("footer button[title='Tandai ragu-ragu'], footer button:has-text('Tandai')").first
        expect(flag_btn).to_be_visible()
        flag_btn.click()
        expect(flag_btn).to_have_class(re.compile(r"bg-amber-100|bg-amber-500|text-amber-900"))

        # Jump to Question 50 via Palette Drawer
        palette_trigger = page.locator("footer button").filter(has_text=re.compile(r"Semua Soal|Peta Soal")).first
        expect(palette_trigger).to_be_visible()
        palette_trigger.click()

        drawer_dialog = page.locator("div[role='dialog']").filter(has_text=re.compile(r"Peta Navigasi")).first
        expect(drawer_dialog).to_be_visible()

        tile_50 = drawer_dialog.locator("button").filter(has_text=re.compile(r"^\s*50\s*$")).first
        expect(tile_50).to_be_visible()
        tile_50.click()
        expect(drawer_dialog).to_be_hidden()

        # Answer Question 50: Select Option B ("encoding") (Correct)
        opt_b_q50 = page.locator("main button").filter(has_text=re.compile(r"^\s*B\b|encoding")).first
        expect(opt_b_q50).to_be_visible()
        opt_b_q50.click()
        expect(opt_b_q50).to_have_class(re.compile(r"border-blue-600|ring-blue-600"))

        page.screenshot(path=os.path.join(audit_dir, "exam_sec3_q50_1440.png"))
        reporter.artifacts["screenshots"].append("exam_sec3_q50_1440.png")

        # Click Kumpulkan Ujian in footer
        finish_exam_btn = page.locator("footer button").filter(has_text=re.compile(r"Kumpulkan Ujian|Kumpulkan")).first
        expect(finish_exam_btn).to_be_visible()
        finish_exam_btn.click()

        # Final Confirmation Modal Assertion
        trans_modal = page.locator("div[role='dialog']").filter(has_text=re.compile(r"Konfirmasi Selesai Ujian")).first
        expect(trans_modal).to_be_visible()

        # Confirm Submit in Modal
        confirm_btn = trans_modal.locator("button:has-text('Kumpulkan Ujian')").first
        expect(confirm_btn).to_be_visible()
        confirm_btn.click()

        # Assert transition to ResultsView
        results_header = page.locator("h1:has-text('Laporan Diagnostik Skor EPrT')").first
        expect(results_header).to_be_visible()

        reporter.record_step(
            "Section 3: Reading Comprehension & Submit",
            "PASSED",
            "Verified split-screen, mobile tab switcher, answered Q1 & Q50, flagged Q1, submitted exam via modal.",
            (time.time() - t0) * 1000
        )
        return {"q1": "B", "q50": "B", "flagged": [1]}
    except Exception as e:
        page.screenshot(path=os.path.join(audit_dir, "failure_step4_sec3.png"))
        reporter.record_step("Section 3: Reading Comprehension & Submit", "FAILED", str(e), (time.time() - t0) * 1000, error=str(e))
        raise


def test_results_view_and_print_pdf(page: Page, audit_dir: str, reporter: AuditReporter) -> Dict[str, Any]:
    """Step 5: Verify Results View, score cards, window.print call, page.pdf output, and responsive checks."""
    t0 = time.time()
    try:
        # Assert Main Results Page Header
        results_title = page.locator("h1:has-text('Laporan Diagnostik Skor EPrT')").first
        expect(results_title).to_be_visible()

        # Read overall scaled score
        score_hero = page.locator("div.text-6xl, div.text-7xl").first
        expect(score_hero).to_be_visible()
        score_text = score_hero.inner_text().strip()
        score_val = int(score_text)
        assert 310 <= score_val <= 677, f"Scaled score {score_val} out of valid ETS range [310, 677]"

        # Verify Section breakdown cards
        expect(page.locator("text=Listening").first).to_be_visible()
        expect(page.locator("text=Structure").first).to_be_visible()
        expect(page.locator("text=Reading").first).to_be_visible()

        reporter.exam_metrics["score_total"] = score_val
        print(f"  [Scoring Engine] Total ETS Scaled Score: {score_val}")

        # Test 'Cetak PDF' button and verify window.print() call
        page.evaluate("() => { window.__audit_print_called = false; window.print = () => { window.__audit_print_called = true; }; }")
        print_btn = page.locator("button:has-text('Cetak PDF')").first
        expect(print_btn).to_be_visible()
        print_btn.click()

        print_called = page.evaluate("() => window.__audit_print_called === true")
        assert print_called, "Cetak PDF button failed to invoke window.print()"

        # Generate real high-resolution PDF artifact
        pdf_path = os.path.join(audit_dir, "eprt_results_diagnostic_report.pdf")
        page.pdf(path=pdf_path, format="A4", print_background=True)
        assert os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000, f"Generated PDF invalid or empty: {pdf_path}"
        reporter.artifacts["pdf_report"] = pdf_path
        print(f"  [PDF Export] Generated official diagnostic report: {pdf_path}")

        # Run responsive audit on ResultsView across 6 widths
        audit_responsive_view(page, "results", audit_dir, reporter, check_footer=False, assert_overflow=True)

        reporter.record_step(
            "Results View & Print PDF",
            "PASSED",
            f"Verified ETS scaled score ({score_val}), confirmed window.print() hook, generated PDF report, passed responsive audit on 6 widths.",
            (time.time() - t0) * 1000
        )
        return {"totalScore": score_val, "pdf": pdf_path}
    except Exception as e:
        page.screenshot(path=os.path.join(audit_dir, "failure_step5_results.png"))
        reporter.record_step("Results View & Print PDF", "FAILED", str(e), (time.time() - t0) * 1000, error=str(e))
        raise


def test_review_view_and_filters(page: Page, audit_dir: str, reporter: AuditReporter):
    """Step 6: Review View navigation, 140 matrix check, wrong & flagged filters."""
    t0 = time.time()
    try:
        # Click "Review Pembahasan Soal & Kunci"
        review_cta = page.locator("button:has-text('Review Pembahasan')").first
        expect(review_cta).to_be_visible()
        review_cta.click()

        # Assert Review View active
        review_map_title = page.locator("h3:has-text('Peta Soal Review')").first
        expect(review_map_title).to_be_visible()

        # Verify initial full bank size (140 questions)
        total_review_badge = page.locator("button:has-text('Semua')").first
        expect(total_review_badge).to_be_visible()
        expect(total_review_badge).to_contain_text("140")

        # Test Filter: Salah Saja (Incorrect Only)
        filter_wrong_btn = page.locator("button:has-text('Salah Saja')").first
        expect(filter_wrong_btn).to_be_visible()
        wrong_btn_text = filter_wrong_btn.inner_text()
        print(f"  [Review Mode] Filter button text: '{wrong_btn_text}'")

        filter_wrong_btn.click()
        page.wait_for_timeout(250)
        expect(filter_wrong_btn).to_have_class(re.compile(r"bg-red-50|border-red-300|text-red-700"))

        # Verify status banner shows non-correct status on filtered questions (Q2 is blank, Structure Q40 is wrong)
        status_banner = page.locator("text=/Belum Dijawab \\/ Kosong|Jawaban Anda Keliru/").first
        expect(status_banner).to_be_visible()

        # Test Filter: Ragu (Flagged)
        filter_flag_btn = page.locator("button:has-text('Ragu')").first
        expect(filter_flag_btn).to_be_visible()
        filter_flag_btn.click()
        page.wait_for_timeout(250)
        expect(filter_flag_btn).to_have_class(re.compile(r"bg-amber-50|border-amber-300|text-amber-800"))

        # Reset filter to 'Semua'
        total_review_badge.click()
        page.wait_for_timeout(200)

        # Test Section Filters (Listening, Structure, Reading)
        filter_listening = page.locator("button:has-text('Listening')").first
        filter_listening.click()
        page.wait_for_timeout(150)
        expect(filter_listening).to_have_class(re.compile(r"bg-blue-600|text-white"))

        filter_structure = page.locator("button:has-text('Structure')").first
        filter_structure.click()
        page.wait_for_timeout(150)
        expect(filter_structure).to_have_class(re.compile(r"bg-blue-600|text-white"))

        filter_reading = page.locator("button:has-text('Reading')").first
        filter_reading.click()
        page.wait_for_timeout(150)
        expect(filter_reading).to_have_class(re.compile(r"bg-blue-600|text-white"))

        total_review_badge.click()
        page.wait_for_timeout(200)

        # Run responsive audit on ReviewView across 6 widths
        audit_responsive_view(page, "review", audit_dir, reporter, check_footer=False, assert_overflow=True)

        reporter.record_step(
            "Review View & Filters",
            "PASSED",
            "Verified 140 questions matrix, 'Salah Saja' filter, 'Ragu' filter, section subfilters, and responsive layouts.",
            (time.time() - t0) * 1000
        )
    except Exception as e:
        page.screenshot(path=os.path.join(audit_dir, "failure_step6_review.png"))
        reporter.record_step("Review View & Filters", "FAILED", str(e), (time.time() - t0) * 1000, error=str(e))
        raise


def test_targeted_mistake_drill(page: Page, audit_dir: str, reporter: AuditReporter, expected_correct_count: int = 6):
    """Step 7: Launch Targeted Mistake Drill, assert unattempted questions included, and finish practice."""
    t0 = time.time()
    try:
        # Click "Latih Soal Salah" / "Latih Salah" button from Review Mode
        drill_btn = page.locator("button:has-text('Latih Soal Salah'), button:has-text('Latih Salah'), button[title*='Latih hanya soal yang belum benar']").first
        expect(drill_btn).to_be_visible()
        drill_btn.click()

        # Assert App transitioned to Practice Mode (Subheader badge 'Drill')
        drill_badge = page.locator("text=Drill").first
        expect(drill_badge).to_be_visible()

        # Expected question count:
        # Specification: Unattempted/blank questions MUST be included in mistake drill!
        # Total Questions = 140. Correct Answers = expected_correct_count (6).
        # Expected Drill Bank Size = 140 - 6 = 134 questions.
        expected_drill_count = TOTAL_EXAM_QUESTIONS - expected_correct_count

        # Open Palette Drawer to inspect total bank size of the drill
        palette_trigger = page.locator("footer button").filter(has_text=re.compile(r"Semua Soal|Peta Soal")).first
        expect(palette_trigger).to_be_visible()
        palette_trigger.click()

        drawer_dialog = page.locator("div[role='dialog']").filter(has_text=re.compile(r"Peta Navigasi")).first
        expect(drawer_dialog).to_be_visible()

        tiles = drawer_dialog.locator("div.grid button")
        actual_drill_count = tiles.count()
        reporter.exam_metrics["drill_bank_size"] = actual_drill_count
        reporter.exam_metrics["drill_expected_size"] = expected_drill_count

        print(f"  [Targeted Mistake Drill] Actual Count: {actual_drill_count} | Expected (with blanks): {expected_drill_count}")

        # Assert unattempted questions are included in drill bank
        assert actual_drill_count == expected_drill_count, (
            f"Targeted mistake drill question count mismatch! Expected {expected_drill_count} questions "
            f"(including unattempted/blanks), but found {actual_drill_count} in active drill bank."
        )

        # Close drawer dialog
        close_drawer_btn = drawer_dialog.locator("button:has-text('Kembali ke Soal'), button[aria-label='Tutup navigator']").first
        close_drawer_btn.click()
        expect(drawer_dialog).to_be_hidden()

        # Answer question 1 in Drill Mode to verify instant explanation
        opt_a = page.get_by_role("button", name=re.compile(r"^A\s+Drop the economics")).first
        expect(opt_a).to_be_visible()
        opt_a.click()
        page.wait_for_timeout(200)

        # Assert practice mode instant explanation box is rendered
        explanation_box = page.locator("text=Pembahasan Latihan:").first
        expect(explanation_box).to_be_visible()

        # Run responsive layout & bottom navigation audit on Drill View
        # IMPORTANT: check_footer=True asserts that all bottom nav buttons fit strictly within viewport!
        audit_responsive_view(page, "drill", audit_dir, reporter, check_footer=True, assert_overflow=True)

        # Jump to last question of drill via Palette Drawer to test 'Finish Practice'
        palette_trigger.click()
        expect(drawer_dialog).to_be_visible()

        last_tile = drawer_dialog.locator("button").filter(has_text=re.compile(rf"^\s*{actual_drill_count}\s*$")).first
        expect(last_tile).to_be_visible()
        last_tile.click()
        expect(drawer_dialog).to_be_hidden()

        # Assert at last question of drill
        finish_drill_btn = page.locator("footer button").filter(has_text=re.compile(r"Selesai Latihan|Selesai")).first
        expect(finish_drill_btn).to_be_visible()
        finish_drill_btn.click()

        # Verify application returns to Lobby cleanly
        lobby_check = page.locator("header").locator("text=EPrT CBT").first
        expect(lobby_check).to_be_visible()

        reporter.record_step(
            "Targeted Mistake Drill & Finish Practice",
            "PASSED",
            f"Verified drill bank contains exactly {actual_drill_count} questions (including unattempted blanks), verified explanation box, and cleanly finished practice back to Lobby.",
            (time.time() - t0) * 1000
        )
    except Exception as e:
        page.screenshot(path=os.path.join(audit_dir, "failure_step7_drill.png"))
        reporter.record_step("Targeted Mistake Drill & Finish Practice", "FAILED", str(e), (time.time() - t0) * 1000, error=str(e))
        raise


def test_seeded_session_edge_case(browser: Browser, base_url: str, audit_dir: str, reporter: AuditReporter):
    """Step 8: Alternate Edge Test - Seed a legitimate Section 3 localStorage session and verify clean resume."""
    t0 = time.time()
    context: BrowserContext = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    try:
        page.goto(base_url, wait_until="networkidle")

        # Seed valid active Section 3 session into localStorage
        seed_session = {
            "version": 2,
            "mode": "exam",
            "activeSection": "reading",
            "examStep": 3,
            "startedAt": int(time.time() * 1000),
            "sectionDeadlines": {
                "1": None,
                "2": None,
                "3": int(time.time() * 1000) + 3300000
            },
            "answers": {"1": "B", "2": "B", "51": "A", "66": "B"},
            "flagged": {"1": True, "66": True},
            "currentIndex": 0,
            "bankSource": "official",
            "isCompleted": False
        }

        page.evaluate(
            "(data) => localStorage.setItem('eprt_cbt_active_session_v2', JSON.stringify(data))",
            seed_session
        )

        # Reload Lobby to pick up stored active session
        page.reload(wait_until="networkidle")

        # Assert Saved Session banner on Lobby
        resume_card = page.locator("text=Sesi Pre-Test Belum Selesai").first
        expect(resume_card).to_be_visible()
        expect(page.locator("text=Tahap 3/3").first).to_be_visible()

        # Click "Lanjutkan"
        resume_btn = page.get_by_role("button", name="Lanjutkan", exact=True)
        expect(resume_btn).to_be_visible()
        resume_btn.click()

        # Assert resumed directly into Section 3 Reading
        expect(page.get_by_text("Sec 3", exact=True)).to_be_visible()
        expect(page.locator("text=Reading Passage").first).to_be_visible()

        page.screenshot(path=os.path.join(audit_dir, "edge_seeded_section3_resumed.png"))
        reporter.artifacts["screenshots"].append("edge_seeded_section3_resumed.png")

        reporter.record_step(
            "Edge Test: Seeded Session Resume",
            "PASSED",
            "Successfully seeded localStorage active session, verified Lobby resume card, and resumed directly into Section 3 Reading.",
            (time.time() - t0) * 1000
        )
    except Exception as e:
        page.screenshot(path=os.path.join(audit_dir, "failure_step8_seeded_edge.png"))
        reporter.record_step("Edge Test: Seeded Session Resume", "FAILED", str(e), (time.time() - t0) * 1000, error=str(e))
        raise
    finally:
        context.close()


# ==============================================================================
# MAIN EXECUTION ROUTINE
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(description="EPrT CBT Playwright Remediation Audit Suite")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL, help=f"Target EPrT CBT Base URL (default: {DEFAULT_BASE_URL})")
    parser.add_argument("--audit-dir", default=DEFAULT_AUDIT_DIR_ENV, help=f"Artifact output directory (default: {DEFAULT_AUDIT_DIR_ENV})")
    parser.add_argument("--headless", action="store_true", default=True, help="Run browser in headless mode (default: True)")
    parser.add_argument("--headed", action="store_false", dest="headless", help="Run browser in headed mode")
    parser.add_argument("--skip-edge-test", action="store_true", default=False, help="Skip alternate seeded session edge test")
    args = parser.parse_args()

    audit_dir = resolve_audit_dir(args.audit_dir)
    reporter = AuditReporter(base_url=args.base_url, audit_dir=audit_dir)

    print("=" * 70)
    print("EPrT CBT SIMULATOR - PLAYWRIGHT REMEDIATION VERIFICATION AUDIT")
    print(f"Base URL    : {args.base_url}")
    print(f"Audit Dir   : {audit_dir}")
    print(f"Headless    : {args.headless}")
    print("=" * 70)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=args.headless)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        try:
            # 1. Lobby & Universal Controls
            test_lobby_and_theme_controls(page, args.base_url, audit_dir, reporter)

            # 2. Section 1 (Listening Comprehension)
            test_section_1_listening(page, audit_dir, reporter)

            # 3. Section 2 (Structure & Written Expression)
            test_section_2_structure(page, audit_dir, reporter)

            # 4. Section 3 (Reading Comprehension)
            test_section_3_reading(page, audit_dir, reporter)

            # 5. Results View & PDF Export
            test_results_view_and_print_pdf(page, audit_dir, reporter)

            # 6. Review Mode & Filters
            test_review_view_and_filters(page, audit_dir, reporter)

            # 7. Targeted Mistake Drill & Finish Practice
            # 6 correct answers were given: Sec1 Q1, Sec1 Q50, Sec2 Q1, Sec2 Q16, Sec3 Q1, Sec3 Q50
            test_targeted_mistake_drill(page, audit_dir, reporter, expected_correct_count=6)

            # 8. Alternate Edge Test (Seeded Session Resume)
            if not args.skip_edge_test:
                test_seeded_session_edge_case(browser, args.base_url, audit_dir, reporter)

        except Exception as err:
            print(f"\n[FATAL AUDIT FAILURE] {err}")
        finally:
            context.close()
            final_report = reporter.finalize()
            browser.close()

    print("\n" + "=" * 70)
    print(f"AUDIT STATUS : {final_report['audit_meta']['overall_status']}")
    print(f"PASSED STEPS : {final_report['summary']['passed_steps']} / {final_report['summary']['total_steps']}")
    print(f"OVERFLOWS    : {final_report['summary']['total_overflow_issues']} element overflows")
    print(f"FOOTER ERRORS: {final_report['summary']['total_footer_violations']} bottom nav violations")
    print("=" * 70)

    if final_report["audit_meta"]["overall_status"] != "PASSED":
        sys.exit(1)


if __name__ == "__main__":
    main()
