import { z } from "zod";

export const RoomSchema = z.object({
    roomId: z.number(),
    name: z.string(),
    code: z.string()
});

export type RoomInfo = z.infer<typeof RoomSchema>;