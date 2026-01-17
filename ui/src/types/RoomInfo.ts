import { z } from "zod";

export const RoomSchema = z.object({
    roomId: z.number(),
    name: z.string(),
    code: z.string(),
    admin: z.boolean(),
    members: z.number()
});

export type RoomInfo = z.infer<typeof RoomSchema>;
