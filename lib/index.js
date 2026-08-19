// dsh-design-tokens — 设计令牌：命名规范与分层。纯 Node 知识库。
import { defineTool } from "@deepseek-ai/dsh-tools";

const name = "设计令牌";
const inject = ["tools"];

const LAYERS = [
  { id: "primitive", name: "基础令牌（Primitive）", en: "Primitive Tokens", desc: "最底层的原始值，如具体色值、字号、间距数值。", example: "blue-500: #1E88E5" },
  { id: "semantic", name: "语义令牌（Semantic）", en: "Semantic Tokens", desc: "赋予用途含义，引用基础令牌，如颜色.主色、文字.正文。", example: "color-primary: {blue-500}" },
  { id: "component", name: "组件令牌（Component）", en: "Component Tokens", desc: "绑定到具体组件的令牌，如按钮.背景、输入框.边框。", example: "button-bg: {color-primary}" },
];

const NAMING = [
  { rule: "层级.对象.属性", example: "color.bg.primary / spacing.md / font.size.lg" },
  { rule: "小写 + 点/横线分隔", example: "color-primary 或 color.primary，全项目统一" },
  { rule: "语义命名而非具体值", example: "用 color-danger 而非 color-red" },
  { rule: "数字/字号用语义阶梯", example: "xs/sm/md/lg/xl 或 100-900 字重" },
  { rule: "避免冗余前缀", example: "用 spacing.md 而非 spacing.spacing-md" },
];

const SPACING_SCALE = ["4", "8", "12", "16", "24", "32", "40", "48", "64", "96"];
const FONT_SCALE = ["12", "14", "16", "18", "20", "24", "30", "36", "48", "60", "72"];

async function apply(ctx, _config) {
  ctx.tools.register(defineTool({
    name: "token_layers",
    description: "返回设计令牌的三层结构（基础/语义/组件），说明各自含义与示例。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: { layers: { type: "array", required: true, items: { type: "object", additionalProperties: false, properties: { id: { type: "string", required: true }, name: { type: "string", required: true }, en: { type: "string", required: true }, desc: { type: "string", required: true }, example: { type: "string", required: true } } } } },
      },
      render: (_a, v) => [{ type: "text", text: v.layers.map((l) => `- ${l.name}（${l.en}）：${l.desc} 例：${l.example}`).join("\n") }],
    },
    execute: async () => ({ layers: LAYERS.map((l) => ({ ...l })) }),
  }));

  ctx.tools.register(defineTool({
    name: "token_naming_rules",
    description: "返回设计令牌命名规范（层级.对象.属性、小写分隔、语义命名、语义阶梯、避免冗余）。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: { naming: { type: "array", required: true, items: { type: "object", additionalProperties: false, properties: { rule: { type: "string", required: true }, example: { type: "string", required: true } } } } },
      },
      render: (_a, v) => [{ type: "text", text: v.naming.map((n) => `- ${n.rule}（例：${n.example}）`).join("\n") }],
    },
    execute: async () => ({ naming: NAMING.map((n) => ({ ...n })) }),
  }));

  ctx.tools.register(defineTool({
    name: "token_scales",
    description: "返回常用的间距与字号刻度参考（8 点间距刻度、字号阶梯），供设计令牌取值。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: { spacing: { type: "array", required: true, items: { type: "string" } }, font: { type: "array", required: true, items: { type: "string" } } },
      },
      render: (_a, v) => [{ type: "text", text: `间距刻度（px）：${v.spacing.join(", ")}\n字号阶梯（px）：${v.font.join(", ")}` }],
    },
    execute: async () => ({ spacing: [...SPACING_SCALE], font: [...FONT_SCALE] }),
  }));
}

export { apply, inject, name };
