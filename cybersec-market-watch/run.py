"""主流程:收集 → 分析 → 產出報告。

用法:
    python run.py            # 完整流程
    python run.py --offline  # 跳過網路收集,僅用既有資料重新分析與產報告
"""
import sys

sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent / "src"))

from analyze import analyze  # noqa: E402
from collect import collect  # noqa: E402
from report import generate  # noqa: E402


def main() -> None:
    offline = "--offline" in sys.argv
    if offline:
        print("[run] offline 模式:跳過網路收集,僅合併種子資料")
    collect(offline=offline)
    analyze()
    generate()


if __name__ == "__main__":
    main()
