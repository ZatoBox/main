use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::{caller, init, query, update};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use serde::Serialize;
use std::borrow::Cow;
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

#[derive(CandidType, Deserialize, Clone, Serialize)]
pub struct UserProfile {
    pub principal_id: String,
    pub full_name: Option<String>,
    pub email: Option<String>, // For compatibility with Node.js backend
    pub role: String, // admin, user, etc.
    pub created_at: u64,
    pub last_login: u64,
    pub is_active: bool,
}

const MAX_VALUE_SIZE: u32 = 1024; // 1KB should be enough for user profiles

impl Storable for UserProfile {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize)]
pub struct UserUpdateRequest {
    pub full_name: Option<String>,
    pub email: Option<String>,
}

#[derive(CandidType, Deserialize)]
pub struct AuthTokenResponse {
    pub principal: String,
    pub token: String, // JWT-like token to send to Node.js backend
    pub expires_at: u64,
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static USERS: RefCell<StableBTreeMap<String, UserProfile, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
}

#[init]
fn init() {
    ic_cdk::println!("ZatoBox ICP Backend initialized");
}

#[update]
fn register_user(user_data: Option<UserUpdateRequest>) -> Result<UserProfile, String> {
    let principal = caller();
    let principal_str = principal.to_text();
    
    // Don't allow anonymous principal
    if principal == Principal::anonymous() {
        return Err("Anonymous principal not allowed".to_string());
    }
    
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        
        // Check if user already exists
        if users.contains_key(&principal_str) {
            return Err("User already registered".to_string());
        }
        
        let now = ic_cdk::api::time();
        let user = UserProfile {
            principal_id: principal_str.clone(),
            full_name: user_data.as_ref().and_then(|u| u.full_name.clone()),
            email: user_data.as_ref().and_then(|u| u.email.clone()),
            role: "user".to_string(), // Default role
            created_at: now,
            last_login: now,
            is_active: true,
        };
        
        users.insert(principal_str, user.clone());
        Ok(user)
    })
}

#[update]
fn update_user_profile(user_data: UserUpdateRequest) -> Result<UserProfile, String> {
    let principal = caller();
    let principal_str = principal.to_text();
    
    if principal == Principal::anonymous() {
        return Err("Anonymous principal not allowed".to_string());
    }
    
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        
        match users.get(&principal_str) {
            Some(mut user) => {
                // Update fields if provided
                if let Some(name) = user_data.full_name {
                    user.full_name = Some(name);
                }
                if let Some(email) = user_data.email {
                    user.email = Some(email);
                }
                user.last_login = ic_cdk::api::time();
                
                users.insert(principal_str, user.clone());
                Ok(user)
            }
            None => Err("User not found. Please register first.".to_string())
        }
    })
}

#[update]
fn login() -> Result<AuthTokenResponse, String> {
    let principal = caller();
    let principal_str = principal.to_text();
    
    if principal == Principal::anonymous() {
        return Err("Anonymous principal not allowed".to_string());
    }
    
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        
        match users.get(&principal_str) {
            Some(mut user) => {
                if !user.is_active {
                    return Err("User account is deactivated".to_string());
                }
                
                // Update last login
                user.last_login = ic_cdk::api::time();
                users.insert(principal_str.clone(), user.clone());
                
                // Generate a simple token (in production, use proper JWT)
                let token = format!("icp_token_{}_{}_{}", 
                    principal_str, 
                    user.last_login,
                    ic_cdk::api::time()
                );
                
                Ok(AuthTokenResponse {
                    principal: principal_str,
                    token,
                    expires_at: ic_cdk::api::time() + (24 * 60 * 60 * 1_000_000_000), // 24 hours
                })
            }
            None => {
                // Auto-register new users
                let now = ic_cdk::api::time();
                let user = UserProfile {
                    principal_id: principal_str.clone(),
                    full_name: None,
                    email: None,
                    role: "user".to_string(),
                    created_at: now,
                    last_login: now,
                    is_active: true,
                };
                
                users.insert(principal_str.clone(), user);
                
                let token = format!("icp_token_{}_{}_{}", 
                    principal_str, 
                    now,
                    ic_cdk::api::time()
                );
                
                Ok(AuthTokenResponse {
                    principal: principal_str,
                    token,
                    expires_at: ic_cdk::api::time() + (24 * 60 * 60 * 1_000_000_000),
                })
            }
        }
    })
}

#[query]
fn get_current_user() -> Result<UserProfile, String> {
    let principal = caller();
    let principal_str = principal.to_text();
    
    if principal == Principal::anonymous() {
        return Err("Anonymous principal not allowed".to_string());
    }
    
    USERS.with(|users| {
        let users = users.borrow();
        users.get(&principal_str)
            .ok_or("User not found".to_string())
    })
}

#[query]
fn validate_principal(principal_text: String) -> Result<UserProfile, String> {
    USERS.with(|users| {
        let users = users.borrow();
        users.get(&principal_text)
            .filter(|user| user.is_active)
            .ok_or("Invalid or inactive user".to_string())
    })
}

#[query]
fn get_user_count() -> u64 {
    USERS.with(|users| {
        users.borrow().len()
    })
}

#[query]
fn whoami() -> String {
    caller().to_text()
}

#[query]
fn health_check() -> String {
    "ZatoBox ICP Backend is healthy".to_string()
}

// Export the candid interface
ic_cdk::export_candid!();

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generate_candid() {
        use std::env;
        use std::fs::write;
        use std::path::PathBuf;

        let dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
        let did_path = dir.join("zatobox_icp_backend.did");
        
        // Generate the candid interface
        let candid = __export_service();
        write(did_path, candid).expect("Write failed.");
    }
}