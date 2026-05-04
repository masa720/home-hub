export const defaultStoreNames = [
  "リカーショップ",
  "スーパーストア",
  "T&T",
  "コストコ",
  "ウォルマート",
  "ダララマ",
  "ダイソー",
  "シティマーケット",
  "ロンドンドラッグ",
  "セーフウェイ",
  "Hマート",
] as const;

export const storeColorMap: Record<string, { background: string; border: string; text: string }> = {
  リカーショップ: { background: "#b7a3cf33", border: "#b7a3cf", text: "#7c6698" },
  スーパーストア: { background: "#fde5d933", border: "#f4c9b8", text: "#a66f5c" },
  "T&T": { background: "#e9f7df66", border: "#d6ebc8", text: "#5d8551" },
  コストコ: { background: "#fff4cf66", border: "#eadca9", text: "#8d761d" },
  ウォルマート: { background: "#e0f1fb66", border: "#c4ddea", text: "#4d7d99" },
  ダララマ: { background: "#b8ccd333", border: "#aac0c8", text: "#55717b" },
  ダイソー: { background: "#eadff033", border: "#d9c7e5", text: "#806390" },
  シティマーケット: { background: "#cdb9a733", border: "#c8ad99", text: "#7c604c" },
  ロンドンドラッグ: { background: "#ee9d9d33", border: "#e99b9b", text: "#a94f4f" },
  セーフウェイ: { background: "#fee4e233", border: "#f7cbc9", text: "#9f615e" },
  Hマート: { background: "#a9c4e633", border: "#a9c4e6", text: "#4f6f99" },
};
