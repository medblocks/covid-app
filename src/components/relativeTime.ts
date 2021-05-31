export const relativeTime = (d) => {
  const now = new Date();
  const date = new Date(d);

  // Check for an invalid date
  if (isNaN(date.getMilliseconds())) {
    return "";
  }

  const diff = +date - +now;
  const availableUnits = [
    { max: 2760000, value: 60000, unit: "minute" }, // max 46 minutes
    { max: 72000000, value: 3600000, unit: "hour" }, // max 20 hours
    { max: 518400000, value: 86400000, unit: "day" }, // max 6 days
    { max: 2419200000, value: 604800000, unit: "week" }, // max 28 days
    { max: 28512000000, value: 2592000000, unit: "month" }, // max 11 months
    { max: Infinity, value: 31536000000, unit: "year" },
  ];
  const { unit, value } = availableUnits.find(
    (unit) => Math.abs(diff) < unit.max
  ) as any;

  return new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
    style: "long",
  }).format(Math.round(diff / value), unit);
};
