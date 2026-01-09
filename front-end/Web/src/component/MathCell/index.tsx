import React, { memo } from "react";
import { MathJax } from "better-react-mathjax";

const mathJaxConfig = {
    loader: { load: ["[tex]/ams", "[tex]/autoload", "[tex]/require"] },
    tex: {
        packages: { "[+]": ["ams", "autoload", "require"] },
        inlineMath: [["\\(", "\\)"]],
        displayMath: [["$$", "$$"]],
    },
};

// Tự bọc LaTeX nếu đã có delimiter, nếu không thì giữ nguyên
export const wrapLatex = (
    raw: string,
    { forceBlock = false }: { forceBlock?: boolean } = {}
): string => {
    if (!raw) return "";
    const txt = raw.trim();

    const isInline = txt.startsWith("\\(") && txt.endsWith("\\)");
    const isBlock = txt.startsWith("$$") && txt.endsWith("$$");

    // Nếu đã có delimiter thì trả nguyên vẹn để MathJax render
    if (isInline || isBlock) return txt;

    // Không tự bọc toàn bộ chuỗi vào chế độ toán học nữa.
    // Điều này giúp các đoạn văn bản thường (Vietnamese) giữ nguyên khoảng trắng.
    // Chỉ render toán học khi dữ liệu đã có delimiter sẵn (\(...\) hoặc $$...$$).
    return txt;
};

// Heuristic: chuyển chuỗi text pha lẫn công thức sang LaTeX an toàn
// - Từ thuần chữ (tiếng Việt) -> \text{...}
// - Biểu thức chữ+chỉ số như x2 -> x^{2}
// - Giữ nguyên toán tử, hàm sin/cos,...
const autoLaTeXize = (raw: string) => {
    if (!raw) return "";
    let s = raw.replace(/\s+/g, " ").trim();

    // Chuyển biến kèm số mũ: x2, y10 -> x^{2}, y^{10}
    s = s.replace(/(\p{L})(\d+)/gu, "$1^{" + "$2" + "}");

    // Tách thành token giữ nguyên khoảng trắng
    const tokenRe = /(\s+|\\[a-zA-Z]+|[\p{L}]+|\d+|[^\s])/gu;
    const tokens = s.match(tokenRe) || [s];

    const out: string[] = [];
    let textBuf = "";

    const isPlainToken = (t: string) => /^(\s+|[\p{L}]+|[.,;:!?…"'“”‘’])$/u.test(t);
    const escapeText = (t: string) => t.replace(/[{}]/g, "\\$&");

    const flushText = () => {
        if (textBuf) {
            // trim không làm mất khoảng trắng giữa các nhóm vì đã gom trong textBuf
            out.push(`\\text{${escapeText(textBuf)}}`);
            textBuf = "";
        }
    };

    for (const t of tokens) {
        if (isPlainToken(t)) {
            textBuf += t; // giữ nguyên cả khoảng trắng trong nhóm text
        } else {
            flushText();
            out.push(t);
        }
    }
    flushText();

    // Nối lại: không thêm khoảng trắng ngoài ý muốn vì textBuf đã chứa spaces gốc
    return out.join("");
};

const MathCell = memo<{ latex: string; forceBlock?: boolean }>(
    ({ latex, forceBlock = false }) => {
        const txt = (latex ?? "").toString();
        const alreadyDelimited =
            (txt.startsWith("$") && txt.endsWith("$")) ||
            (txt.startsWith("\\(") && txt.endsWith("\\)")) ||
            (txt.startsWith("$$") && txt.endsWith("$$"));

        const looksLatex = /\\text\{|\\frac|\\sqrt|\\left|\\right|\\[a-zA-Z]+\{/.test(txt);

        // Gợi ý có công thức nếu có ký tự toán hoặc dấu mũ, số đi kèm chữ, hoặc \command
        const hasMathHints = /[\^_*/=+()\d]|\\[a-zA-Z]+/.test(txt);

        if (alreadyDelimited) {
            return <MathJax dynamic>{txt}</MathJax>;
        }

        if (looksLatex) {
            // Nếu chưa có delimiter, bọc một lần để MathJax parse; tránh double-wrap khi đã có
            const wrapped = alreadyDelimited ? txt : (forceBlock ? `$$${txt}$$` : `\\(${txt}\\)`);
            return <MathJax dynamic>{wrapped}</MathJax>;
        }

        if (hasMathHints) {
            const latexized = autoLaTeXize(txt);
            const wrapped = forceBlock ? `$$${latexized}$$` : `\\(${latexized}\\)`;
            return <MathJax dynamic>{wrapped}</MathJax>;
        }

        // Không có công thức -> render text thường, giữ nguyên khoảng trắng
        return <span>{txt}</span>;
    },
    (prev, next) =>
        prev.latex === next.latex && prev.forceBlock === next.forceBlock
);

export default MathCell;