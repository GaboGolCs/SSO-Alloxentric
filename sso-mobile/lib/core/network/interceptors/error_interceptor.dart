import 'package:dio/dio.dart';

import '../../exceptions/app_exception.dart';

class ErrorInterceptor extends Interceptor {
  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final appException = _mapException(err);
    handler.reject(
      DioException(
        requestOptions: err.requestOptions,
        error: appException,
        type: err.type,
        response: err.response,
      ),
    );
  }

  AppException _mapException(DioException error) {
    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.sendTimeout) {
      return NetworkException(
        error.message ?? 'Network timeout',
      );
    }

    if (error.type == DioExceptionType.unknown) {
      if (error.error is! DioException) {
        return OfflineException(
          'No internet connection. Your report will be saved locally.',
        );
      }
    }

    final statusCode = error.response?.statusCode ?? 0;
    final responseData = error.response?.data;

    switch (statusCode) {
      case 401:
        return UnauthorizedException('Unauthorized. Please login again.');
      case 403:
        return UnauthorizedException('Access denied.');
      case 404:
        return NotFoundException('Resource not found.');
      case 422:
        final errors = _extractValidationErrors(responseData);
        return ValidationException(
          'Validation failed',
          errors: errors,
        );
      case >= 500:
        return ServerException(
          _extractErrorMessage(responseData) ??
              'Server error. Please try again later.',
        );
      default:
        return NetworkException(
          _extractErrorMessage(responseData) ?? 'An error occurred.',
        );
    }
  }

  String? _extractErrorMessage(dynamic responseData) {
    if (responseData is Map<String, dynamic>) {
      return responseData['message'] as String? ??
          responseData['error'] as String? ??
          responseData['detail'] as String?;
    }
    return null;
  }

  Map<String, List<String>>? _extractValidationErrors(dynamic responseData) {
    if (responseData is Map<String, dynamic>) {
      final errors = responseData['errors'] as Map<String, dynamic>?;
      if (errors != null) {
        return errors.map((key, value) {
          final messages = (value is List)
              ? List<String>.from(value)
              : [value.toString()];
          return MapEntry(key, messages);
        });
      }
    }
    return null;
  }
}
