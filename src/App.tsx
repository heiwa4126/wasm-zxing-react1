import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import App1 from "./App1";
import App2 from "./App2";
import App3 from "./App3";

function AppSelector() {
	return (
		<>
			<ol reversed>
				<li>
					<Link to="/3">ビデオ周りの実験</Link>
				</li>
				<li>
					<Link to="/2">imgにXZingしてSVGオーバレイ</Link>
				</li>
				<li>
					<Link to="/1">imgをXZing(素朴版)</Link>
				</li>
			</ol>
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
