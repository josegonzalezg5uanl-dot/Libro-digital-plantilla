
from __future__ import annotations

import re
import shutil
from pathlib import Path


ROOT = Path.cwd()


def backup(path: Path) -> None:
    backup_path = path.with_suffix(path.suffix + ".bak")
    if not backup_path.exists():
        shutil.copy2(path, backup_path)


def write_if_changed(path: Path, new_text: str) -> bool:
    old_text = path.read_text(encoding="utf-8")
    if new_text == old_text:
        return False
    backup(path)
    path.write_text(new_text, encoding="utf-8")
    return True


def clean_index_html(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")

    patterns = [
        r'\n\s*<a href="chapter-2\.html" class="nav-link" data-page="ch2">.*?</a>',
        r'\n\s*<a href="chapter-3\.html" class="nav-link" data-page="ch3">.*?</a>',
        r'\n\s*<a href="chapter-4\.html" class="nav-link" data-page="ch4">.*?</a>',
        r'\n\s*<a href="chapter-5\.html" class="nav-link" data-page="ch5">.*?</a>',
        r'\n\s*<a href="chapter-6\.html" class="nav-link" data-page="ch6">.*?</a>',
        r'\n\s*<a href="chapter-6\.html" class="btn-secondary">.*?</a>',
        r'\n\s*<a href="chapter-2\.html" class="card">.*?</a>',
        r'\n\s*<a href="chapter-3\.html" class="card">.*?</a>',
        r'\n\s*<a href="chapter-4\.html" class="card">.*?</a>',
        r'\n\s*<a href="chapter-5\.html" class="card">.*?</a>',
        r'\n\s*<a href="chapter-6\.html" class="card">.*?</a>',
    ]

    for pattern in patterns:
        text = re.sub(pattern, "", text, flags=re.DOTALL)

    return write_if_changed(path, text)


def clean_chapter_1_html(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")

    patterns = [
        r'\n\s*<li class="nav-item"><a href="chapter-2\.html" class="nav-link">.*?</a></li>',
        r'\n\s*<li class="nav-item"><a href="chapter-3\.html" class="nav-link">.*?</a></li>',
        r'\n\s*<li class="nav-item"><a href="chapter-4\.html" class="nav-link">.*?</a></li>',
        r'\n\s*<li class="nav-item"><a href="chapter-5\.html" class="nav-link">.*?</a></li>',
        r'\n\s*<li class="nav-item"><a href="chapter-6\.html" class="nav-link">.*?</a></li>',
        r'\n\s*<a href="chapter-2\.html" class="ch-nav-btn">.*?</a>',
    ]

    for pattern in patterns:
        text = re.sub(pattern, "", text, flags=re.DOTALL)

    return write_if_changed(path, text)


def clean_quiz_1_html(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")

    patterns = [
        r'\n\s*<li class="nav-item"><a href="chapter-2\.html" class="nav-link">.*?</a></li>',
        r'\n\s*<li class="nav-item"><a href="chapter-3\.html" class="nav-link">.*?</a></li>',
        r'\n\s*<li class="nav-item"><a href="chapter-4\.html" class="nav-link">.*?</a></li>',
        r'\n\s*<li class="nav-item"><a href="chapter-5\.html" class="nav-link">.*?</a></li>',
        r'\n\s*<li class="nav-item"><a href="chapter-6\.html" class="nav-link">.*?</a></li>',
        r'\n\s*<a href="chapter-2\.html" class="btn-back" style="border-color:#22c55e;color:#22c55e">.*?</a>',
    ]

    for pattern in patterns:
        text = re.sub(pattern, "", text, flags=re.DOTALL)

    return write_if_changed(path, text)


def clean_main_js(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")

    patterns = [
        r"\n\s*\{ title: 'Cap\. 2 .*?url: 'chapter-2\.html',.*?\},?",
        r"\n\s*\{ title: 'Cap\. 3 .*?url: 'chapter-3\.html',.*?\},?",
        r"\n\s*\{ title: 'Cap\. 4 .*?url: 'chapter-4\.html',.*?\},?",
        r"\n\s*\{ title: 'Cap\. 5 .*?url: 'chapter-5\.html',.*?\},?",
        r"\n\s*\{ title: 'Cap\. 6 .*?url: 'chapter-6\.html',.*?\},?",
    ]

    for pattern in patterns:
        text = re.sub(pattern, "", text, flags=re.DOTALL)

    return write_if_changed(path, text)


def clean_quiz_config_1_js(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r"var QUIZ_LinkSiguiente = 'chapter-2\.html';",
        "var QUIZ_LinkSiguiente = 'index.html';",
        text,
    )
    return write_if_changed(path, text)


def main() -> None:
    targets = {
        "index.html": clean_index_html,
        "chapter-1.html": clean_chapter_1_html,
        "quiz-1.html": clean_quiz_1_html,
        "js/main.js": clean_main_js,
        "js/quiz-config-1.js": clean_quiz_config_1_js,
    }

    changed = []

    for relative_path, handler in targets.items():
        path = ROOT / relative_path
        if not path.exists():
            print(f"[SKIP] No existe: {relative_path}")
            continue

        if handler(path):
            changed.append(relative_path)
            print(f"[OK] Limpiado: {relative_path}")
        else:
            print(f"[SKIP] Sin cambios: {relative_path}")

    print("\nResumen:")
    if changed:
        for item in changed:
            print(f" - {item}")
    else:
        print(" - No hubo cambios")


if __name__ == "__main__":
    main()
