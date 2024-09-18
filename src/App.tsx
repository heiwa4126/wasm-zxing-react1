import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import App1 from "./App1";
import App2 from "./App2";
import App3 from "./App3";

function AppSelector() {
	return (
		<>
			<ul>
				<li>
					<Link to="/3">v3. ビデオ周りの実験</Link>
				</li>
				<li>
					<Link to="/2">v2. imgにSVGオーバレイ</Link>
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
				<Route path="/" element={<App3 />} />
				<Route path="/index.html" element={<App3 />} /> {/* for AWS S3 HTTPS */}
				<Route path="/3" element={<App3 />} />
				<Route path="/2" element={<App2 />} />
				<Route path="/1" element={<App1 />} />
			</Routes>
			<AppSelector />
		</>
	);
}

export default App;
