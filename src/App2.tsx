import { useEffect, useRef, useState } from "react";
import { type ReadResult, type ReaderOptions, readBarcodesFromImageData } from "zxing-wasm/reader";
import "./App.css";
import { QrResults } from "./QrResults";
import Qr5 from "./assets/qr5.jpg";

const readerOptions: ReaderOptions = {
	tryHarder: true,
	formats: ["QRCode"],
	maxNumberOfSymbols: 16,
};

type Size = {
	width: number;
	height: number;
};

function App() {
	const imgRef = useRef<HTMLImageElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [imgSize, setImgSize] = useState<Size>();
	const [qrResult, setQrResult] = useState<ReadResult[]>();

	useEffect(() => {
		const img = imgRef.current;
		const canvas = canvasRef.current;

		if (!img || !canvas) {
			return;
		}

		const handleImageLoad = () => {
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				// 古いブラウザで getContext("2d") が null を返す可能性がある。ほぼ無い
				console.error("Canvas 2D context is not supported.");
				return;
			}
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			ctx.drawImage(img, 0, 0);
			const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			// imgDataは<img>から取得できなくて、1回<canvas>を解さないといけないらしい
			readBarcodesFromImageData(imgData, readerOptions)
				.then((result) => {
					setQrResult(result);
					setImgSize({ width: canvas.width, height: canvas.height });
					console.log(result);
				})
				.catch((error) => {
					console.error(error);
				});
		};

		if (img.complete) {
			handleImageLoad();
			return;
		}

		img.addEventListener("load", handleImageLoad);
		return () => {
			img.removeEventListener("load", handleImageLoad);
		};
	}, []);

	return (
		<>
			<h1>wasm-zxing-react1 (2)</h1>
			<div style={{ position: "relative", width: "fit-content" }}>
				<canvas ref={canvasRef} style={{ display: "block", width: "800px", height: "auto" }} />
				{imgSize && qrResult && (
					<SvgQRs width={imgSize.width} height={imgSize.height} data={qrResult} />
				)}
			</div>
			{qrResult && <QrResults results={qrResult} />}
			<img
				ref={imgRef}
				src={Qr5}
				alt="QRCode Example No.5 (3024 x 1935)"
				style={{ display: "none" }}
			/>
		</>
	);
}

function SvgQr({ item }: { item: ReadResult }) {
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

function SvgQRs({ width, height, data }: { width: number; height: number; data: ReadResult[] }) {
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
			viewBox={`0 0 ${width} ${height}`}
			preserveAspectRatio="none"
		>
			<title>svg</title>
			{data.map((item, index) => (
				<SvgQr item={item} key={`${index}${item.text}`} />
			))}
		</svg>
	);
}

export default App;
