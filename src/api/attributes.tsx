const getAttributes = (props: Record<string, unknown>): Record<string, unknown> => {
  const attributes: Record<string, unknown> = {};

  Object.entries(props).forEach(([key, value]) => {
    if (!key.startsWith('$')) attributes[key] = value;
  });

  return attributes;
};

export { getAttributes };
