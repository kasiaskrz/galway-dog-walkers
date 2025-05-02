export interface User {
    uid?: string;
    name: string;
    email: string;
    userType: 'owner' | 'walker';
    phone?: string;
    createdAt?: Date;
  }
  