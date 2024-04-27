export const anonymization = (data: Record<string, any>) => {
  return JSON.parse(JSON.stringify(data));
};
