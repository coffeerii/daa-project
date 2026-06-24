export function damerauLevenshteinDistance(source: string, target: string): number {
  const rows = source.length + 1;
  const cols = target.length + 1;

  const dp: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(0)
  );

  for (let i = 0; i < rows; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j < cols; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );

      const canTranspose =
        i > 1 &&
        j > 1 &&
        source[i - 1] === target[j - 2] &&
        source[i - 2] === target[j - 1];

      if (canTranspose) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }

  return dp[source.length][target.length];
}

export function findClosestMedicineName(
  input: string,
  medicineNames: string[],
  maxDistance = 3
): string | null {
  let closestName: string | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const medicineName of medicineNames) {
    const distance = damerauLevenshteinDistance(input, medicineName);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestName = medicineName;
    }
  }

  if (closestDistance <= maxDistance) {
    return closestName;
  }

  return null;
}