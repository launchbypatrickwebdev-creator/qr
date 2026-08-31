export function getContrastTextColor(
  backgroundColor: string
) {
  const hex = backgroundColor
    .replace("#", "")
    .trim();

  if (hex.length !== 6) {
    return "#111827";
  }

  const red = parseInt(
    hex.slice(0, 2),
    16
  );

  const green = parseInt(
    hex.slice(2, 4),
    16
  );

  const blue = parseInt(
    hex.slice(4, 6),
    16
  );

  if (
    Number.isNaN(red) ||
    Number.isNaN(green) ||
    Number.isNaN(blue)
  ) {
    return "#111827";
  }

  const brightness =
    (red * 299 +
      green * 587 +
      blue * 114) /
    1000;

  return brightness < 140
    ? "#FFFFFF"
    : "#111827";
}

export function getMutedTextColor(
  backgroundColor: string
) {
  return getContrastTextColor(
    backgroundColor
  ) === "#FFFFFF"
    ? "rgba(255, 255, 255, 0.72)"
    : "#4B5563";
}

export function getBusinessInitials(
  name: string
) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "B";
  }

  if (words.length === 1) {
    return words[0]
      .charAt(0)
      .toUpperCase();
  }

  return `${words[0]
    .charAt(0)}${words[1]
    .charAt(0)}`.toUpperCase();
}