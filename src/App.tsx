import { useEffect, useRef } from "react";
import "./App.css";
import Qr5 from "./assets/qr5.jpg";

function App() {
	const imgRef = useRef<HTMLImageElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!imgRef.current || !canvasRef.current) {
			return undefined;
		}

		const img = imgRef.current;
		const canvas = canvasRef.current;

		const handleImageLoad = () => {
			const ctx = canvas.getContext("2d");
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			ctx?.drawImage(img, 0, 0);
		};

		if (img.complete) {
			handleImageLoad();
			return undefined;
		}

		img.addEventListener("load", handleImageLoad);
		return () => {
			img.removeEventListener("load", handleImageLoad);
		};
	}, [imgRef.current, canvasRef.current]);

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
		</>
	);
}

export default App;
