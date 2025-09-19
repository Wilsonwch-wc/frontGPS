import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  RadioButtonUnchecked as CircleIcon,
  CropSquare as SquareIcon,
  CropFree as RectangleIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, useMapEvents, Circle, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configurar iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clics en el mapa
const MapClickHandler = ({ drawingMode, onShapeCreated, clickPosition, setClickPosition, previewShape, setPreviewShape }) => {
  const map = useMapEvents({
    click: (e) => {
      if (drawingMode) {
        const { lat, lng } = e.latlng;
        
        if (drawingMode === 'circle') {
          if (!clickPosition) {
            // Primer clic: establecer centro
            setClickPosition({ lat, lng });
            setPreviewShape(null);
          } else {
            // Segundo clic: calcular radio y crear círculo
            const center = clickPosition;
            const radius = map.distance([center.lat, center.lng], [lat, lng]);
            
            onShapeCreated({
              type: 'circle',
              coordinates: [center.lat, center.lng],
              radius: radius
            });
            
            setClickPosition(null);
            setPreviewShape(null);
          }
        } else if (drawingMode === 'rectangle') {
          if (!clickPosition) {
            // Primer clic: establecer primera esquina
            setClickPosition({ lat, lng });
            setPreviewShape(null);
          } else {
            // Segundo clic: crear rectángulo
            const corner1 = clickPosition;
            const corner2 = { lat, lng };
            
            onShapeCreated({
              type: 'rectangle',
              coordinates: [
                [Math.max(corner1.lat, corner2.lat), Math.min(corner1.lng, corner2.lng)], // noroeste
                [Math.min(corner1.lat, corner2.lat), Math.max(corner1.lng, corner2.lng)]  // sureste
              ]
            });
            
            setClickPosition(null);
            setPreviewShape(null);
          }
        }
      }
    },
    mousemove: (e) => {
      if (drawingMode && clickPosition) {
        const { lat, lng } = e.latlng;
        
        if (drawingMode === 'circle') {
          // Vista previa del círculo
          const center = clickPosition;
          const radius = map.distance([center.lat, center.lng], [lat, lng]);
          
          setPreviewShape({
            type: 'circle',
            coordinates: [center.lat, center.lng],
            radius: radius
          });
        } else if (drawingMode === 'rectangle') {
          // Vista previa del rectángulo
          const corner1 = clickPosition;
          const corner2 = { lat, lng };
          
          setPreviewShape({
            type: 'rectangle',
            coordinates: [
              [Math.max(corner1.lat, corner2.lat), Math.min(corner1.lng, corner2.lng)], // noroeste
              [Math.min(corner1.lat, corner2.lat), Math.max(corner1.lng, corner2.lng)]  // sureste
            ]
          });
        }
      }
    }
  });
  
  return null;
};

// Componente principal del modal
const Ubicaciones = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [drawnShape, setDrawnShape] = useState(null);
  const [drawingMode, setDrawingMode] = useState(null);
  const [clickPosition, setClickPosition] = useState(null);
  const [previewShape, setPreviewShape] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!open) {
      setFormData({ nombre: '', descripcion: '' });
      setDrawnShape(null);
      setDrawingMode(null);
      setClickPosition(null);
      setPreviewShape(null);
      setErrors({});
    }
  }, [open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleShapeCreated = (shapeData) => {
    setDrawnShape(shapeData);
    setDrawingMode(null);
    setClickPosition(null);
    if (errors.shape) {
      setErrors(prev => ({ ...prev, shape: null }));
    }
  };

  const handleShapeDeleted = () => {
    setDrawnShape(null);
    setDrawingMode(null);
    setClickPosition(null);
    setPreviewShape(null);
  };

  const startDrawing = (mode) => {
    setDrawingMode(mode);
    setClickPosition(null);
    setDrawnShape(null);
    setPreviewShape(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!drawnShape) {
      newErrors.shape = 'Debe dibujar un área de control en el mapa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const ubicacionData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        tipo_area: drawnShape.type,
        coordenadas: drawnShape.coordinates,
        radio: drawnShape.radius || null
      };

      await onSave(ubicacionData);
      onClose();
    } catch (error) {
      console.error('Error al guardar ubicación:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShapeTypeLabel = (type) => {
    switch (type) {
      case 'circle': return 'Círculo';
      case 'rectangle': return 'Rectángulo';
      default: return type;
    }
  };

  const getShapeIcon = (type) => {
    switch (type) {
      case 'circle': return <CircleIcon />;
      case 'rectangle': return <RectangleIcon />;
      default: return <SquareIcon />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Registrar Punto de Control
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
          {/* Formulario */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Nombre del Punto de Control"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              error={!!errors.nombre}
              helperText={errors.nombre}
              fullWidth
              required
            />
            <TextField
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
              fullWidth
              required
              multiline
              rows={1}
            />
          </Box>

          {/* Herramientas de dibujo */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Herramientas de Dibujo:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant={drawingMode === 'circle' ? 'contained' : 'outlined'}
                startIcon={<CircleIcon />}
                onClick={() => startDrawing('circle')}
                size="small"
                color="primary"
              >
                Círculo
              </Button>
              <Button
                variant={drawingMode === 'rectangle' ? 'contained' : 'outlined'}
                startIcon={<RectangleIcon />}
                onClick={() => startDrawing('rectangle')}
                size="small"
                color="success"
              >
                Rectángulo
              </Button>
              {(drawingMode || drawnShape) && (
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleShapeDeleted}
                  size="small"
                  color="error"
                >
                  Limpiar
                </Button>
              )}
            </Box>
            
            {drawingMode && !drawnShape && (
              <Alert severity="info" sx={{ mb: 1 }}>
                {drawingMode === 'circle' 
                  ? 'Haz clic en el mapa para establecer el centro, luego haz clic nuevamente para definir el radio'
                  : 'Haz clic en el mapa para establecer la primera esquina, luego haz clic nuevamente para la esquina opuesta'
                }
                {clickPosition && ' (Haz el segundo clic para completar)'}
              </Alert>
            )}
            
            {drawnShape && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  icon={getShapeIcon(drawnShape.type)}
                  label={`${getShapeTypeLabel(drawnShape.type)} dibujado`}
                  color="success"
                  variant="outlined"
                />
                {drawnShape.type === 'circle' && drawnShape.radius && (
                  <Typography variant="caption" color="text.secondary">
                    Radio: {Math.round(drawnShape.radius)}m
                  </Typography>
                )}
              </Box>
            )}

            {errors.shape && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {errors.shape}
              </Alert>
            )}
          </Box>

          {/* Mapa */}
          <Box sx={{ flex: 1, minHeight: 400, border: '1px solid #ddd', borderRadius: 1 }}>
            <MapContainer
              center={[-17.4139, -66.1653]} // Coordenadas de Cochabamba
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler
                drawingMode={drawingMode}
                onShapeCreated={handleShapeCreated}
                clickPosition={clickPosition}
                setClickPosition={setClickPosition}
                previewShape={previewShape}
                setPreviewShape={setPreviewShape}
              />
              
              {/* Mostrar formas dibujadas */}
              {drawnShape && drawnShape.type === 'circle' && (
                <Circle
                  center={drawnShape.coordinates}
                  radius={drawnShape.radius}
                  pathOptions={{
                    color: '#2196f3',
                    fillColor: '#2196f3',
                    fillOpacity: 0.3,
                    weight: 2
                  }}
                />
              )}
              
              {drawnShape && drawnShape.type === 'rectangle' && (
                <Rectangle
                  bounds={drawnShape.coordinates}
                  pathOptions={{
                    color: '#4caf50',
                    fillColor: '#4caf50',
                    fillOpacity: 0.3,
                    weight: 2
                  }}
                />
              )}
              
              {/* Mostrar vista previa mientras se dibuja */}
              {previewShape && previewShape.type === 'circle' && (
                <Circle
                  center={previewShape.coordinates}
                  radius={previewShape.radius}
                  pathOptions={{
                    color: '#ff9800',
                    fillColor: '#ff9800',
                    fillOpacity: 0.2,
                    weight: 2,
                    dashArray: '5, 5'
                  }}
                />
              )}
              
              {previewShape && previewShape.type === 'rectangle' && (
                <Rectangle
                  bounds={previewShape.coordinates}
                  pathOptions={{
                    color: '#ff9800',
                    fillColor: '#ff9800',
                    fillOpacity: 0.2,
                    weight: 2,
                    dashArray: '5, 5'
                  }}
                />
              )}
            </MapContainer>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          startIcon={<CancelIcon />}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
          color="primary"
        >
          {loading ? 'Guardando...' : 'Guardar Punto de Control'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Ubicaciones;