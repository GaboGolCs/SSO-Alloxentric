import 'package:dio/dio.dart';

import '../../../core/constants/api_constants.dart';
import '../../../core/exceptions/app_exception.dart';
import '../../../core/models/user.dart';
import '../../../core/network/api_client.dart';

class AuthRepository {
  final ApiClient _apiClient = ApiClient();

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _apiClient.post(
        ApiConstants.authLogin,
        data: {
          'email': email,
          'password': password,
        },
        deserializer: (data) => data as Map<String, dynamic>,
      );
      return response;
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw UnauthorizedException('Invalid email or password');
      }
      rethrow;
    }
  }

  Future<User> getMe() async {
    try {
      return await _apiClient.get(
        ApiConstants.authMe,
        deserializer: (data) => User.fromJson(data as Map<String, dynamic>),
      );
    } on DioException {
      rethrow;
    }
  }

  Future<void> logout() async {
    try {
      await _apiClient.post(
        ApiConstants.authLogout,
        deserializer: (_) => null,
      );
    } on DioException {
      rethrow;
    }
  }
}
