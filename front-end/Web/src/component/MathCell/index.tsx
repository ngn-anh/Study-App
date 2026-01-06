import React, { memo } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const mathJaxConfig = {
    loader: { load: ["[tex]/ams", "[tex]/autoload", "[tex]/require"] },
    tex: {
        packages: { "[+]": ["ams", "autoload", "require"] },
        inlineMath: [["\\(", "\\)"]],
        displayMath: [["$$", "$$"]],
    },
};

export const wrapLatex = (
    raw: string,
    { forceBlock = false }: { forceBlock?: boolean } = {}
): string => {
    if (!raw) return "";
    const txt = raw.trim();

    const isInline = txt.startsWith("\\(") && txt.endsWith("\\)");
    const isBlock = txt.startsWith("$$") && txt.endsWith("$$");

    if (isInline || isBlock) return txt;

    return forceBlock ? `$$${txt}$$` : `\\(${txt}\\)`;
};

const MathCell = memo<{ latex: string; forceBlock?: boolean }>(
    ({ latex, forceBlock = false }) => {
        const formatted = wrapLatex(latex, { forceBlock });
        return (
            // <MathJaxContext version={3} >
            <MathJax dynamic>{formatted}</MathJax>
            // </MathJaxContext>
        );
    },
    (prev, next) =>
        prev.latex === next.latex && prev.forceBlock === next.forceBlock
);

export default MathCell;