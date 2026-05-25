export const env = (key: string, fallback?: string): string => {
  // eslint-disable-next-line node/no-process-env
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
