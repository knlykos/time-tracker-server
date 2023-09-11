import { TokenTypeEnum } from '../../types/token-type.enum/token-type.enum';

export class TokensDto {
  user_id: string;
  type: TokenTypeEnum;
  token: string;
  expires_at: Date;
  created_at: Date;
  revoked_at: Date;
  revoked_by: string;
}
