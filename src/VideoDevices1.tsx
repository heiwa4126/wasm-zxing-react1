import { useEffect, useState } from "react";

export type VideoDeviceID = string;

export type VideoDevices = {
	devices?: MediaDeviceInfo[];
	defaultDeviceId?: VideoDeviceID;
	message?: string; // for debugging
};

const constraints: MediaStreamConstraints = {
	video: {
		facingMode: "environment",
		// 'user' (front camera), and 'environment' (back camera).
		// <https://stackoverflow.com/questions/52812091/getusermedia-selecting-rear-camera-on-mobile>
	},
	audio: false,
};

/**
 * ビデオデバイスの情報を取得するフック。
 * ビデオデバイスのリストと、**背面カメラの**デフォルトを取得する。
 *
 * @returns ビデオデバイスの情報
 * @example
 * ```tsx
 * const videoDevices = useVideoDevices1();
 * ```
 */
export function useVideoDevices1() {
	const [videoDevices, setVideoDevices] = useState<VideoDevices>();

	useEffect(() => {
		console.log("useEffect mounted");
		if (videoDevices) return;

		const fetchData = async () => {
			// デフォルトカメラの取得
			// getUserMedia()を先にしないとSafariでnavigator.mediaDevices.enumerateDevices()が空になる
			// <https://stackoverflow.com/questions/51387564/navigator-mediadevices-enumeratedevices-only-returns-default-devices-on-safari
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			const videoTracks = stream.getVideoTracks();

			let defaultCameraId: string | undefined = undefined;
			if (videoTracks.length > 0) {
				// 最初のビデオトラックの設定を取得
				const trackSettings = videoTracks[0].getSettings();
				defaultCameraId = trackSettings.deviceId; // deviceIdを取得
				console.log("Device ID:", defaultCameraId);
			}

			// デバイスの列挙
			const devices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = devices.filter(
				(device) => device.kind === "videoinput" && device.deviceId !== "",
			);
			// const videoDevices = devices;
			if (videoDevices.length === 0) {
				setVideoDevices({
					message: "No video devices found",
				});
				return videoDevices;
			}

			// 全ストリームを停止
			if (stream) {
				for (const track of stream.getTracks()) {
					track.stop();
				}
			}

			// 結果を設定
			setVideoDevices({
				devices: videoDevices,
				defaultDeviceId: defaultCameraId,
			});
		};

		const cleanup = () => {
			// unmount時の処理
			console.log("useEffect unmounted");
		};

		fetchData();

		return cleanup;
	}, [videoDevices]);

	return videoDevices;
}

/**
 * ビデオデバイスの情報を表示するReactコンポーネント。
 * useVideoDevices1()フックのサンプル
 *
 * @returns ビデオデバイスの情報を表示する
 */
export function VideoDevices1() {
	const videoDevices = useVideoDevices1();
	return <VideoDevices0 videoDevices={videoDevices} />;
}

/**
 * ビデオデバイスの情報を表示するReactコンポーネント。
 * useVideoDevices1()フックのサンプル
 *
 * @returns ビデオデバイスの情報を表示する
 */
export function VideoDevices0({ videoDevices }: { videoDevices?: VideoDevices }) {
	return (
		<>
			<h3>Default Camera</h3>
			<p>{videoDevices ? videoDevices.defaultDeviceId : "checking..."}</p>
			<h3>Available Video Devices</h3>
			{videoDevices ? (
				<ol start={0}>
					{videoDevices.devices?.map((device) => (
						<li key={device.deviceId}>
							<>
								{device.label || `Video Device ${device.deviceId}`} (ID=
								{device.deviceId})
							</>
						</li>
					))}
				</ol>
			) : (
				<p>checking...</p>
			)}
			<h3>message</h3>
			<p>{videoDevices ? videoDevices.message || "(no message)" : "checking..."}</p>
		</>
	);
}
