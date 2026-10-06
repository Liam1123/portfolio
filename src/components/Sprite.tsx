// Renders a pixel-art sprite from a list of strings. Each character maps to a
// colour in `palette`; "." is transparent.
export function Sprite({
  rows,
  palette,
  scale = 4,
  className,
  title,
}: {
  rows: string[];
  palette: Record<string, string>;
  scale?: number;
  className?: string;
  title?: string;
}) {
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[ch]} />)),
      )}
    </svg>
  );
}

export const LCD_PALETTE = { "0": "#0f380f", "1": "#306230", "2": "#8bac0f", "3": "#c4dc6c" };

export const TRAINER = [
  ".....000000.....",
  "....01111110....",
  "...0111111110...",
  "...0111001110...",
  "..000000000000..",
  "...0222222220...",
  "...0202222020...",
  "...0222222220...",
  "....02200220....",
  ".....022220.....",
  "....01111110....",
  "...0110110110...",
  "...0210110120...",
  "...0210000120...",
  "....00111100....",
  "....01100110....",
  "....01100110....",
  "....00000000....",
  "...0000..0000...",
];

export const POKEBALL = [
  "..000000..",
  ".01111110.",
  "0111111110",
  "0111001110",
  "0000330000",
  "0333003330",
  "0333333330",
  ".03333330.",
  "..000000..",
];

export const BADGE_SHAPES: Record<string, string[]> = {
  earth: ["...1...", "..121..", ".12211.", "1222111", ".11111.", "..111..", "...1..."],
  soul: [".11.11.", "1221111", "1211111", "1111111", ".11111.", "..111..", "...1..."],
  thunder: ["...1...", "..121..", "1112111", ".12111.", "..111..", ".11.11.", "11...11"],
  cascade: ["...1...", "..121..", ".12211.", ".12111.", "1211111", "1111111", ".11111."],
  volcano: ["..1....", "..11.1.", ".1211..", ".12111.", "1221111", "1211111", ".11111."],
  rainbow: ["..111..", ".11211.", "1112111", "1222221", "1112111", ".11211.", "..111.."],
  boulder: ["..111..", ".12111.", "1221111", "1211111", "1111111", ".11111.", "..111.."],
  marsh: ["1.....1", "11...11", "1211211", "1111111", "1111111", ".11111.", "..111.."],
};
