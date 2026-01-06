import React, { useRef, useState, useEffect } from "react";
// import "mathlive/dist/mathlive-static.css";
import { MathfieldElement } from "mathlive";
import { MathJax } from "better-react-mathjax";

interface Item {
    type: "text" | "latex" | "image";
    content?: string;
    src?: string;
}

interface Props {
    value: string; // JSON string từ DB
    onChange: (value: string) => void;
}

const TextMathEditor: React.FC<Props> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const mathfieldRef = useRef<MathfieldElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [uploading, setUploading] = useState(false);

    const VITE_CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
    const VITE_CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // ================== Chèn LaTeX từ Mathfield ==================
    const insertLatex = () => {
        if (!mathfieldRef.current || !editorRef.current) return;
        const latex = mathfieldRef.current.getValue("latex-expanded");
        if (!latex) return;

        const span = document.createElement("span");
        span.contentEditable = "false";
        span.style.background = "#eef";
        span.style.padding = "2px 4px";
        span.style.borderRadius = "4px";
        span.style.margin = "0 2px";
        span.innerText = latex;

        editorRef.current.appendChild(span);
        editorRef.current.focus();
        mathfieldRef.current.setValue("");
        updateValue();
    };

    // ================== Upload ảnh ==================
    const uploadImage = async (file: File) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESET);
            formData.append("folder", "question");

            const res = await fetch(`https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.secure_url) return data.secure_url;
            return "";
        } finally {
            setUploading(false);
        }
    };

    const insertImage = async (file: File) => {
        if (!editorRef.current) return;
        const url = await uploadImage(file);
        if (!url) return;

        const img = document.createElement("img");
        img.src = url;
        img.style.width = "150px";
        img.style.height = "100px";
        img.style.display = "inline-block";
        img.style.verticalAlign = "middle";
        img.style.cursor = "move";

        editorRef.current.appendChild(img);
        updateValue();
    };

    // ================== Serialize editor ==================
    const updateValue = () => {
        if (!editorRef.current) return;
        const nodes = editorRef.current.childNodes;
        const result: Item[] = [];

        nodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (text && text.trim() !== "") result.push({ type: "text", content: text });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement;
                if (el.tagName === "SPAN" && el.contentEditable === "false") {
                    result.push({ type: "latex", content: el.innerText });
                } else if (el.tagName === "IMG") {
                    result.push({ type: "image", src: el.src });
                }
            }
        });

        onChange(JSON.stringify(result));
    };

    // ================== Load value từ DB ==================
    useEffect(() => {
        if (!editorRef.current || !value) return;
        editorRef.current.innerHTML = "";
        try {
            const arr: Item[] = JSON.parse(value);
            arr.forEach((item) => {
                if (item.type === "text" && item.content) editorRef.current?.appendChild(document.createTextNode(item.content));
                else if (item.type === "latex" && item.content) {
                    const span = document.createElement("span");
                    span.contentEditable = "false";
                    span.style.background = "#eef";
                    span.style.padding = "2px 4px";
                    span.style.borderRadius = "4px";
                    span.style.margin = "0 2px";
                    span.innerText = item.content;
                    editorRef.current?.appendChild(span);
                } else if (item.type === "image" && item.src) {
                    const img = document.createElement("img");
                    img.src = item.src;
                    img.style.width = "150px";
                    img.style.height = "100px";
                    editorRef.current?.appendChild(img);
                }
            });
        } catch {
            console.error("Không phải JSON hợp lệ");
        }
    }, [value]);

    // ================== Khởi tạo Mathfield ==================
    useEffect(() => {
        if (!editorRef.current) return;
        const mf = new MathfieldElement();
        mf.setAttribute("virtual-keyboard-mode", "manual");
        mf.value = "";
        mf.style.width = "100%";
        mf.style.minHeight = "50px";
        mf.style.fontSize = "18px";
        mf.style.padding = "8px";
        mf.style.border = "1px solid #ccc";
        mf.style.borderRadius = "4px";

        editorRef.current.parentElement?.insertBefore(mf, editorRef.current);
        mathfieldRef.current = mf;

        return () => mf.remove();
    }, []);

    return (
        <div style={{ border: "1px solid #ccc", padding: 8 }}>
            {/* Toolbar */}
            <div style={{ marginBottom: 8 }}>
                <button onClick={insertLatex} style={{ marginRight: 8 }}>
                    Chèn LaTeX
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{ marginRight: 8 }}
                >
                    📷 {uploading ? "Đang upload..." : "Chèn ảnh"}
                </button>
                <button
                    onClick={() => {
                        if (editorRef.current) {
                            editorRef.current.innerHTML = "";
                            onChange("[]");
                        }
                    }}
                >
                    🗑 Xóa tất cả
                </button>
            </div>

            {/* Hidden input file */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files?.[0]) insertImage(e.target.files[0]);
                    e.target.value = "";
                }}
            />

            {/* Editor content */}
            <div
                ref={editorRef}
                contentEditable
                style={{
                    minHeight: 150,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    padding: 8,
                    fontFamily: "Arial",
                    fontSize: 16,
                    overflow: "auto",
                }}
                onInput={updateValue}
            />

            {/* Preview */}
            <div style={{ marginTop: 12, borderTop: "1px dashed #ccc", paddingTop: 8 }}>
                <strong>Preview:</strong>
                <MathJax dynamic>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: editorRef.current?.innerHTML || "",
                        }}
                    />
                </MathJax>
            </div>
        </div>
    );
};

export default TextMathEditor;
