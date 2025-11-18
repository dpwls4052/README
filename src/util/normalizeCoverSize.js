export const normalizeCoverSize = (input) => {
  const VALID_SIZES = ["coversum", "cover", "cover200", "cover500"];

  if (!input) return "cover500";
  if (VALID_SIZES.includes(input)) return input;

  // 숫자나 별칭으로 들어왔을 때도 대충 맞춰줌
  const lowered = String(input).toLowerCase();

  if (lowered === "sum" || lowered === "thumb") return "coversum";
  if (lowered === "default" || lowered === "normal") return "cover";
  if (lowered === "200" || lowered === "small") return "cover200";
  if (lowered === "500" || lowered === "big" || lowered === "large")
    return "cover500";

  // 이상한 값 들어오면 그냥 가장 큰 걸로
  return "cover500";
};
