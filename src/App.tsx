import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import App1 from "./App1";
import App2 from "./App2";

function AppSelector() {
	return (
		<>
			<ul>
				<li>
					<Link to="/2">v2. 開発中</Link>
				</li>
				<li>
					<Link to="/1">v1. 一番素朴なバージョン</Link>
				</li>
			</ul>
		</>
	);
}

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<App2 />} />
				<Route path="/index.html" element={<App2 />} /> {/* for AWS S3 HTTPS */}
				<Route path="/2" element={<App2 />} />
				<Route path="/1" element={<App1 />} />
			</Routes>
			<AppSelector />
		</>
	);
}

export default App;
