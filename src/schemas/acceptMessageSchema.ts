import { z } from "zod";

export const accepetMessageSchema = z.object({ acceptMessage: z.boolean() });
