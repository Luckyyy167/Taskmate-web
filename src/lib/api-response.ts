import type { ApiError, ApiSuccess } from '@/types';

export function successResponse<T>(data: T): ApiSuccess<T> {
  return { data };
}

export function errorResponse(
  code: string,
  message: string,
  details?: Array<{ field: string; message: string }>
): ApiError {
  return {
    error: {
      code,
      message,
      ...(details && details.length > 0 ? { details } : {}),
    },
  };
}

export const ApiErrors = {
  VALIDATION_ERROR: (details?: Array<{ field: string; message: string }>) =>
    errorResponse('VALIDATION_ERROR', 'Validation failed.', details),
  NOT_FOUND: (resource = 'Resource') =>
    errorResponse('NOT_FOUND', `${resource} not found.`),
  DUPLICATE_TASK: () =>
    errorResponse('DUPLICATE_TASK', 'A task with the same title and due date already exists.'),
  UNAUTHORIZED: () =>
    errorResponse('UNAUTHORIZED', 'Authentication required.'),
  FORBIDDEN: () =>
    errorResponse('FORBIDDEN', 'You do not have permission to perform this action.'),
  EMAIL_TAKEN: () =>
    errorResponse('EMAIL_TAKEN', 'This email address is already registered.'),
  INVALID_CREDENTIALS: () =>
    errorResponse('INVALID_CREDENTIALS', 'Invalid email or password.'),
  SERVER_ERROR: () =>
    errorResponse('SERVER_ERROR', 'An unexpected error occurred. Please try again.'),
};
