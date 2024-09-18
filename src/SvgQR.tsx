import type { ReadResult } from "zxing-wasm/reader";
import type { Size } from "./types";

export function SvgQr({ item }: { item: ReadResult }) {
	const p = item.position;
	return (
		<>
			<polygon
				points={`${p.topLeft.x},${p.topLeft.y} ${p.topRight.x},${p.topRight.y} ${p.bottomRight.x},${p.bottomRight.y} ${p.bottomLeft.x},${p.bottomLeft.y}`}
				fill="rgba(0, 255, 0, 0.4)"
				stroke="none"
				strokeWidth="10"
			/>
			<text
				font-family="Arial"
				font-size="60"
				text-anchor="middle"
				x={(p.topLeft.x + p.bottomRight.x) / 2}
				y={(p.topLeft.y + p.bottomRight.y) / 2 + 30}
				fill="Red"
			>
				{item.text}
			</text>
		</>
	);
}

export function SvgQRs({ size, data }: { size: Size; data: ReadResult[] }) {
	if (data.length === 0) return <></>;

	return (
		<svg
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
			}}
			viewBox={`0 0 ${size.width} ${size.height}`}
			preserveAspectRatio="none"
		>
			<title>svg</title>
			{data.map((item, index) => (
				<SvgQr item={item} key={`${index}${item.text}`} />
			))}
		</svg>
	);
}
