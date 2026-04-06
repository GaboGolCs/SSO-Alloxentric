sealed class AppException {
  final String message;
  const AppException(this.message);
}

class NetworkException extends AppException {
  const NetworkException(super.message);
}

class UnauthorizedException extends AppException {
  const UnauthorizedException(super.message);
}

class NotFoundException extends AppException {
  const NotFoundException(super.message);
}

class ServerException extends AppException {
  const ServerException(super.message);
}

class OfflineException extends AppException {
  const OfflineException(super.message);
}

class ValidationException extends AppException {
  final Map<String, List<String>>? errors;
  const ValidationException(
    super.message, {
    this.errors,
  });
}

class CacheException extends AppException {
  const CacheException(super.message);
}
