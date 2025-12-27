import { useEffect, useRef } from "react";
import { MathfieldElement } from "mathlive";
import "mathlive";
import { MathJax } from "better-react-mathjax";

interface Props {
    value: string;
    onChange: (latex: string) => void;
}

const MathInput = ({ value, onChange }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mathfieldRef = useRef<MathfieldElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const mf = new MathfieldElement();

        mf.defaultMode = "math";
        mf.smartMode = true;

        // Tắt bàn phím ảo tự động
        mf.setAttribute("virtual-keyboard-mode", "manual");

        mf.value = value;
        mf.style.width = "100%";
        mf.style.minHeight = "80px";
        mf.style.fontSize = "18px";
        mf.style.padding = "16px";
        mf.style.border = "2px solid #e2e8f0";
        mf.style.borderRadius = "8px";
        mf.style.backgroundColor = "#ffffff";
        mf.style.fontFamily = "'Cambria Math', 'Times New Roman', serif";
        mf.style.transition = "all 0.3s ease";

        mf.addEventListener("focus", () => {
            mf.style.borderColor = "#3b82f6";
            mf.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
        });

        mf.addEventListener("blur", () => {
            mf.style.borderColor = "#e2e8f0";
            mf.style.boxShadow = "none";
        });

        mf.addEventListener("input", () => {
            onChange(mf.value);
        });

        containerRef.current.appendChild(mf);
        mathfieldRef.current = mf;

        return () => {
            mf.remove();
        };
    }, []);

    useEffect(() => {
        if (mathfieldRef.current && mathfieldRef.current.value !== value) {
            mathfieldRef.current.value = value;
        }
    }, [value]);

    // Hàm chèn ký hiệu đơn giản
    const insertSymbol = (latex: string) => {
        if (mathfieldRef.current) {
            mathfieldRef.current.insert(latex, { focus: true });
            mathfieldRef.current.focus();
        }
    };

    // Các ký hiệu toán học được tổ chức theo nhóm
    const symbolGroups = [
        {
            name: "Cấu trúc",
            symbols: [
                { label: "a/b", latex: "\\frac{}{}", title: "Phân số" },
                { label: "√x", latex: "\\sqrt{}", title: "Căn bậc 2" },
                { label: "ⁿ√x", latex: "\\sqrt[]{}", title: "Căn bậc n" },
                { label: "x²", latex: "^{}", title: "Chỉ số trên" },
                { label: "x₂", latex: "_{}", title: "Chỉ số dưới" },
            ]
        },
        {
            name: "Chữ Hy Lạp",
            symbols: [
                { label: "π", latex: "\\pi", title: "Pi" },
                { label: "α", latex: "\\alpha", title: "Alpha" },
                { label: "β", latex: "\\beta", title: "Beta" },
                { label: "θ", latex: "\\theta", title: "Theta" },
                { label: "λ", latex: "\\lambda", title: "Lambda" },
                { label: "∞", latex: "\\infty", title: "Vô cực" },
            ]
        },
        {
            name: "Toán tử",
            symbols: [
                { label: "∫", latex: "\\int_{}^{}", title: "Tích phân" },
                { label: "Σ", latex: "\\sum_{}^{}", title: "Tổng" },
                { label: "∏", latex: "\\prod_{}^{}", title: "Tích" },
                { label: "≠", latex: "\\neq", title: "Khác" },
                { label: "≤", latex: "\\leq", title: "Nhỏ hơn hoặc bằng" },
                { label: "≥", latex: "\\geq", title: "Lớn hơn hoặc bằng" },
                { label: "±", latex: "\\pm", title: "Cộng trừ" },
                { label: "×", latex: "\\times", title: "Nhân" },
            ]
        }
    ];

    return (
        <div className="math-input-container">
            {/* THANH CÔNG CỤ ĐẸP */}
            <div className="math-toolbar">
                {symbolGroups.map((group, groupIndex) => (
                    <div className="toolbar-group" key={groupIndex}>
                        <span className="toolbar-label">{group.name}</span>
                        <div className="symbols-grid">
                            {group.symbols.map((symbol, index) => (
                                <button
                                    key={index}
                                    className="symbol-btn"
                                    onClick={() => insertSymbol(symbol.latex)}
                                    title={symbol.title}
                                >
                                    {symbol.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="actions-group">
                    <button
                        className="action-btn clear-btn"
                        onClick={() => {
                            if (mathfieldRef.current) {
                                mathfieldRef.current.value = "";
                                onChange("");
                            }
                        }}
                    >
                        🗑️ Xóa tất cả
                    </button>
                    <button
                        className="action-btn focus-btn"
                        onClick={() => {
                            if (mathfieldRef.current) {
                                mathfieldRef.current.focus();
                            }
                        }}
                    >
                        ✏️ Focus
                    </button>
                </div>
            </div>

            {/* Ô SOẠN THẢO */}
            <div ref={containerRef} className="math-input-area" />

            {/* PREVIEW ĐẸP HIỂN THỊ CÔNG THỨC TOÁN */}
            <div className="preview-container">
                <div className="preview-header">
                    <div className="preview-title">Xem trước công thức</div>
                    {value && (
                        <div className="preview-length">
                            {value.length} ký tự
                        </div>
                    )}
                </div>
                <div className="preview-content">
                    {value ? (
                        <>
                            {/* Hiển thị công thức toán */}
                            <div className="math-preview">
                                <MathJax dynamic>{`\\(${value}\\)`}</MathJax>
                            </div>
                            {/* Hiển thị code LaTeX bên dưới */}
                            <div className="latex-code" style={{
                                marginTop: "12px",
                                paddingTop: "12px",
                                borderTop: "1px solid #e2e8f0",
                                fontSize: "12px",
                                color: "#64748b",
                                fontFamily: "monospace"
                            }}>
                                LaTeX: <code>{value}</code>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            color: "#94a3b8",
                            fontStyle: "italic",
                            textAlign: "center",
                            padding: "20px"
                        }}>
                            Chưa có nội dung. Bắt đầu nhập công thức toán...
                        </div>
                    )}
                </div>
            </div>

            {/* HƯỚNG DẪN */}
            <div className="help-container">
                <div className="help-title">Hướng dẫn nhanh</div>
                <div className="help-text">
                    Sử dụng các nút trên thanh công cụ để chèn ký hiệu toán học nhanh chóng.
                    Bạn cũng có thể nhập trực tiếp LaTeX.
                </div>
                <div className="help-tips">
                    <div className="tip-item">
                        <span>📌</span>
                        <span>Gõ <code>/</code> cho phân số</span>
                    </div>
                    <div className="tip-item">
                        <span>📌</span>
                        <span>Gõ <code>^</code> cho số mũ</span>
                    </div>
                    <div className="tip-item">
                        <span>📌</span>
                        <span>Gõ <code>_</code> cho chỉ số dưới</span>
                    </div>
                    <div className="tip-item">
                        <span>📌</span>
                        <span>Gõ <code>\</code> + tên lệnh</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MathInput;