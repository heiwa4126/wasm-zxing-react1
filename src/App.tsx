import "./App.css";
import Qr5 from "./assets/qr5.jpg";

function App() {
	return (
		<>
			<h1>wasm-zxing-react1</h1>
			<img
				src={Qr5}
				alt="QRCode Example No.5 (3024 x 1935)"
				style={{ display: "block", width: "800px", height: "auto" }}
			/>
		</>
	);
}

export default App;
