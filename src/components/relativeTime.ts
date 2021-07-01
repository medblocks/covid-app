export const relativeTime = (d: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h12",
  }).format(new Date(d.replace("Etc/UTC", "Z")));
};
