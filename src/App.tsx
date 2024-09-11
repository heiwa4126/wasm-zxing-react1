import { useEffect, useRef, useState } from "react";
import {
	ReadResult,
	type ReaderOptions,
	readBarcodesFromImageData,
} from "zxing-wasm/reader";
import "./App.css";
import Qr5 from "./assets/qr5.jpg";

const readerOptions: ReaderOptions = {
	tryHarder: true,
	formats: ["QRCode"],
	maxNumberOfSymbols: 16,
};

function App() {
	const imgRef = useRef<HTMLImageElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
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
			readBarcodesFromImageData(imgData, readerOptions)
				.then((result) => {
					setQrResult(result);
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
			<h1>wasm-zxing-react1</h1>
			<canvas
				ref={canvasRef}
				style={{ display: "block", width: "800px", height: "auto" }}
			/>
			<img
				ref={imgRef}
				src={Qr5}
				alt="QRCode Example No.5 (3024 x 1935)"
				style={{ visibility: "hidden", width: 0, height: 0 }}
			/>
			{qrResult && (
				<ul>
					{qrResult.map((result, i) => (
						<li key={`${i}${result.text}`}>
							Format: {result.format}, Text: {result.text}
						</li>
					))}
				</ul>
			)}
		</>
	);
}

export default App;
