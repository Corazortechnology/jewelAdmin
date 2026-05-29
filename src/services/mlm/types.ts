export type MemberStatus = "inactive" | "active";

export type WithdrawalStatus = "pending" | "approved" | "rejected" | "paid";

export type ProcessWithdrawalStatus = "approved" | "rejected" | "paid";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface MlmMember {
  _id?: string;
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  contactNo?: string;
  countryCode?: string;
  memberStatus?: MemberStatus;
  referrerUid?: string | null;
  /** @deprecated use referrerUid */
  referrerId?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  panVerified?: boolean;
  role?: string;
  dateOfJoining?: string;
  createdAt?: string;
  updatedAt?: string;
  activatedAt?: string;
  panNo?: string;
  wallet?: {
    availableBalance?: number;
    pendingBalance?: number;
    totalEarned?: number;
  };
  teamDetails?: {
    directTeamCount?: number;
    totalTeamCount?: number;
    activeTeamCount?: number;
    inactiveTeamCount?: number;
  };
  activationDetails?: {
    activationDate?: string;
    activationAmount?: number;
    activationStatus?: string;
    paymentStatus?: string;
  };
  personal?: Record<string, unknown>;
  bank?: Record<string, unknown>;
  nominee?: Record<string, unknown>;
}

export interface MlmMemberListParams {
  page?: number;
  limit?: number;
  memberStatus?: MemberStatus;
  search?: string;
}

export interface ManualBvBody {
  targetUid: string;
  bvAmount: number;
  note?: string;
}

export interface RunClosingBody {
  periodKey: string;
}

export interface WithdrawalRequest {
  _id: string;
  memberUid?: string;
  uid?: string;
  memberName?: string;
  name?: string;
  requestedAmount?: number;
  adminCharge?: number;
  ugcCharge?: number;
  netPayable?: number;
  status?: WithdrawalStatus;
  adminNote?: string;
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
  };
  createdAt?: string;
  processedAt?: string;
}

export interface WithdrawalListParams {
  status?: WithdrawalStatus;
  page?: number;
  limit?: number;
}

export interface ProcessWithdrawalBody {
  status: ProcessWithdrawalStatus;
  adminNote?: string;
}

export interface ApiSuccess<T> {
  success: boolean;
  data: T;
  message?: string;
}
