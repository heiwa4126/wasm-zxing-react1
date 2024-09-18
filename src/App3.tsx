import "./App.css";
import VideoDeviceDropdown from "./VideoDeviceDropdown";
import { VideoDevices0, useVideoDevices1 } from "./VideoDevices1";

function App() {
	const videoDevices = useVideoDevices1();

	const onVideoDeviceChange = (deviceId: string) => {
		console.log("Selected video device:", deviceId);
	};

	return (
		<>
			<h1>wasm-zxing-react1 (3) ビデオ周りの実験</h1>
			<VideoDeviceDropdown videoDevices={videoDevices} onChange={onVideoDeviceChange} />
			<VideoDevices0 videoDevices={videoDevices} />
		</>
	);
}

export default App;
