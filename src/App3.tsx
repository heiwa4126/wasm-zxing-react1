import { useEffect, useRef, useState } from "react";
import VideoDeviceDropdown from "./VideoDeviceDropdown";
import { type VideoDeviceID, VideoDevices0, useVideoDevices1 } from "./VideoDevices1";

function startStream(newDeviceId: VideoDeviceID, videoRef: React.RefObject<HTMLVideoElement>) {
	if (!videoRef?.current) return;

	const constraints = {
		video: { deviceId: newDeviceId ? { exact: newDeviceId } : undefined },
	};
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then((stream: MediaStream) => {
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.play();
			}
		})
		.catch((error: Error) => console.error("Error accessing media devices.", error));
}

function App() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [deviceId, setDeviceId] = useState<VideoDeviceID>();
	const videoDevices = useVideoDevices1();

	useEffect(() => {
		if (videoDevices?.defaultDeviceId) {
			const newDeviceId = videoDevices.defaultDeviceId;
			setDeviceId(newDeviceId);
			startStream(newDeviceId, videoRef);
		}
	}, [videoDevices]);

	const onVideoDeviceChange = (newDeviceId: string) => {
		videoRef.current?.pause();
		setDeviceId(newDeviceId);
		startStream(newDeviceId, videoRef);
	};

	return (
		<>
			<h1>wasm-zxing-react1 (3) ビデオ周りの実験</h1>
			<VideoDeviceDropdown
				videoDevices={videoDevices}
				deviceId={deviceId}
				onChange={onVideoDeviceChange}
			/>
			<div>
				<video ref={videoRef} autoPlay muted />
			</div>
			<VideoDevices0 videoDevices={videoDevices} />
		</>
	);
}

export default App;
