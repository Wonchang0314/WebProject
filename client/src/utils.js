const formatDate = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now - date) / 1000;
  if (diff < 60) {
    return `${Math.floor(diff)} seconds ago`;
  } else if (diff < 60 * 60) {
    return `${Math.floor(diff / 60)} minutes ago`;
  } else if (diff < 60 * 60 * 24) {
    return `${Math.floor(diff / 60 / 60)} hours ago`;
  } else if (now.getFullYear() === date.getFullYear()) {
    return `${date.toLocaleString("en", {
      month: "short",
      day: "numeric",
    })} at ${date
      .toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })
      .replace(/^0?(\d):([0-5]\d)\s(?:AM|PM)$/, "$1:$2")}`;
  } else {
    return `${date.toLocaleString("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} at ${date
      .toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })
      .replace(/^0?(\d):([0-5]\d)\s(?:AM|PM)$/, "$1:$2")}`;
  }
};

export { formatDate };
