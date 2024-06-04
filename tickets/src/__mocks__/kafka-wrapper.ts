export const kafkaWrapper = {
  client: {
    producer: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(null),
      send: jest.fn().mockResolvedValue(null),
      disconnect: jest.fn().mockResolvedValue(null),
    }),
  },
  connect: jest.fn().mockResolvedValue(null),
};
