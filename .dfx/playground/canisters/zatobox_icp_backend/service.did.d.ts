import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AuthTokenResponse {
  'principal' : string,
  'token' : string,
  'expires_at' : bigint,
}
export type Result = { 'Ok' : UserProfile } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : AuthTokenResponse } |
  { 'Err' : string };
export interface UserProfile {
  'last_login' : bigint,
  'role' : string,
  'created_at' : bigint,
  'email' : [] | [string],
  'is_active' : boolean,
  'principal_id' : string,
  'full_name' : [] | [string],
}
export interface UserUpdateRequest {
  'email' : [] | [string],
  'full_name' : [] | [string],
}
export interface _SERVICE {
  'get_current_user' : ActorMethod<[], Result>,
  'get_user_count' : ActorMethod<[], bigint>,
  'health_check' : ActorMethod<[], string>,
  'login' : ActorMethod<[], Result_1>,
  'register_user' : ActorMethod<[[] | [UserUpdateRequest]], Result>,
  'update_user_profile' : ActorMethod<[UserUpdateRequest], Result>,
  'validate_principal' : ActorMethod<[string], Result>,
  'whoami' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
