export const deserializeMessageData = (data: string) => {
  try {
    const response = JSON.parse(data);
    return response;
  } catch (error) {
    console.log('deserializing json error');
    return undefined;
  }
};

export const serializeMessageData = (data: unknown) => {
  try {
    const response = JSON.stringify(data);
    return response;
  } catch (error) {
    console.log('serializing json error');
    return undefined;
  }
};
