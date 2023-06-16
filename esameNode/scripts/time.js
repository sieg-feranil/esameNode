export function getDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return dateString;
  }
  const currentDateTime = getDate();
  console.log(currentDateTime);
    