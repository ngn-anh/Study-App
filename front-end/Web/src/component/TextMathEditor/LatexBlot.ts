// LatexBlot.ts
import Quill from "quill";

const BlockEmbed: any = Quill.import("blots/block/embed");

export class LatexBlot extends BlockEmbed {
  static blotName = "latex";
  static tagName = "div";
  static className = "ql-latex";

  static create(value: string) {
    const node = super.create() as HTMLElement;
    node.setAttribute("data-latex", value);
    node.innerText = value;
    node.style.background = "#eef";
    node.style.padding = "2px 4px";
    node.style.borderRadius = "4px";
    node.style.margin = "0 2px";
    return node;
  }

  static value(node: HTMLElement) {
    return node.getAttribute("data-latex") || "";
  }
}

Quill.register(LatexBlot as any);
