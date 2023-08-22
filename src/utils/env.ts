export const env = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
};

// [JoseM] We will deprecate this object to favor readability
// and organization
export const variables = {
  environment: 'REACT_APP_ENV',
};

export const appEnv = 'NODE_ENV';
export const appName = 'REACT_APP_APP_NAME' || 'TASK_MANAGEMENT';
export const gtmId = 'REACT_APP_GTM_ID';
