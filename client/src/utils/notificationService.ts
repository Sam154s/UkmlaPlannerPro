import { addMinutes, differenceInMinutes } from 'date-fns';

export interface NotificationOptions {
  title: string;
  body: string;
  tag?: string; // Unique identifier for the notification
  icon?: string; // URL to an icon
  // More options can be added as needed
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private notificationQueue: Map<string, NodeJS.Timeout> = new Map();
  
  constructor() {
    this.initialize();
  }
  
  private async initialize() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return;
    }
    
    this.permission = Notification.permission;
    
    if (this.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        this.permission = permission;
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  }
  
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return 'denied';
    }
    
    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }
  
  getPermission(): NotificationPermission {
    return this.permission;
  }
  
  showNotification(options: NotificationOptions): void {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return;
    }
    
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }
    
    try {
      const notification = new Notification(options.title, {
        body: options.body,
        tag: options.tag,
        icon: options.icon || '/icon.png',
      });
      
      // Auto close after 20 seconds
      setTimeout(() => notification.close(), 20000);
      
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
  
  scheduleNotification(dateTime: Date, options: NotificationOptions, minutesBefore: number): string {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return '';
    }
    
    // Generate a unique ID for this notification
    const notificationId = `${options.tag || ''}-${Date.now()}`;
    
    // Calculate when to show the notification
    const notificationTime = addMinutes(dateTime, -minutesBefore);
    
    // Calculate the delay in milliseconds
    const now = new Date();
    const delayMinutes = differenceInMinutes(notificationTime, now);
    
    if (delayMinutes <= 0) {
      // Event is in the past or notification time is already passed
      return '';
    }
    
    const delayMs = delayMinutes * 60 * 1000;
    
    // Schedule the notification
    const timerId = setTimeout(() => {
      this.showNotification(options);
      this.notificationQueue.delete(notificationId);
    }, delayMs);
    
    // Store the timer ID so it can be canceled if needed
    this.notificationQueue.set(notificationId, timerId);
    
    return notificationId;
  }
  
  cancelNotification(notificationId: string): boolean {
    const timerId = this.notificationQueue.get(notificationId);
    
    if (timerId) {
      clearTimeout(timerId);
      this.notificationQueue.delete(notificationId);
      return true;
    }
    
    return false;
  }
  
  cancelAllNotifications(): void {
    this.notificationQueue.forEach((timerId) => {
      clearTimeout(timerId);
    });
    
    this.notificationQueue.clear();
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();