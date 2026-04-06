import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../constants/api_constants.dart';
import '../../exceptions/app_exception.dart';

class AuthInterceptor extends Interceptor {
  static const _tokenKey = 'access_token';
  static const _refreshTokenKey = 'refresh_token';
  static const _secureStorage = FlutterSecureStorage();

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    try {
      final token = await _secureStorage.read(key: _tokenKey);
      if (token != null) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    } catch (e) {
      // Log error but continue without token
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      try {
        final refreshToken = await _secureStorage.read(key: _refreshTokenKey);
        if (refreshToken != null) {
          final dio = Dio(
            BaseOptions(
              baseUrl: ApiConstants.baseUrl,
              connectTimeout: ApiConstants.connectTimeout,
              receiveTimeout: ApiConstants.receiveTimeout,
            ),
          );

          final refreshResponse = await dio.post(
            ApiConstants.authRefresh,
            data: {'refresh_token': refreshToken},
          );

          if (refreshResponse.statusCode == 200) {
            final newToken = refreshResponse.data['access_token'];
            final newRefreshToken =
                refreshResponse.data['refresh_token'] ?? refreshToken;

            await _secureStorage.write(key: _tokenKey, value: newToken);
            await _secureStorage.write(
              key: _refreshTokenKey,
              value: newRefreshToken,
            );

            // Retry original request with new token
            err.requestOptions.headers['Authorization'] = 'Bearer $newToken';
            return handler.resolve(await dio.fetch(err.requestOptions));
          }
        }
      } catch (e) {
        // Token refresh failed, clear tokens and propagate error
        await _clearTokens();
      }
    }

    handler.next(err);
  }

  static Future<void> _clearTokens() async {
    try {
      await _secureStorage.delete(key: _tokenKey);
      await _secureStorage.delete(key: _refreshTokenKey);
    } catch (e) {
      // Ignore errors during cleanup
    }
  }

  static Future<String?> getToken() async {
    try {
      return await _secureStorage.read(key: _tokenKey);
    } catch (e) {
      return null;
    }
  }

  static Future<void> setTokens(String accessToken, String refreshToken) async {
    try {
      await _secureStorage.write(key: _tokenKey, value: accessToken);
      await _secureStorage.write(key: _refreshTokenKey, value: refreshToken);
    } catch (e) {
      throw AppException('Failed to save tokens securely');
    }
  }

  static Future<void> clearTokens() async {
    await _clearTokens();
  }
}
