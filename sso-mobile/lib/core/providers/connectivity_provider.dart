import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final connectivityProvider = StreamProvider<bool>((ref) {
  final connectivity = Connectivity();

  return connectivity.onConnectivityChanged
      .asyncMap((result) async {
        // Also check with a simple connectivity test
        final connectivity = Connectivity();
        final result = await connectivity.checkConnectivity();
        return result.contains(ConnectivityResult.none) == false;
      })
      .startWith(_initialConnectivity(connectivity));
});

Future<bool> _initialConnectivity(Connectivity connectivity) async {
  try {
    final result = await connectivity.checkConnectivity();
    return result.contains(ConnectivityResult.none) == false;
  } catch (e) {
    return false;
  }
}
