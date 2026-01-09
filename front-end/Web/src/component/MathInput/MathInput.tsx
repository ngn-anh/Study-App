import React, {
    useRef,
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { message, Button } from "antd";
import { MathfieldElement } from "mathlive";
import "mathlive";
import { MathJax } from "better-react-mathjax";

/* ---------- Utility ---------- */
// 1️⃣ Xóa escape thừa (\\ → \)
const unescapeBackslashes = (str: string) => str.replace(/\\\\/g, "\\");

// 2️⃣ Heuristic LaTeX hóa chuỗi pha lẫn chữ + toán, giữ nguyên khoảng trắng
const autoLaTeXize = (raw: string) => {
    if (!raw) return "";
    let s = raw.replace(/\s+/g, " ").trim();

    // Chuyển biến kèm số mũ: x2, y10 -> x^{2}, y^{10}
    s = s.replace(/(\p{L})(\d+)/gu, "$1^{" + "$2" + "}");

    // Tách token, giữ nguyên khoảng trắng
    const tokenRe = /(\s+|\\[a-zA-Z]+|[\p{L}]+|\d+|[^\s])/gu;
    const tokens = s.match(tokenRe) || [s];

    const out: string[] = [];
    let textBuf = "";

    const isPlainToken = (t: string) => /^(\s+|[\p{L}]+|[.,;:!?…"'“”‘’])$/u.test(t);
    const escapeText = (t: string) => t.replace(/[{}]/g, "\\$&");

    const flushText = () => {
        if (textBuf) {
            out.push(`\\text{${escapeText(textBuf)}}`);
            textBuf = "";
        }
    };

    for (const t of tokens) {
        if (isPlainToken(t)) {
            textBuf += t; // gom text + khoảng trắng liên tiếp
        } else {
            flushText();
            out.push(t);
        }
    }
    flushText();

    return out.join("");
};

// 3️⃣ Bọc delimiter nếu chưa có
export const formatLatex = (
    raw: string,
    { forceBlock = false }: { forceBlock?: boolean } = {}
): string => {
    if (!raw) return "";
    const txt = raw.trim();

    const hasInline = txt.startsWith("\\(") && txt.endsWith("\\)");
    const hasBlock = txt.startsWith("$$") && txt.endsWith("$$");
    if (hasInline || hasBlock) return txt;

    // nếu chưa có delimiter → bọc
    return forceBlock ? `$$${txt}$$` : `\\(${txt}\\)`;
};

/* ---------- Component ---------- */
interface Item {
    type: "text" | "latex" | "image";
    content?: string;
    src?: string;
    width?: number;
    height?: number;
}
interface Props {
    /** LaTeX thuần (đã *unescaped*, ví dụ: "\frac{a}{b}=c") */
    value: string;
    /** Gửi lại LaTeX mới mỗi khi người dùng gõ */
    onChange: (description: string) => void;
}
const MathInput = forwardRef<MathfieldElement | null, Props>(
    ({ value, onChange }, ref) => {
        /* -----------------------------------------------------------------
           Ref tới Mathlive – expose cho cha (Drawer) để có thể blur, setValue…
           ----------------------------------------------------------------- */
        const mathfieldRef = useRef<MathfieldElement | null>(null);
        useImperativeHandle(ref, () => mathfieldRef.current);

        /* -----------------------------------------------------------------
           State nội bộ
           ----------------------------------------------------------------- */
        const [uploading, setUploading] = useState(false);
        const [previewItems, setPreviewItems] = useState<Item[]>([]);
        const [editingLatex, setEditingLatex] = useState<string>(""); // LaTeX đang chỉnh sửa
        const fileInputRef = useRef<HTMLInputElement | null>(null);
        const VITE_CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
        const VITE_CLOUDINARY_UPLOAD_PRESET =
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        /* -----------------------------------------------------------------
           1️⃣ Tạo Mathfield (chỉ chạy một lần)
           ----------------------------------------------------------------- */
        useEffect(() => {
            const container = document.getElementById("mathfield-container");
            if (!container || container.childElementCount > 0) return;

            const mf = new MathfieldElement();
            mf.defaultMode = "math";
            mf.smartMode = true;
            mf.setAttribute("virtual-keyboard-mode", "manual");
            mf.style.width = "98%";
            mf.style.minHeight = "60px";
            mf.style.fontSize = "18px";
            mf.style.padding = "8px";
            mf.style.border = "1px solid #ccc";
            mf.style.borderRadius = "4px";
            mf.smartMode = true;
            mf.letterShapeStyle = "tex";
            mf.mathVirtualKeyboardPolicy = "manual";
            mf.setValue(value ?? "", { format: "latex" });
            // Khi người dùng gõ → lấy raw value
            mf.addEventListener("input", () => {
                const raw = mf.getValue("latex"); // Lấy raw LaTeX
                setEditingLatex(raw);
                onChange?.(raw); // Trả về nguyên gốc, autoLaTeXize sẽ xử lý khi hiển thị
            });

            // Commit khi blur hoặc Enter
            const commit = () => {
                if (editingLatex.trim()) onChange?.(editingLatex.trim());
            };
            mf.addEventListener("blur", commit);
            mf.addEventListener("keydown", (ev) => {
                if (ev.key === "Enter") {
                    ev.preventDefault();
                    commit();
                    mf.blur();
                }
            });

            container.appendChild(mf);
            mathfieldRef.current = mf;
        }, []); // chỉ chạy 1 lần

        /* -----------------------------------------------------------------
           2️⃣ Khi prop `value` thay đổi → đưa vào Mathlive với heuristic
           ----------------------------------------------------------------- */
        useEffect(() => {
            if (!mathfieldRef.current) return;
            if (typeof value !== "string") return;

            const txt = value ?? "";
            
            // Nếu có dấu hiệu là text + công thức (có chữ tiếng Việt + ký hiệu toán)
            // thì dùng autoLaTeXize để wrap text trong \text{} giữ khoảng trắng
            const hasVietnameseText = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(txt);
            const hasMathSymbols = /[\^_=+\-*/()]/g.test(txt);
            const alreadyHasTextWrap = /\\text\{/.test(txt);
            
            // Nếu có text tiếng Việt + công thức và chưa được wrap
            if (hasVietnameseText && hasMathSymbols && !alreadyHasTextWrap) {
                const latexized = autoLaTeXize(txt);
                (mathfieldRef.current as any).setValue?.(latexized, { format: "latex" });
                setEditingLatex(txt); // Lưu raw value
            } else {
                // Ngược lại set trực tiếp
                (mathfieldRef.current as any).setValue?.(txt, { format: "latex" });
                setEditingLatex(txt);
            }
        }, [value]);

        /* -----------------------------------------------------------------
           3️⃣ Upload ảnh (giữ nguyên)
           ----------------------------------------------------------------- */
        const uploadImage = async (file: File) => {
            try {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESET);
                formData.append("folder", "question");
                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_NAME}/image/upload`,
                    { method: "POST", body: formData }
                );
                const data = await res.json();
                if (data.secure_url) {
                    message.success("Upload ảnh thành công");
                    return data.secure_url;
                }
                message.error("Upload ảnh thất bại");
                return "";
            } catch (e) {
                console.error(e);
                message.error("Upload ảnh thất bại");
                return "";
            } finally {
                setUploading(false);
            }
        };

        /* -----------------------------------------------------------------
           4️⃣ Helper: thêm một item (text / latex / image) vào preview
           ----------------------------------------------------------------- */
        const addItem = (newItem: Item) => {
            setPreviewItems((prev) => {
                const updated = [...prev, newItem];
                console.log("preview JSON:", JSON.stringify(updated));
                return updated;
            });
        };

        /* -----------------------------------------------------------------
           5️⃣ Commit LaTeX đang edit (khi chèn ảnh / text)
           ----------------------------------------------------------------- */
        const commitEditingLatex = (): boolean => {
            const tex = editingLatex.trim();
            if (!tex) return false;
            const latexItem: Item = { type: "latex", content: tex };
            addItem(latexItem);
            setEditingLatex(""); // reset UI
            return true;
        };

        /* -----------------------------------------------------------------
           6️⃣ Insert Text
           ----------------------------------------------------------------- */
        const insertText = (text: string) => {
            if (!text.trim()) return;
            commitEditingLatex(); // commit pending latex nếu còn
            addItem({ type: "text", content: text });
        };

        /* -----------------------------------------------------------------
           7️⃣ Insert Image
           ----------------------------------------------------------------- */
        const handleInsertImage = async (file: File) => {
            const url = await uploadImage(file);
            if (!url) return;
            commitEditingLatex(); // chắc chắn không còn latex chưa commit
            addItem({ type: "image", src: url, width: 150, height: 100 });
        };

        // const logCurrentPreview = () => {
        //     const tmp = editingLatex.trim()
        //         ? [...previewItems, { type: "latex", content: editingLatex.trim() }]
        //         : previewItems;
        //     console.log("✅ Preview hiện tại (JSON):", JSON.stringify(tmp));
        // };

        /* -----------------------------------------------------------------
           9️⃣ Xóa toàn bộ
           ----------------------------------------------------------------- */
        const handleClear = () => {
            setPreviewItems([]);
            setEditingLatex("");
            if (mathfieldRef.current) {
                (mathfieldRef.current as any).setValue?.("", { mode: "latex" });
            }
            onChange("");
            console.log("description -> []");
        };

        /* -----------------------------------------------------------------
           10️⃣ Drag & resize ảnh (giữ nguyên)
           ----------------------------------------------------------------- */
        const handleMouseDown = (
            e: React.MouseEvent,
            idx: number,
            type: "move" | "resize"
        ) => {
            e.preventDefault();
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const item = previewItems[idx];
            const origWidth = item.width || 150;
            const origHeight = item.height || 100;

            const onMouseMove = (moveEvent: MouseEvent) => {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;
                setPreviewItems((prev) => {
                    const newItems = [...prev];
                    if (type === "resize") {
                        newItems[idx] = {
                            ...item,
                            width: Math.max(20, origWidth + dx),
                            height: Math.max(20, origHeight + dy),
                        };
                    }
                    return newItems;
                });
            };
            const onMouseUp = () => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            };
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        };

        /* -----------------------------------------------------------------
           11️⃣ UI
           ----------------------------------------------------------------- */
        return (
            <div>
                {/* Mathfield container */}
                <div id="mathfield-container" style={{ marginBottom: 8 }} />

                {/* Toolbar */}
                <div style={{ marginBottom: 8 }}>
                    {/* <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        size="small"
                        style={{ marginRight: 8 }}
                    >
                        📷 {uploading ? "Đang upload…" : "Chèn ảnh"}
                    </Button> */}
                    <Button onClick={handleClear} size="small">
                        🗑 Xóa tất cả
                    </Button>
                </div>

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files?.[0]) handleInsertImage(e.target.files[0]);
                        e.target.value = "";
                    }}
                />

                {/* Preview (text / latex / image) */}
                <div
                    style={{
                        minHeight: 120,
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        padding: 8,
                        fontFamily: "Arial, sans-serif",
                        fontSize: 16,
                        overflow: "auto",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 4,
                    }}
                >
                    {previewItems.map((item, idx) => {
                        // ---------------------------------------------------------
                        //  TEXT
                        // ---------------------------------------------------------
                        if (item.type === "text")
                            return <span key={idx}>{item.content}</span>;

                        // ---------------------------------------------------------
                        //  LATEX
                        // ---------------------------------------------------------
                        if (item.type === "latex") {
                            // item.content ở DB đang là **escaped** (\\text{…})
                            // Bước 1: un‑escape --> "\text{…}"
                            const rawLatex = unescapeBackslashes(item.content ?? "");

                            // Bước 2: bọc delimiter (inline) nếu chưa có
                            const formatted = formatLatex(rawLatex);

                            return (
                                <MathJax dynamic key={idx}>
                                    {/* MathJax sẽ tự parse \text{…} → hiển thị đúng */}
                                    <span contentEditable={false}>{formatted}</span>
                                </MathJax>
                            );
                        }

                        // ---------------------------------------------------------
                        //  IMAGE
                        // ---------------------------------------------------------
                        if (item.type === "image")
                            return (
                                <div
                                    key={idx}
                                    style={{ display: "inline-block", position: "relative" }}
                                >
                                    <img
                                        src={item.src}
                                        width={item.width}
                                        height={item.height}
                                        style={{ cursor: "nwse-resize" }}
                                        onMouseDown={(e) => handleMouseDown(e, idx, "resize")}
                                    />
                                </div>
                            );

                        return null;
                    })}

                    {/* LaTeX đang chỉnh sửa (hiển thị tạm) */}
                    {editingLatex && (
                        <MathJax dynamic>
                            {/* editingLatex đã là một back‑slash → chỉ cần bọc delimiter */}
                            <span
                                style={{
                                    background: "#eef",
                                    padding: "2px 4px",
                                    borderRadius: 4,
                                }}
                            >
                                {formatLatex(editingLatex)}
                            </span>
                        </MathJax>
                    )}
                </div>

                {/* <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <Button size="small" onClick={logCurrentPreview}>
                        📋 Log JSON ra console
                    </Button>
                </div> */}
            </div>
        );
    }
);

export default MathInput;