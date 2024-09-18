import type { VideoDevices } from "./VideoDevices1";

export default function VideoDeviceDropdown({
	videoDevices,
	deviceId,
	onChange,
}: {
	videoDevices?: VideoDevices;
	deviceId?: string;
	onChange: (deviceId: string) => void;
}) {
	if (!videoDevices) return <p>checking...</p>;
	if (videoDevices.devices?.length === 0) return <p>no video devices</p>;

	if (!deviceId) {
		deviceId = videoDevices.defaultDeviceId;
	}

	return (
		<select onChange={(e) => onChange(e.target.value)} className="select1" value={deviceId}>
			{videoDevices.devices?.map((device) => (
				<option key={device.deviceId} value={device.deviceId}>
					{device.label || `Video Device ${device.deviceId}`}
				</option>
			))}
		</select>
	);
}
