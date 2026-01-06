// src/utils/latex.ts
/**
 * 1️⃣ Loại bỏ escape thừa (\\ → \)
 * 2️⃣ Đảm bảo chuỗi có delimiter (\(...\) hoặc $$...$$)
 */

export const mathJaxConfig = {
    loader: { load: ["[tex]/ams", "[tex]/autoload", "[tex]/require"] },
    tex: {
        // thêm các package cần thiết – đặc biệt là unicode và textmacros
        packages: {
            "[+]": ["base", "ams", "autoload", "newcommand", "unicode", "textmacros"],
        },
        inlineMath: [["\\(", "\\)"]],
        displayMath: [["$$", "$$"]],
        unicode: {
            fonts: "STIXGeneral, TeX", // dùng font có glyph mở rộng
        },
    },
};

export const formatLatex = (
    raw: string,
    { forceBlock = false }: { forceBlock?: boolean } = {}
): string => {
    if (!raw) return "";

    // Bước 1: un‑escape (\\ → \)
    const unescaped = raw.replace(/\\\\/g, "\\");

    const txt = unescaped.trim();
    const hasInline = txt.startsWith("\\(") && txt.endsWith("\\)");
    const hasBlock = txt.startsWith("$$") && txt.endsWith("$$");

    if (hasInline || hasBlock) return txt;

    // Bước 2: bọc delimiter
    return forceBlock ? `$$${txt}$$` : `\\(${txt}\\)`;
};