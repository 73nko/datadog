export const getLoadOnPercentage = (load = 0): number => {
  return Number((+load.toFixed(4) * 1000).toFixed(2));
};

export const getTime = (date = new Date()): string => {
  let time =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return time;
};
