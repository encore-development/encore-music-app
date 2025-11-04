// Simple event bus for app-wide communication
class EventBus {
  static listeners = {};

  static on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  static off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  static emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('EventBus callback error:', error);
      }
    });
  }

  static removeAllListeners(event) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}

export default EventBus;