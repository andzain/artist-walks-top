export async function createBooking(data: {
  walkId: string;
  name: string;
  email: string;
}) {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Booking failed");
  }

  return result;
}
