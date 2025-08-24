export const DateUtils = {
    isToday(date: Date): boolean {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    },
  
    isOverdue(date: Date): boolean {
      const now = new Date();
      now.setHours(23, 59, 59, 999);
      return date < now;
    },
  
    formatDate(date: Date): string {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    },
  
    formatTime(date: Date): string {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
    },
  
    getDaysInMonth(year: number, month: number): number {
      return new Date(year, month + 1, 0).getDate();
    },
  
    getFirstDayOfMonth(year: number, month: number): number {
      return new Date(year, month, 1).getDay();
    },
  
    isSameDay(date1: Date, date2: Date): boolean {
      return date1.toDateString() === date2.toDateString();
    },
  
    getWeekDays(): string[] {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    },
  
    getMonthName(month: number): string {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[month];
    }
  };