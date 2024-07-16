export interface ICandidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  skills: string[] | string;
  resume_file: File | string;
  github_url: string;
}

export interface ICandidateState {
  candidates: ICandidate[];
  page: number;
  per_page: number;
  total: number;
  search_value?: string;
}

export type TCandidateListAPI = {
  rows: ICandidate[];
  page: number;
  per_page: number;
  total: number;
};
export interface IQueryParams {
  page: string;
  per_page?: string;
  search_value?: string;
}
export interface IPopUpProps {
  visible: boolean;
  title?: string;
  showConfirm?: boolean;
  confirmTitle?: string;
  showCancel?: boolean;
  cancelTitle?: string;
}

export interface IEmailVerificationResp {
  uniqe: boolean;
}
