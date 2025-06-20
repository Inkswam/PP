// src/app/core/models/user.model.ts
export interface User {
  id: number;            // обов'язкове поле
  username: string;      // обов'язкове поле
  email: string;         // обов'язкове поле
  telegram: string;      // обов'язкове поле
  // (no password here)
}

// Альтернативний варіант якщо id може бути undefined при створенні
export interface CreateUserRequest {
  username: string;
  email: string;
  telegram: string;
  password: string;
}

// Варіант для responses де id може бути не завжди
export interface UserResponse {
  id?: number;           // опціональне поле
  username?: string;
  email?: string;
  telegram?: string;
}
