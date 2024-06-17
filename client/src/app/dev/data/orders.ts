export const orders = [
  {
    id: "1",
    userId: "123",
    status: "Complete",
    expiresAt: new Date(new Date().getTime() + 1000 * 1200),
    vinyl: {
      id: "1",
      title: "Vinyl 1",
      price: 100,
    },
  },
  {
    id: "2",
    userId: "456",
    status: "Pending",
    expiresAt: new Date(new Date().getTime() + 1000 * 120),
    vinyl: {
      id: "2",
      title: "Vinyl 2",
      price: 200,
    },
  },
  {
    id: "3",
    userId: "789",
    status: "Cancelled",
    expiresAt: new Date(new Date().getTime() + 1000 * 120),
    vinyl: {
      id: "3",
      title: "Vinyl 3",
      price: 300,
    },
  },
  {
    id: "4",
    userId: "101112",
    status: "AwaitingPayment",
    expiresAt: new Date(new Date().getTime() + 1000 * 120),
    vinyl: {
      id: "4",
      title: "Vinyl 4",
      price: 400,
    },
  },
  {
    id: "5",
    userId: "131415",
    status: "Pending",
    expiresAt: new Date(new Date().getTime() + 1000 * 120),
    vinyl: {
      id: "5",
      title: "Vinyl 5",
      price: 500,
    },
  },
  {
    id: "6",
    userId: "161718",
    status: "Complete",
    expiresAt: new Date(new Date().getTime() + 1000 * 120),
    vinyl: {
      id: "6",
      title: "Vinyl 6",
      price: 600,
    },
  },
];
