export type HostRouteDefinition = {
	dynamic: boolean;
	input: string;
	/**
	 * An optional target
	 */
	target?: string;
	// Allows specifying a weight to the definition.
	// This allows insertion of definitions out of order but having
	// a priority once inserted.
	weight?: number;
	status: number;
	force?: boolean;
};

export class HostRoutes {
	public definitions: HostRouteDefinition[] = [];
	public minInputLength = 4;
	public minTargetLength = 4;

	/**
	 * Adds a new definition by inserting it into the list of definitions
	 * prioritized by the given weight. This keeps higher priority definitions
	 * At the top of the list once printed.
	 */
	add(definition: HostRouteDefinition) {
		// Find the longest input, so we can format things nicely
		if (definition.input.length > this.minInputLength) {
			this.minInputLength = definition.input.length;
		}
		// Same for the target
		if (definition.target && definition.target.length > this.minTargetLength) {
			this.minTargetLength = definition.target.length;
		}

		binaryInsert(this.definitions, definition, (a, b) => {
			if (a.weight && b.weight) {
				return a.weight > b.weight;
			} else {
				return false;
			}
		});
	}

	/**
	 * Removes all the saved route definitions
	 */
	empty(): boolean {
		return this.definitions.length === 0;
	}
}

function binaryInsert<T>(sorted: T[], item: T, comparator: (a: T, b: T) => boolean) {
	if (sorted.length === 0) {
		sorted.push(item);
		return 0;
	}
	let low = 0,
		high = sorted.length - 1,
		mid = 0;
	while (low <= high) {
		mid = low + ((high - low) >> 1);
		if (comparator(sorted[mid], item)) {
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	}

	if (comparator(sorted[mid], item)) {
		mid++;
	}

	sorted.splice(mid, 0, item);
	return mid;
}
