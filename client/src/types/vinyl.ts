import { Genre } from "./genre";

export interface Vinyl {
  id: number;
  title: string;
  price: number;
  genre: Genre;
  description: string;
  image: string;
}
