import { z } from "zod";

export const rsvpSchema = z.object({
  invitationId: z.string().min(1),
  guestName: z.string().trim().min(1, "Nama tamu wajib diisi"),
  attendance: z.enum(["HADIR", "TIDAK_HADIR", "RAGU"]),
  guestCount: z.number().int().min(1).max(10).default(1),
});

export const wishSchema = z.object({
  invitationId: z.string().min(1),
  name: z.string().trim().min(1, "Nama wajib diisi"),
  message: z.string().trim().min(1, "Pesan wajib diisi"),
});

export const guestSchema = z.object({
  invitationId: z.string().min(1),
  name: z.string().trim().min(1, "Nama wajib diisi"),
  phone: z.string().optional().default(""),
  group: z.string().optional().default(""),
});

export const guestImportSchema = z.object({
  invitationId: z.string().min(1),
  guests: z.array(z.object({
    name: z.string().trim().min(1),
    phone: z.string().optional().default(""),
    group: z.string().optional().default(""),
  })).min(1),
});

export const invitationUpdateSchema = z.object({
  groomName: z.string().trim().optional(),
  groomFullName: z.string().trim().optional().nullable(),
  groomImage: z.string().optional().nullable(),
  brideName: z.string().trim().optional(),
  brideFullName: z.string().trim().optional().nullable(),
  brideImage: z.string().optional().nullable(),
  weddingDate: z.string().optional(),
  akadTime: z.string().optional().nullable(),
  resepsiTime: z.string().optional().nullable(),
  venueName: z.string().trim().optional(),
  venueAddress: z.string().trim().optional(),
  mapsEmbedUrl: z.string().optional().nullable(),
  theme: z.string().optional(),
  heroImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional(),
  loveStory: z.string().optional().nullable(),
  bankAccounts: z.array(z.object({
    bank: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
  })).nullable().optional(),
  musicUrl: z.string().optional().nullable(),
  quoteText: z.string().optional().nullable(),
  quoteSource: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

export const createInvitationSchema = z.object({
  groomName: z.string().trim().min(1),
  brideName: z.string().trim().min(1),
  weddingDate: z.string().min(1),
  venueName: z.string().trim().min(1),
  venueAddress: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  theme: z.string().default("elegant"),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
export type WishInput = z.infer<typeof wishSchema>;
export type GuestInput = z.infer<typeof guestSchema>;
export type GuestImportInput = z.infer<typeof guestImportSchema>;
export type InvitationUpdateInput = z.infer<typeof invitationUpdateSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
