import { TokenTypeEnum } from '../../types/token-type.enum/token-type.enum';

export class TokensDto {
  id: number;
  user_id: number;
  type: TokenTypeEnum;
  token: string;
  expires_at: Date;
  is_revoked: boolean;
  created_at: Date;
  revoked_at: Date;
  revoked_by: string;
}
