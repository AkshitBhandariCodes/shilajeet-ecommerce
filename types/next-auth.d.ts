import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      phone?: string;
      address?: string;
      dateOfBirth?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role: string;
    name: string;
    phone?: string;
  }
}