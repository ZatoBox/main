import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent, Identity } from '@dfinity/agent';

// Environment variables
const DFX_NETWORK = import.meta.env.VITE_DFX_NETWORK || 'local';
const HOST = import.meta.env.VITE_HOST || 'http://127.0.0.1:4943';
const CANISTER_ID = import.meta.env.VITE_CANISTER_ID_ZATOBOX_ICP_BACKEND || 'umunu-kh777-77774-qaaca-cai';
const IDENTITY_PROVIDER = DFX_NETWORK === 'local' 
  ? `http://ucwa4-rx777-77774-qaada-cai.localhost:4943`
  : 'https://identity.ic0.app';


// Type definitions
export interface ICPUser {
  principal_id: string;
  full_name?: string;
  email?: string;
  role: string;
  created_at: bigint;
  last_login: bigint;
  is_active: boolean;
}

export interface AuthTokenResponse {
  principal: string;
  token: string;
  expires_at: bigint;
}

// Candid service interface
const idlFactory = ({ IDL }: any) => {
  const UserProfile = IDL.Record({
    'last_login': IDL.Nat64,
    'role': IDL.Text,
    'created_at': IDL.Nat64,
    'email': IDL.Opt(IDL.Text),
    'is_active': IDL.Bool,
    'principal_id': IDL.Text,
    'full_name': IDL.Opt(IDL.Text),
  });
  
  const AuthTokenResponse = IDL.Record({
    'principal': IDL.Text,
    'token': IDL.Text,
    'expires_at': IDL.Nat64,
  });
  
  const UserUpdateRequest = IDL.Record({
    'email': IDL.Opt(IDL.Text),
    'full_name': IDL.Opt(IDL.Text),
  });
  
  const Result = IDL.Variant({ 'Ok': UserProfile, 'Err': IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok': AuthTokenResponse, 'Err': IDL.Text });
  
  return IDL.Service({
    'get_current_user': IDL.Func([], [Result], ['query']),
    'get_user_count': IDL.Func([], [IDL.Nat64], ['query']),
    'health_check': IDL.Func([], [IDL.Text], ['query']),
    'login': IDL.Func([], [Result_1], []),
    'register_user': IDL.Func([IDL.Opt(UserUpdateRequest)], [Result], []),
    'update_user_profile': IDL.Func([UserUpdateRequest], [Result], []),
    'validate_principal': IDL.Func([IDL.Text], [Result], ['query']),
    'whoami': IDL.Func([], [IDL.Text], ['query']),
  });
};

export class ICPAuthService {
  private authClient: AuthClient | null = null;
  private actor: any = null;
  private identity: Identity | null = null;

  async init(): Promise<void> {
    this.authClient = await AuthClient.create();
    
    if (await this.authClient.isAuthenticated()) {
      this.identity = this.authClient.getIdentity();
      await this.createActor();
    }
  }

  private async createActor(): Promise<void> {
    if (!this.identity) {
      throw new Error('No identity available');
    }

    const agent = new HttpAgent({
      host: HOST,
      identity: this.identity,
    });

    // Fetch root key for local development
    if (DFX_NETWORK === 'local') {
      await agent.fetchRootKey();
    }

    this.actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: CANISTER_ID,
    });
  }

  async login(): Promise<{ user: ICPUser; token: string }> {
    if (!this.authClient) {
      await this.init();
    }

    if (!this.authClient) {
      throw new Error('Failed to initialize auth client');
    }

    // Always force identity selection by logging out first
    if (await this.authClient.isAuthenticated()) {
      await this.authClient.logout();
    }

    // Perform Internet Identity login
    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: IDENTITY_PROVIDER,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        onSuccess: async () => {
          try {
            this.identity = this.authClient!.getIdentity();
            await this.createActor();
            const userData = await this.getAuthenticatedUserData();
            resolve(userData);
          } catch (error) {
            reject(error);
          }
        },
        onError: (error) => {
          console.error('Internet Identity login failed:', error);
          reject(new Error('Internet Identity login failed'));
        }
      });
    });
  }

  private async getAuthenticatedUserData(): Promise<{ user: ICPUser; token: string }> {
    if (!this.actor) {
      throw new Error('Actor not initialized');
    }

    try {
      // Call the login method to get user data and token
      const loginResult = await this.actor.login();
      
      if ('Err' in loginResult) {
        throw new Error(loginResult.Err);
      }

      const authResponse: AuthTokenResponse = loginResult.Ok;
      
      // Get current user profile
      const userResult = await this.actor.get_current_user();
      
      if ('Err' in userResult) {
        throw new Error(userResult.Err);
      }

      const user: ICPUser = userResult.Ok;

      return {
        user,
        token: authResponse.token
      };
    } catch (error) {
      console.error('Failed to get authenticated user data:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
      this.identity = null;
      this.actor = null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }
    return this.authClient ? await this.authClient.isAuthenticated() : false;
  }

  async getCurrentUser(): Promise<ICPUser | null> {
    if (!this.actor || !(await this.isAuthenticated())) {
      return null;
    }

    try {
      const result = await this.actor.get_current_user();
      return 'Ok' in result ? result.Ok : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async updateUserProfile(userData: { full_name?: string; email?: string }): Promise<ICPUser> {
    if (!this.actor) {
      throw new Error('Not authenticated');
    }

    try {
      const result = await this.actor.update_user_profile(userData);
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      return result.Ok;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  getPrincipal(): string | null {
    return this.identity ? this.identity.getPrincipal().toString() : null;
  }

  async whoami(): Promise<string | null> {
    if (!this.actor) {
      return null;
    }

    try {
      return await this.actor.whoami();
    } catch (error) {
      console.error('Failed to get whoami:', error);
      return null;
    }
  }
}

// Export singleton instance
export const icpAuthService = new ICPAuthService();