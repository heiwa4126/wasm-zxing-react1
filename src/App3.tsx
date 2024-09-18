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
			const track = stream.getVideoTracks()[0];
			const { width, height } = track.getSettings();
			console.log("Video size:", width, height);

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				//videoRef.current.play();
			}
		})
		.catch((error: Error) => console.error("Error accessing media devices.", error));
}

// TODO: とりあえずApp()の外に書いたけど、場合によってはApp()内に書いたほうがいいかも
async function captureSnapshot(
	videoRef: React.RefObject<HTMLVideoElement>,
	canvasRef: React.RefObject<HTMLCanvasElement>,
) {
	if (!(videoRef?.current && canvasRef?.current)) return;

	const canvas = canvasRef.current;
	const video = videoRef.current;
	const context = canvas.getContext("2d", { willReadFrequently: true });
	if (!context) return;

	// ビデオの現在のフレームをキャンバスに描画
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	context.drawImage(video, 0, 0, canvas.width, canvas.height);

	// TODO: 以下、canvasRefの画像をもとに何か画像処理をする
	// await someImageProcessingFunction(canvas);
}

function App() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [deviceId, setDeviceId] = useState<VideoDeviceID>();
	const videoDevices = useVideoDevices1();

	useEffect(() => {
		let handle: number;

		if (videoDevices?.defaultDeviceId) {
			const newDeviceId = videoDevices.defaultDeviceId;
			setDeviceId(newDeviceId);
			startStream(newDeviceId, videoRef);

			// captureSnapshot()を300ms毎に呼び出すループを開始
			const nextTick = () => {
				handle = window.setTimeout(async () => {
					captureSnapshot(videoRef, canvasRef).then(() => {});
					nextTick();
				}, 300);
			};
			nextTick();
		}

		// コンポーネントがアンマウントされたときに
		// 1. captureSnapshot()のループを停止する
		// 2. カメラストリームを停止する
		return () => {
			clearTimeout(handle);
			if (videoRef.current?.srcObject) {
				const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
				// biome-ignore lint/complexity/noForEach: <explanation>
				tracks.forEach((track) => track.stop());
			}
		};
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
				<canvas ref={canvasRef} />
			</div>
			<VideoDevices0 videoDevices={videoDevices} />
		</>
	);
}

export default App;
