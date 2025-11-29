export function shouldShowQuestion(rules, answers) {
  if (!rules || !rules.conditions?.length) return true;

  const results = rules.conditions.map((c) => {
    const value = answers[c.questionKey];

    switch (c.operator) {
      case "equals": return value === c.value;
      case "notEquals": return value !== c.value;
      case "contains": return String(value || "").includes(c.value);
      default: return true;
    }
  });

  return rules.logic === "AND"
    ? results.every(Boolean)
    : results.some(Boolean);
}
