const getFlightTime = (createdAt: number) => {
  const flightTimeSec = Math.max(
    0,
    Math.floor((Date.now() - createdAt) / 1000)
  );
  const mm = String(Math.floor(flightTimeSec / 60)).padStart(2, "0");
  const ss = String(flightTimeSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export { getFlightTime };
