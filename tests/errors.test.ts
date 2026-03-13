/**
 * Unit tests for error hierarchy
 */

import { describe, it, expect } from 'vitest';
import { ErrorCode, ApplicationError, ApiError, ConfigError, ValidationError, FileSystemError, NetworkError } from '../src/errors.js';

describe('Error Hierarchy', () => {
  it('should create an ApplicationError with correct properties', () => {
    const context = { foo: 'bar' };
    const error = new ApplicationError(ErrorCode.UNKNOWN, 'Test error', context);
    
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(ErrorCode.UNKNOWN);
    expect(error.context).toEqual(context);
    expect(error.timestamp).toBeInstanceOf(Date);
    expect(error.name).toBe('ApplicationError');
  });

  it('should convert ApplicationError to JSON', () => {
    const error = new ApplicationError(ErrorCode.UNKNOWN, 'Test error');
    const json = error.toJSON();
    
    expect(json.name).toBe('ApplicationError');
    expect(json.message).toBe('Test error');
    expect(json.code).toBe(ErrorCode.UNKNOWN);
    expect(json).toHaveProperty('timestamp');
    expect(json).toHaveProperty('stack');
  });

  it('should create an ApiError', () => {
    const error = new ApiError(ErrorCode.API_AUTHENTICATION_FAILED, 'Auth failed', {
      statusCode: 401,
      url: 'https://api.test',
      context: { user: 'test' }
    });
    
    expect(error.name).toBe('ApiError');
    expect(error.statusCode).toBe(401);
    expect(error.url).toBe('https://api.test');
    expect(error.code).toBe(ErrorCode.API_AUTHENTICATION_FAILED);
  });

  it('should create a ConfigError', () => {
    const error = new ConfigError(ErrorCode.CONFIG_NOT_FOUND, 'Config missing', {
      configPath: '/path/to/config'
    });
    
    expect(error.name).toBe('ConfigError');
    // Note: ConfigError uses context for its properties in the implementation
    expect(error.context).toEqual({ configPath: '/path/to/config' });
  });

  it('should create a ValidationError', () => {
    const error = new ValidationError(ErrorCode.VALIDATION_FAILED, 'Invalid input', {
      field: 'id',
      context: { val: 'bad' }
    });
    
    expect(error.name).toBe('ValidationError');
    expect(error.field).toBe('id');
    expect(error.context).toEqual({ val: 'bad' });
  });

  it('should create a FileSystemError', () => {
    const error = new FileSystemError(ErrorCode.FILE_NOT_FOUND, 'File not found', {
      path: '/missing/file'
    });
    
    expect(error.name).toBe('FileSystemError');
    expect(error.path).toBe('/missing/file');
  });

  it('should create a NetworkError', () => {
    const error = new NetworkError(ErrorCode.NETWORK_OFFLINE, 'No internet', {
      url: 'https://api.test'
    });
    
    expect(error.name).toBe('NetworkError');
    expect(error.url).toBe('https://api.test');
  });
});
