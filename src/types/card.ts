export type CardStatus = "active" | "inactive";
export type ClubRole = "coach" | "athlete" | "member" | "director" | "assistant" | "other";

export interface SportsCard {
  id: string;
  documentId: string;
  fullName: string;
  birthDate: string;
  weightKg: number;
  heightCm: number;
  clubJoinYear: number;
  status: CardStatus;
  role: ClubRole;
  customRoleLabel?: string;
  imageUrl: string;
  updatedAt: string;
}

export interface WeightCategory { code: "U65" | "U70" | "U75" | "U80" | "U90" | "U100" | "O100"; label: string; shortLabel: string }
