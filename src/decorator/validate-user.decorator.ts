import { SetMetadata } from '@nestjs/common';

// Decorador para indicar qué campo contiene el userId
export const VALIDATE_USER_ID_KEY = 'validateUserId';
export const ValidateUserId = (field: string) => SetMetadata(VALIDATE_USER_ID_KEY, field);
