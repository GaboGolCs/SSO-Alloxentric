import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../../../../core/models/offline_report.dart';
import '../../../../core/providers/connectivity_provider.dart';
import '../../../../core/providers/offline_queue_provider.dart';
import '../../../../shared/widgets/empty_state_widget.dart';
import '../../../../shared/widgets/loading_widget.dart';
import '../../domain/reports_provider.dart';

class NewReportScreen extends ConsumerStatefulWidget {
  const NewReportScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<NewReportScreen> createState() => _NewReportScreenState();
}

class _NewReportScreenState extends ConsumerState<NewReportScreen> {
  int _currentStep = 0;
  File? _photoFile;
  String? _selectedAreaId;
  String? _selectedShift;
  String _reportType = 'unsafe_condition';
  bool _isIap = false;
  final _descriptionController = TextEditingController();
  String? _photoError;
  String? _descriptionError;

  final ImagePicker _imagePicker = ImagePicker();

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    try {
      final pickedFile = await _imagePicker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
      );
      if (pickedFile != null) {
        setState(() {
          _photoFile = File(pickedFile.path);
          _photoError = null;
        });
      }
    } catch (e) {
      setState(() => _photoError = 'Error al capturar foto');
    }
  }

  bool _validateStep(int step) {
    setState(() {
      _photoError = null;
      _descriptionError = null;
    });

    switch (step) {
      case 0:
        if (_photoFile == null) {
          setState(() => _photoError = 'Debes capturar una foto');
          return false;
        }
        return true;
      case 2:
        if (_selectedAreaId == null) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Debes seleccionar un área'),
              backgroundColor: AppColors.riskHigh,
            ),
          );
          return false;
        }
        if (_selectedShift == null) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Debes seleccionar un turno'),
              backgroundColor: AppColors.riskHigh,
            ),
          );
          return false;
        }
        return true;
      case 4:
        if (_descriptionController.text.length < 10) {
          setState(() =>
              _descriptionError = 'La descripción debe tener al menos 10 caracteres');
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  Future<void> _submitReport() async {
    final isConnected = await ref.read(connectivityProvider.future);

    if (!isConnected) {
      // Save to offline queue
      final localId = DateTime.now().millisecondsSinceEpoch.toString();
      final offlineReport = OfflineReport(
        localId: localId,
        areaId: _selectedAreaId!,
        type: _reportType,
        isIap: _isIap,
        description: _descriptionController.text,
        shift: _selectedShift!,
        photoPath: _photoFile!.path,
        status: 'queued',
        createdAt: DateTime.now(),
        retryCount: 0,
      );

      try {
        await ref
            .read(offlineQueueProvider.notifier)
            .enqueueReport(offlineReport);

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                'Reporte guardado localmente. Se sincronizará cuando haya conexión.',
              ),
              backgroundColor: AppColors.riskMedium,
            ),
          );
          context.go('/');
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Error al guardar el reporte'),
              backgroundColor: AppColors.riskHigh,
            ),
          );
        }
      }
    } else {
      // Submit online
      try {
        ref.read(createReportProvider(
          CreateReportParams(
            areaId: _selectedAreaId!,
            type: _reportType,
            isIap: _isIap,
            description: _descriptionController.text,
            shift: _selectedShift!,
            photo: _photoFile!,
          ),
        ));

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Reporte enviado exitosamente'),
              backgroundColor: AppColors.riskLow,
            ),
          );
          context.go('/');
        }
      } on AppException catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(e.message),
              backgroundColor: AppColors.riskHigh,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final zonesAsync = ref.watch(zonesProvider);

    return WillPopScope(
      onWillPop: () async {
        if (_currentStep > 0) {
          setState(() => _currentStep--);
          return false;
        }
        return true;
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Crear Reporte'),
          leading: IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => context.pop(),
          ),
        ),
        body: Stepper(
          currentStep: _currentStep,
          onStepContinue: () {
            if (_validateStep(_currentStep)) {
              if (_currentStep < 4) {
                setState(() => _currentStep++);
              } else {
                _submitReport();
              }
            }
          },
          onStepCancel: () {
            if (_currentStep > 0) {
              setState(() => _currentStep--);
            }
          },
          steps: [
            // Step 0: Photo
            Step(
              title: const Text('Foto'),
              content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_photoFile != null)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.file(
                        _photoFile!,
                        height: 200,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    )
                  else
                    Container(
                      height: 200,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: AppColors.bgElevated,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.camera_alt),
                    ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _pickImage,
                      icon: const Icon(Icons.camera_alt),
                      label: const Text('Capturar Foto'),
                    ),
                  ),
                  if (_photoError != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        _photoError!,
                        style: Theme.of(context).textTheme.bodySmall!.copyWith(
                              color: AppColors.riskHigh,
                            ),
                      ),
                    ),
                ],
              ),
            ),
            // Step 1: Location (placeholder)
            Step(
              title: const Text('Ubicación'),
              content: Center(
                child: Text(
                  'Ubicación capturada automáticamente',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
            ),
            // Step 2: Area & Shift
            Step(
              title: const Text('Área y Turno'),
              content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Área',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  zonesAsync.when(
                    loading: () => const LoadingWidget(),
                    error: (error, stack) => EmptyStateWidget(
                      title: 'Error',
                      message: 'No se pudieron cargar las áreas',
                    ),
                    data: (zones) => DropdownButtonFormField<String>(
                      value: _selectedAreaId,
                      decoration: const InputDecoration(
                        hintText: 'Selecciona un área',
                      ),
                      items: zones
                          .map(
                            (zone) => DropdownMenuItem(
                              value: zone.id,
                              child: Text(zone.name),
                            ),
                          )
                          .toList(),
                      onChanged: (value) {
                        setState(() => _selectedAreaId = value);
                      },
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Turno',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: _selectedShift,
                    decoration: const InputDecoration(
                      hintText: 'Selecciona un turno',
                    ),
                    items: const [
                      DropdownMenuItem(value: 'morning', child: Text('Mañana')),
                      DropdownMenuItem(value: 'afternoon', child: Text('Tarde')),
                      DropdownMenuItem(value: 'night', child: Text('Noche')),
                    ],
                    onChanged: (value) {
                      setState(() => _selectedShift = value);
                    },
                  ),
                ],
              ),
            ),
            // Step 3: Classification
            Step(
              title: const Text('Clasificación'),
              content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Tipo de Reporte',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 16),
                  _ClassificationButton(
                    label: 'Acto Inseguro',
                    icon: Icons.person_alert,
                    isSelected: _reportType == 'unsafe_act',
                    onTap: () {
                      setState(() => _reportType = 'unsafe_act');
                    },
                  ),
                  const SizedBox(height: 12),
                  _ClassificationButton(
                    label: 'Condición Insegura',
                    icon: Icons.warning_amber,
                    isSelected: _reportType == 'unsafe_condition',
                    onTap: () {
                      setState(() => _reportType = 'unsafe_condition');
                    },
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Reporte IAP',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Switch(
                        value: _isIap,
                        onChanged: (value) {
                          setState(() => _isIap = value);
                        },
                        activeColor: AppColors.primary,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Step 4: Description
            Step(
              title: const Text('Descripción'),
              content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    controller: _descriptionController,
                    maxLines: 5,
                    minLines: 3,
                    decoration: InputDecoration(
                      hintText: 'Describe el incidente con detalles (mínimo 10 caracteres)',
                      errorText: _descriptionError,
                    ),
                  ),
                  if (_descriptionError == null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        '${_descriptionController.text.length} caracteres',
                        style: Theme.of(context).textTheme.bodySmall!.copyWith(
                              color: AppColors.textSecondary,
                            ),
                      ),
                    ),
                ],
              ),
            ),
            // Step 5: Review
            Step(
              title: const Text('Revisar'),
              content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _SummaryRow(
                    label: 'Tipo',
                    value: _reportType == 'unsafe_act'
                        ? 'Acto Inseguro'
                        : 'Condición Insegura',
                  ),
                  const SizedBox(height: 12),
                  _SummaryRow(label: 'IAP', value: _isIap ? 'Sí' : 'No'),
                  const SizedBox(height: 12),
                  _SummaryRow(label: 'Turno', value: _selectedShift ?? ''),
                  const SizedBox(height: 12),
                  _SummaryRow(
                    label: 'Descripción',
                    value: _descriptionController.text,
                    multiline: true,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ClassificationButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _ClassificationButton({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withOpacity(0.1) : null,
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
              size: 28,
            ),
            const SizedBox(width: 16),
            Text(
              label,
              style: Theme.of(context).textTheme.titleMedium!.copyWith(
                    color: isSelected
                        ? AppColors.primary
                        : AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
            ),
            const Spacer(),
            if (isSelected)
              const Icon(
                Icons.check_circle,
                color: AppColors.primary,
              ),
          ],
        ),
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final bool multiline;

  const _SummaryRow({
    required this.label,
    required this.value,
    this.multiline = false,
  });

  @override
  Widget build(BuildContext context) {
    if (multiline) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall!.copyWith(
                  color: AppColors.textSecondary,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      );
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall!.copyWith(
                color: AppColors.textSecondary,
              ),
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                fontWeight: FontWeight.w600,
              ),
        ),
      ],
    );
  }
}
