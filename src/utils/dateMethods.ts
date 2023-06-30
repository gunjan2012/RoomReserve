export const formattedDateString = (stringDate: string) => {
  const [day, month, year] = stringDate.split("-");
  return `${year}-${month}-${day}`;
};

export const isDateBetween = (
  dateToCheck: string,
  startDate: string,
  endDate: string
) => {
  const date = new Date(formattedDateString(dateToCheck));
  const start = new Date(formattedDateString(startDate));
  const end = new Date(formattedDateString(endDate));

  return date >= start && date <= end;
};

export const calculateDuration = (
  startDate: string,
  endDate: string
): number => {
  // Number of milliseconds in a day
  const oneDay = 24 * 60 * 60 * 1000;

  const start = new Date(formattedDateString(startDate));
  const end = new Date(formattedDateString(endDate));

  // Calculate the difference in milliseconds
  const diffMs = Math.abs(end.getTime() - start.getTime());

  // Convert the difference to days
  const duration = Math.round(diffMs / oneDay);

  return duration + 1;
};
