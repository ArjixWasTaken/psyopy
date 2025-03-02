import { SSHIdentity } from '../types';

/**
 * Service for managing SSH identities
 */
class IdentityService {
  private storageKey = 'ssh-manager-identities';
  
  /**
   * Get all identities from storage
   */
  getIdentities(): SSHIdentity[] {
    const storedIdentities = localStorage.getItem(this.storageKey);
    if (storedIdentities) {
      try {
        return JSON.parse(storedIdentities);
      } catch (error) {
        console.error('Failed to parse stored identities:', error);
      }
    }
    return [];
  }
  
  /**
   * Save identities to storage
   */
  saveIdentities(identities: SSHIdentity[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(identities));
  }
  
  /**
   * Add a new identity
   */
  addIdentity(identity: SSHIdentity): SSHIdentity[] {
    const identities = this.getIdentities();
    const newIdentities = [...identities, identity];
    this.saveIdentities(newIdentities);
    return newIdentities;
  }
  
  /**
   * Update an existing identity
   */
  updateIdentity(identity: SSHIdentity): SSHIdentity[] {
    const identities = this.getIdentities();
    const newIdentities = identities.map(id => 
      id.id === identity.id ? identity : id
    );
    this.saveIdentities(newIdentities);
    return newIdentities;
  }
  
  /**
   * Delete an identity
   */
  deleteIdentity(id: string): SSHIdentity[] {
    const identities = this.getIdentities();
    const newIdentities = identities.filter(id => id.id !== id);
    this.saveIdentities(newIdentities);
    return newIdentities;
  }
  
  /**
   * Get identity by ID
   */
  getIdentityById(id: string): SSHIdentity | undefined {
    const identities = this.getIdentities();
    return identities.find(identity => identity.id === id);
  }
}

export const identityService = new IdentityService();