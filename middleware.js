'use strict';

// Add the API key as a Bearer token to every request (app-level beforeRequest middleware)
const addBearerHeader = (request, z, bundle) => {
  if (bundle && bundle.authData && bundle.authData.api_key) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${bundle.authData.api_key}`;
  }
  return request;
};

// Handle API errors and provide user-friendly messages
const handleBadResponses = (response, z, bundle) => {
  // Handle authentication errors
  if (response.status === 401) {
    throw new z.errors.Error(
      'The API key you supplied is invalid or has expired. Please check your API key and try again.',
      'AuthenticationError',
      response.status
    );
  }

  // Handle authorization errors
  if (response.status === 403) {
    const message = response.json && response.json.detail 
      ? response.json.detail 
      : 'You do not have permission to perform this action, or you have reached your plan limit.';
    throw new z.errors.Error(message, 'ForbiddenError', response.status);
  }

  // Handle not found errors
  if (response.status === 404) {
    const message = response.json && response.json.detail
      ? response.json.detail
      : 'The requested resource was not found.';
    throw new z.errors.Error(message, 'NotFoundError', response.status);
  }

  // Handle validation errors
  if (response.status === 422) {
    let message = 'Validation error: ';
    if (response.json && response.json.detail) {
      if (Array.isArray(response.json.detail)) {
        // FastAPI validation error format
        message += response.json.detail
          .map(err => `${err.loc.join('.')}: ${err.msg}`)
          .join(', ');
      } else {
        message += response.json.detail;
      }
    } else {
      message += 'Invalid input data.';
    }
    throw new z.errors.Error(message, 'ValidationError', response.status);
  }

  // Handle bad request errors
  if (response.status === 400) {
    const message = response.json && response.json.detail
      ? response.json.detail
      : 'Bad request. Please check your input data.';
    throw new z.errors.Error(message, 'BadRequestError', response.status);
  }

  // Handle server errors
  if (response.status >= 500) {
    const message = response.json && response.json.detail
      ? response.json.detail
      : 'The Layerre API is experiencing issues. Please try again later.';
    throw new z.errors.Error(message, 'ServerError', response.status);
  }

  return response;
};

module.exports = {
  befores: [addBearerHeader],
  afters: [handleBadResponses]
};
