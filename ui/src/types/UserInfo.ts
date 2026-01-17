import { z } from "zod";

export const UserSchema = z.object({
  username: z.string(),
  avatarUrl: z.string(),
  badgeLabel: z.string(),
  streakDays: z.number(),
});

export type UserInfo = z.infer<typeof UserSchema>;
