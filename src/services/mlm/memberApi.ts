import api from "../../utils/axios";
import type {
  ApiSuccess,
  ManualBvBody,
  MlmMember,
  MlmMemberListParams,
  PaginatedResponse,
  ProcessWithdrawalBody,
  RunClosingBody,
  WithdrawalListParams,
  WithdrawalRequest,
} from "./types";

const BASE = "/admin/member";

export const mlmMemberApi = {
  list: (params?: MlmMemberListParams) =>
    api.get<ApiSuccess<PaginatedResponse<MlmMember> | MlmMember[]>>(BASE, {
      params,
    }),

  getByUid: (uid: string) =>
    api.get<ApiSuccess<MlmMember>>(`${BASE}/${encodeURIComponent(uid)}`),

  addManualBv: (body: ManualBvBody) =>
    api.post<ApiSuccess<unknown>>(`${BASE}/bv/manual`, body),

  runClosing: (body: RunClosingBody) =>
    api.post<ApiSuccess<unknown>>(`${BASE}/closing/run`, body),

  listWithdrawals: (params?: WithdrawalListParams) =>
    api.get<ApiSuccess<PaginatedResponse<WithdrawalRequest> | WithdrawalRequest[]>>(
      `${BASE}/withdrawals/list`,
      { params }
    ),

  processWithdrawal: (id: string, body: ProcessWithdrawalBody) =>
    api.post<ApiSuccess<unknown>>(
      `${BASE}/withdrawals/${encodeURIComponent(id)}/process`,
      body
    ),
};
