import { useEffect, useRef, useState } from "react";
import VideoDeviceDropdown from "./VideoDeviceDropdown";
import { type VideoDeviceID, VideoDevices0, useVideoDevices1 } from "./VideoDevices1";
import type { Size } from "./types";

/**
 * 指定されたビデオ要素のすべてのトラックを停止します
 * @param videoRef - 停止するトラックを持つビデオ要素の React.RefObject
 */
function stopAllTracks(videoRef: React.RefObject<HTMLVideoElement>) {
	if (videoRef.current?.srcObject) {
		for (const track of (videoRef.current.srcObject as MediaStream).getTracks()) {
			track.stop();
		}
	}
}

async function startStream(
	newDeviceId: VideoDeviceID,
	videoRef: React.RefObject<HTMLVideoElement>,
): Promise<Size | Error | undefined> {
	if (!videoRef?.current) return undefined;

	const constraints: MediaStreamConstraints = {
		video: {
			deviceId: newDeviceId ? { exact: newDeviceId } : undefined,
			width: { ideal: 9999 }, // 希望解像度
			height: { ideal: 9999 }, // 希望解像度
		},
	};

	return navigator.mediaDevices
		.getUserMedia(constraints)
		.then((stream: MediaStream) => {
			const track = stream.getVideoTracks()[0];
			const { width, height } = track.getSettings();
			console.log("Video size:", width, height);

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				//videoRef.current.play();
			}
			return width && height ? { width, height } : undefined;
		})
		.catch((error: Error) => {
			console.error("Error accessing media devices.", error);
			return error;
		});
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
	// await someImageProcessingFunction(canvasRef);
}

function App() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [deviceId, setDeviceId] = useState<VideoDeviceID>();
	const videoDevices = useVideoDevices1();

	useEffect(() => {
		let handle: number;
		if (!videoDevices) return;

		console.log("useEffect mounted");

		if (videoDevices?.defaultDeviceId) {
			const newDeviceId = videoDevices.defaultDeviceId;
			setDeviceId(newDeviceId);
			startStream(newDeviceId, videoRef).then((size) => {
				console.log({ size });
				// // カメラの解像度がわかったら、キャンバスのサイズを調整
				// if (size && canvasRef.current) {
				// 	const canvas = canvasRef.current;
				// 	canvas.width = size.width;
				// 	canvas.height = size.height;
				// }
			});

			// captureSnapshot()を300ms毎に呼び出すループを開始
			const nextTick = () => {
				handle = window.setTimeout(async () => {
					captureSnapshot(videoRef, canvasRef);
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
			stopAllTracks(videoRef);
			console.log("useEffect unmounted");
		};
	}, [videoDevices]);

	const onVideoDeviceChange = (newDeviceId: string) => {
		videoRef.current?.pause();
		stopAllTracks(videoRef);
		setDeviceId(newDeviceId);
		startStream(newDeviceId, videoRef).then((size) => {
			console.log({ size });
		});
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
