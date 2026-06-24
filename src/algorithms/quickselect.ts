export function quickselectTopK<T>(
  items: T[],
  k: number,
  getValue: (item: T) => number
): T[] {
  if (k <= 0) {
    return [];
  }

  if (k >= items.length) {
    return [...items].sort((a, b) => getValue(a) - getValue(b));
  }

  const copiedItems = [...items];

  quickselect(copiedItems, 0, copiedItems.length - 1, k, getValue);

  return copiedItems
    .slice(0, k)
    .sort((a, b) => getValue(a) - getValue(b));
}

function quickselect<T>(
  items: T[],
  left: number,
  right: number,
  k: number,
  getValue: (item: T) => number
): void {
  while (left <= right) {
    const pivotIndex = partition(items, left, right, getValue);

    if (pivotIndex === k) {
      return;
    }

    if (pivotIndex < k) {
      left = pivotIndex + 1;
    } else {
      right = pivotIndex - 1;
    }
  }
}

function partition<T>(
  items: T[],
  left: number,
  right: number,
  getValue: (item: T) => number
): number {
  const pivotValue = getValue(items[right]);
  let storeIndex = left;

  for (let i = left; i < right; i++) {
    if (getValue(items[i]) < pivotValue) {
      [items[storeIndex], items[i]] = [items[i], items[storeIndex]];
      storeIndex++;
    }
  }

  [items[storeIndex], items[right]] = [items[right], items[storeIndex]];

  return storeIndex;
}