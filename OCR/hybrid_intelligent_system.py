
"""
Sistema Híbrido Inteligente para OCR de Facturas
Combina tu modelo YOLO entrenado con patrones inteligentes como respaldo
"""

import cv2
import numpy as np
import pytesseract
import re
import time
from typing import Dict, List, Optional, Tuple, Any
import logging

logger = logging.getLogger(__name__)

class HybridInvoiceOCR:
    """Sistema híbrido que combina YOLO + Patrones inteligentes"""
    
    def __init__(self, yolo_model=None, model_classes=None):
        """
        Inicializar sistema híbrido
        
        Args:
            yolo_model: Tu modelo YOLO entrenado
            model_classes: Diccionario de clases {0: 'logo', 1: 'R.U.C', ...}
        """
        self.yolo_model = yolo_model
        self.model_classes = model_classes or {}
        
        # Patrones inteligentes como respaldo
        self.backup_patterns = {
            'ruc': [
                r'(?:R\.?U\.?C\.?|RUC|CI\/RUC|CEDULA|CÉDULA|CI)[\s:]*(\d{8,13})',
                r'(\d{10}001)',  # RUC ecuatoriano típico
                r'(\d{13})',     # RUC completo
            ],
            'company_name': [
                r'(?:RAZON\s*SOCIAL|RAZÓN\s*SOCIAL|EMPRESA|COMPANY|CLIENTE|CLIENT)[\s:]*([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñ\s\.&,-]{5,60})',
                r'^([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñ\s\.&,-]{10,60}(?:S\.A\.|LTDA\.|CIA\.|COMPAÑIA|COMPANY))',
                r'([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñ\s\.&,-]{15,50})',
            ],
            'invoice_number': [
                r'(?:FACTURA|FACT|FAC|INVOICE|INV|DOCUMENTO|DOC)[\s#:Nº]*(\d{3}-\d{3}-\d{6,9})',
                r'(?:FACTURA|FACT|FAC|INVOICE|INV)[\s#:Nº]*(\d{4,15})',
                r'(?:N[ºo°]|#|NUM)[\s:]*(\d{3,15})',
                r'(\d{3}-\d{3}-\d{6,9})',
                r'(\d{15})',  # Número de autorización
            ],
            'date': [
                r'(?:FECHA|DATE|EMISION|EMISIÓN)[\s:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})',
                r'(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})',
                r'(\d{4}[\/\-\.]\d{2}[\/\-\.]\d{2})',
                r'(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})',
            ],
            'subtotal': [
                r'(?:SUBTOTAL|SUB[\s\-]*TOTAL|BASE[\s]*IMPONIBLE|SUBTOT)[\s:$]*(\d+[.,]\d{2})',
                r'(?:SUBTOTAL|BASE)[\s:$]*(\d{1,6}\.\d{2})',
                r'0%[\s:$]*(\d+[.,]\d{2})',
            ],
            'iva': [
                r'(?:I\.?V\.?A\.?|IMPUESTO|TAX)[\s:$%]*(\d+[.,]\d{2})',
                r'(?:12%|15%)[\s:$]*(\d+[.,]\d{2})',
                r'IVA[\s]*12%[\s:$]*(\d+[.,]\d{2})',
            ],
            'total': [
                r'(?:TOTAL|TOTAL[\s]*A[\s]*PAGAR|IMPORTE[\s]*TOTAL|GRAN[\s]*TOTAL|VALOR[\s]*TOTAL)[\s:$]*(\d+[.,]\d{2})',
                r'(?:TOTAL|TOTAL[\s]*GENERAL)[\s:$]*(\d{1,6}\.\d{2})',
                r'(?:TOTAL)[\s:$]*(\d+[.,]\d{2})',
            ]
        }
        
        # Mapeo de clases YOLO a nombres de campos del frontend
        self.yolo_to_frontend_mapping = {
            'R.U.C': 'ruc',
            'razon_social': 'company_name', 
            'numero_factura': 'invoice_number',
            'fecha_hora': 'date',
            'subtotal': 'subtotal',
            'iva': 'iva',
            'precio_total': 'total',  # En caso de que detecte precio_total como total
        }
        
        # Configuraciones OCR optimizadas
        self.ocr_configs = {
            'default': '--psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzáéíóúñÁÉÍÓÚÑ0123456789.,:/- ',
            'numbers': '--psm 8 -c tessedit_char_whitelist=0123456789.,-/',
            'text': '--psm 7',
            'single_line': '--psm 8',
        }

    def extract_text_from_region(self, image: np.ndarray, bbox: Dict) -> str:
        """Extraer texto de una región específica usando OCR optimizado"""
        try:
            # Extraer región
            x_min = max(0, int(bbox['xmin']))
            y_min = max(0, int(bbox['ymin']))
            x_max = min(image.shape[1], int(bbox['xmax']))
            y_max = min(image.shape[0], int(bbox['ymax']))
            
            if x_max <= x_min or y_max <= y_min:
                return ""
            
            region = image[y_min:y_max, x_min:x_max]
            
            if region.size == 0:
                return ""
            
            # Preprocesar región
            if len(region.shape) == 3:
                gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
            else:
                gray = region
            
            # Mejora de contraste
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            enhanced = clahe.apply(gray)
            
            # OCR con diferentes configuraciones
            best_text = ""
            best_confidence = 0
            
            for config_name, config in self.ocr_configs.items():
                try:
                    text = pytesseract.image_to_string(enhanced, config=config, lang='spa+eng')
                    if text.strip() and len(text.strip()) > len(best_text):
                        best_text = text.strip()
                except:
                    continue
            
            return best_text
            
        except Exception as e:
            logger.debug(f"Error extracting text from region: {e}")
            return ""

    def extract_full_text_comprehensive(self, image: np.ndarray) -> str:
        """Extraer todo el texto de la imagen usando múltiples métodos"""
        all_text = []
        
        # Preprocesar imagen
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Diferentes versiones de la imagen
        versions = {
            'original': gray,
            'enhanced': cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8)).apply(gray),
            'denoised': cv2.medianBlur(gray, 3),
            'binary': cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        }
        
        # Extraer texto con diferentes configuraciones
        for version_name, img_version in versions.items():
            for config_name, config in self.ocr_configs.items():
                try:
                    text = pytesseract.image_to_string(img_version, config=config, lang='spa+eng')
                    if text.strip() and len(text.strip()) > 20:
                        all_text.append(text.strip())
                except:
                    continue
        
        # También intentar con EasyOCR si está disponible
        try:
            import easyocr
            reader = easyocr.Reader(['es', 'en'])
            easy_results = reader.readtext(image)
            easy_text = ' '.join([result[1] for result in easy_results if result[2] > 0.3])
            if easy_text.strip():
                all_text.append(easy_text)
        except:
            pass
        
        # Combinar todo el texto
        full_text = ' '.join(all_text)
        return full_text

    def process_yolo_detections(self, image: np.ndarray, yolo_detections: List[Dict]) -> Dict[str, str]:
        """Procesar detecciones YOLO y extraer texto de cada región"""
        yolo_results = {}
        
        if not yolo_detections:
            print("⚠️ No hay detecciones YOLO disponibles")
            return yolo_results
        
        print(f"🎯 Procesando {len(yolo_detections)} detecciones YOLO...")
        
        for detection in yolo_detections:
            try:
                class_name = detection.get('class_name', detection.get('name', ''))
                confidence = float(detection.get('confidence', 0))
                
                if confidence < 0.25:  # Filtrar baja confianza
                    continue
                
                # Extraer texto de la región
                bbox = {
                    'xmin': detection.get('xmin', 0),
                    'ymin': detection.get('ymin', 0),
                    'xmax': detection.get('xmax', 0),
                    'ymax': detection.get('ymax', 0)
                }
                
                region_text = self.extract_text_from_region(image, bbox)
                
                if region_text:
                    # Limpiar texto extraído
                    cleaned_text = re.sub(r'\s+', ' ', region_text).strip()
                    if cleaned_text:
                        yolo_results[class_name] = cleaned_text
                        print(f"✅ YOLO {class_name}: '{cleaned_text}' (confianza: {confidence:.2f})")
                
            except Exception as e:
                print(f"Error procesando detección YOLO: {e}")
                continue
        
        return yolo_results

    def apply_pattern_fallback(self, full_text: str) -> Dict[str, str]:
        """Aplicar patrones inteligentes como respaldo"""
        pattern_results = {}
        
        print(f"🔍 Aplicando patrones de respaldo al texto ({len(full_text)} caracteres)...")
        
        for field_name, patterns in self.backup_patterns.items():
            best_match = None
            best_confidence = 0
            
            for pattern in patterns:
                try:
                    matches = re.finditer(pattern, full_text, re.IGNORECASE | re.MULTILINE)
                    for match in matches:
                        matched_text = match.group(1) if match.groups() else match.group(0)
                        cleaned_text = re.sub(r'\s+', ' ', matched_text).strip()
                        
                        if not cleaned_text:
                            continue
                        
                        # Calcular confianza
                        confidence = 0.7
                        
                        # Validaciones específicas
                        if field_name == 'ruc' and len(cleaned_text) >= 10:
                            confidence += 0.2
                        elif field_name == 'date' and re.match(r'\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}', cleaned_text):
                            confidence += 0.2
                        elif field_name in ['subtotal', 'iva', 'total'] and re.match(r'\d+[.,]\d{2}', cleaned_text):
                            confidence += 0.2
                        
                        if confidence > best_confidence:
                            best_match = cleaned_text
                            best_confidence = confidence
                            
                except Exception as e:
                    continue
            
            if best_match:
                pattern_results[field_name] = best_match
                print(f"✅ Patrón {field_name}: '{best_match}' (confianza: {best_confidence:.2f})")
        
        return pattern_results

    def intelligent_fusion(self, yolo_results: Dict[str, str], pattern_results: Dict[str, str]) -> Dict[str, str]:
        """Fusión inteligente de resultados YOLO y patrones"""
        final_results = {}
        
        print("🧠 Fusionando resultados YOLO y patrones...")
        
        # Mapear todas las posibles fuentes a campos del frontend
        all_sources = {}
        
        # Procesar resultados YOLO
        for yolo_class, text in yolo_results.items():
            frontend_field = self.yolo_to_frontend_mapping.get(yolo_class, yolo_class.lower())
            if frontend_field not in all_sources:
                all_sources[frontend_field] = []
            all_sources[frontend_field].append({
                'text': text,
                'source': 'yolo',
                'confidence': 0.8,
                'class': yolo_class
            })
        
        # Procesar resultados de patrones
        for pattern_field, text in pattern_results.items():
            frontend_field = pattern_field if pattern_field != 'company_name' else 'company_name'
            if frontend_field not in all_sources:
                all_sources[frontend_field] = []
            all_sources[frontend_field].append({
                'text': text,
                'source': 'pattern',
                'confidence': 0.7,
                'pattern': pattern_field
            })
        
        # Fusionar resultados por campo
        for field, candidates in all_sources.items():
            if not candidates:
                continue
            
            # Ordenar por confianza y preferir YOLO si hay empate
            candidates.sort(key=lambda x: (x['confidence'], 1 if x['source'] == 'yolo' else 0), reverse=True)
            
            best_candidate = candidates[0]
            final_results[field] = best_candidate['text']
            
            print(f"🎯 {field}: '{best_candidate['text']}' (fuente: {best_candidate['source']})")
        
        return final_results

    def extract_products_intelligent(self, full_text: str, yolo_detections: List[Dict] = None) -> List[Dict]:
        """Extraer productos usando información YOLO y patrones"""
        products = []
        
        # Intentar usar detecciones YOLO para productos
        if yolo_detections:
            product_classes = ['descripcion', 'Descripcion', 'Articulo', 'Nombre_del_producto', 'cantidad', 'Cantidad', 'precio_unitario', 'precio_total']
            product_detections = [d for d in yolo_detections if d.get('class_name', '') in product_classes]
            
            if product_detections:
                print(f"📦 Encontradas {len(product_detections)} detecciones de productos YOLO")
        
        # Respaldo: extraer productos por patrones de texto
        lines = full_text.split('\n')
        for line in lines:
            line = line.strip()
            if len(line) < 10:
                continue
                
            # Patrones para productos
            patterns = [
                r'(\d+(?:[.,]\d+)?)\s+(.{10,50}?)\s+(\d+[.,]\d{2})(?:\s+(\d+[.,]\d{2}))?',
                r'(.{10,50}?)\s+(\d+)\s+(\d+[.,]\d{2})\s+(\d+[.,]\d{2})',
                r'(.{15,50}?)\s+(\d+[.,]\d{2})',
            ]
            
            for pattern in patterns:
                match = re.search(pattern, line)
                if match:
                    groups = match.groups()
                    if len(groups) >= 3:
                        products.append({
                            'description': groups[1] if len(groups[0]) < 5 else groups[0],
                            'quantity': groups[0] if len(groups[0]) < 5 else '1',
                            'unit_price': groups[2] if len(groups) > 2 else '0.00',
                            'total_price': groups[3] if len(groups) > 3 else groups[2] if len(groups) > 2 else '0.00',
                            'confidence': 0.75
                        })
                    break
        
        print(f"📦 Productos extraídos: {len(products)}")
        return products[:10]  # Limitar a 10

    def process_invoice_hybrid(self, image: np.ndarray, yolo_detections: List[Dict] = None) -> Dict:
        """
        Procesamiento híbrido principal
        
        Args:
            image: Imagen de la factura
            yolo_detections: Detecciones del modelo YOLO (opcional)
            
        Returns:
            Diccionario con resultados procesados
        """
        start_time = time.time()
        
        print("🚀 Iniciando procesamiento híbrido inteligente...")
        print(f"📷 Imagen: {image.shape}")
        print(f"🎯 Detecciones YOLO: {len(yolo_detections) if yolo_detections else 0}")
        
        try:
            # PASO 1: Extraer texto completo de la imagen
            print("\n📖 PASO 1: Extrayendo texto completo...")
            full_text = self.extract_full_text_comprehensive(image)
            print(f"📄 Texto extraído: {len(full_text)} caracteres")
            
            if len(full_text) < 50:
                return {
                    'success': False,
                    'message': 'No se pudo extraer suficiente texto de la imagen'
                }
            
            # PASO 2: Procesar detecciones YOLO (si están disponibles)
            print("\n🎯 PASO 2: Procesando detecciones YOLO...")
            yolo_results = {}
            if yolo_detections and len(yolo_detections) > 0:
                yolo_results = self.process_yolo_detections(image, yolo_detections)
                print(f"✅ YOLO extrajo {len(yolo_results)} campos")
            else:
                print("⚠️ No hay detecciones YOLO, usando solo patrones")
            
            # PASO 3: Aplicar patrones de respaldo
            print("\n🔍 PASO 3: Aplicando patrones de respaldo...")
            pattern_results = self.apply_pattern_fallback(full_text)
            print(f"✅ Patrones extrajeron {len(pattern_results)} campos")
            
            # PASO 4: Fusión inteligente
            print("\n🧠 PASO 4: Fusión inteligente de resultados...")
            final_metadata = self.intelligent_fusion(yolo_results, pattern_results)
            
            # PASO 5: Extraer productos
            print("\n📦 PASO 5: Extrayendo productos...")
            products = self.extract_products_intelligent(full_text, yolo_detections)
            
            # PASO 6: Preparar respuesta final
            processing_time = time.time() - start_time
            extracted_fields = sum(1 for v in final_metadata.values() if v)
            confidence_score = min(0.95, (extracted_fields / 7) * 0.8 + (len(products) / 5) * 0.2)
            
            # Mapear a formato esperado por el frontend
            frontend_metadata = {
                'company_name': final_metadata.get('company_name', ''),
                'ruc': final_metadata.get('ruc', ''),
                'invoice_number': final_metadata.get('invoice_number', ''),
                'date': final_metadata.get('date', ''),
                'subtotal': final_metadata.get('subtotal', ''),
                'iva': final_metadata.get('iva', ''),
                'total': final_metadata.get('total', '')
            }
            
            result = {
                'success': True,
                'message': f'Procesamiento híbrido exitoso - {extracted_fields}/7 campos extraídos',
                'metadata': frontend_metadata,
                'line_items': products,
                'processing_time': round(processing_time, 2),
                'statistics': {
                    'yolo_detections': len(yolo_results),
                    'pattern_detections': len(pattern_results),
                    'total_fields_detected': extracted_fields,
                    'table_regions': 1 if products else 0,
                    'ocr_confidence': confidence_score,
                    'model_status': {
                        'yolo_loaded': self.yolo_model is not None,
                        'classes_count': len(self.model_classes),
                        'is_loaded': True
                    }
                },
                'confidence_score': confidence_score,
                'hybrid_info': {
                    'yolo_fields': len(yolo_results),
                    'pattern_fields': len(pattern_results),
                    'fusion_applied': True,
                    'text_length': len(full_text)
                }
            }
            
            print(f"\n✅ Procesamiento completado en {processing_time:.2f}s")
            print(f"📊 Campos extraídos: {extracted_fields}/7")
            print(f"🎯 YOLO contribuyó: {len(yolo_results)} campos")
            print(f"🔍 Patrones contribuyeron: {len(pattern_results)} campos")
            print(f"📦 Productos encontrados: {len(products)}")
            
            return result
            
        except Exception as e:
            processing_time = time.time() - start_time
            print(f"❌ Error en procesamiento híbrido: {e}")
            import traceback
            traceback.print_exc()
            
            return {
                'success': False,
                'message': f'Error en procesamiento híbrido: {e}',
                'processing_time': round(processing_time, 2)
            }

# Instancia global para usar en la aplicación
hybrid_ocr_system = None

def initialize_hybrid_system(yolo_model=None, model_classes=None):
    """Inicializar el sistema híbrido global"""
    global hybrid_ocr_system
    hybrid_ocr_system = HybridInvoiceOCR(yolo_model, model_classes)
    return hybrid_ocr_system

def get_hybrid_system():
    """Obtener instancia del sistema híbrido"""
    global hybrid_ocr_system
    return hybrid_ocr_system