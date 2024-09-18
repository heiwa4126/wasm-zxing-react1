import type { ReadResult } from "zxing-wasm/reader";

export function QrResults({ results }: { results: ReadResult[] | undefined }) {
	return !results ? (
		<></>
	) : (
		<ul>
			{results.map((result, i) => (
				<li key={`${i}${result.text}`}>
					Format: {result.format}, Text: {result.text}
				</li>
			))}
		</ul>
	);
}
