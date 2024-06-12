import { Vinyl } from "../../models/Vinyl";
import { Genre } from "@yonraztickets/common";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a vinyl
  const vinyl = Vinyl.build({
    title: "concert",
    price: 5,
    userId: "123",
    genre: Genre.Jazz,
    imageUrl: "image url",
  });
  // Save the vinyl to the database
  await vinyl.save();
  // Fetch the vinyl twice (same version number)
  const firstInstance = await Vinyl.findById(vinyl.id);
  const secondInstance = await Vinyl.findById(vinyl.id);
  // Make two separate changes to the vinyl we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  // Save the first fetched vinyl
  await firstInstance!.save();
  // Save the second fetched vinyl and expect an error due to the outdated version
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }
  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const vinyl = Vinyl.build({
    title: "concert",
    price: 5,
    userId: "123",
    genre: Genre.Jazz,
    imageUrl: "image url",
  });
  await vinyl.save();
  expect(vinyl.version).toEqual(0);
  await vinyl.save();
  expect(vinyl.version).toEqual(1);
  await vinyl.save();
  expect(vinyl.version).toEqual(2);
});
