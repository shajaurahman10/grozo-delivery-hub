
import { cleanupOldRequests } from './database';

class CleanupService {
  private intervalId: NodeJS.Timeout | null = null;
  
  // Start automatic cleanup every hour
  startAutoCleanup() {
    if (this.intervalId) return; // Already running
    
    console.log('🧹 Starting automatic cleanup service...');
    
    // Run cleanup immediately
    this.runCleanup();
    
    // Then run every hour (3600000 ms)
    this.intervalId = setInterval(() => {
      this.runCleanup();
    }, 3600000);
  }
  
  stopAutoCleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🧹 Cleanup service stopped');
    }
  }
  
  async runCleanup() {
    try {
      console.log('🧹 Running cleanup of old delivery requests...');
      const result = await cleanupOldRequests();
      console.log('🧹 Cleanup completed:', result);
    } catch (error) {
      console.error('🧹 Cleanup failed:', error);
    }
  }
}

export const cleanupService = new CleanupService();
