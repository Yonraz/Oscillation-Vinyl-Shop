"use server";

import { getVinyls } from "@/api/get-vinyls";

export default async function ShowVinyls() {
  const vinyls = await getVinyls();

  
}
