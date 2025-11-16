export function randomText() {
  const text =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  const words = text.split(/\s+/);

  const WORD_COUNT = 25;

  // If text has fewer than 100 words, wrap around randomly
  if (words.length < WORD_COUNT) {
    const repeats = Math.ceil(WORD_COUNT / words.length);
    const extended = Array(repeats).fill(words).flat();
    return extended.slice(0, WORD_COUNT).join(" ");
  }

  // Pick a random slice from the available text
  const start = Math.floor(Math.random() * (words.length - WORD_COUNT));

  return words.slice(start, start + WORD_COUNT).join(" ") + ".";
}

export function randomHoursIntBaseOn(baseHours: number) {
  const min = Math.floor(baseHours / 2);
  const max = Math.ceil(baseHours * 1.5);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDatePastSixMonths() {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const timestamp =
    sixMonthsAgo.getTime() +
    Math.random() * (now.getTime() - sixMonthsAgo.getTime());

  return new Date(timestamp);
}

export function randomIntSmallerThan(max: number): number {
  if (max <= 1) return 1; // safe fallback
  return Math.floor(Math.random() * (max - 1)) + 1;
}

export function randomIntRanged(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function random3to5(): number {
  return Math.floor(Math.random() * (5 - 3 + 1)) + 3;
}
