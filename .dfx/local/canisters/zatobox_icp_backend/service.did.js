export const idlFactory = ({ IDL }) => {
  const UserProfile = IDL.Record({
    'last_login' : IDL.Nat64,
    'role' : IDL.Text,
    'created_at' : IDL.Nat64,
    'email' : IDL.Opt(IDL.Text),
    'is_active' : IDL.Bool,
    'principal_id' : IDL.Text,
    'full_name' : IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ 'Ok' : UserProfile, 'Err' : IDL.Text });
  const AuthTokenResponse = IDL.Record({
    'principal' : IDL.Text,
    'token' : IDL.Text,
    'expires_at' : IDL.Nat64,
  });
  const Result_1 = IDL.Variant({ 'Ok' : AuthTokenResponse, 'Err' : IDL.Text });
  const UserUpdateRequest = IDL.Record({
    'email' : IDL.Opt(IDL.Text),
    'full_name' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'get_current_user' : IDL.Func([], [Result], ['query']),
    'get_user_count' : IDL.Func([], [IDL.Nat64], ['query']),
    'health_check' : IDL.Func([], [IDL.Text], ['query']),
    'login' : IDL.Func([], [Result_1], []),
    'register_user' : IDL.Func([IDL.Opt(UserUpdateRequest)], [Result], []),
    'update_user_profile' : IDL.Func([UserUpdateRequest], [Result], []),
    'validate_principal' : IDL.Func([IDL.Text], [Result], ['query']),
    'whoami' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
