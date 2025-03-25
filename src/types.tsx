export interface Event {
  id: number;
  color: string;
  isActive: boolean;
  name: string;
  date: string;
  time: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  image: string;
  createdOn: string;
}

export const browserSafeColors = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
  "black",
  "white",
  "gray",
  "cyan",
  "magenta",
  "lime",
  "teal",
  "navy",
  "olive",
  "maroon",
];
