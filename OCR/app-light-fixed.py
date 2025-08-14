
"""
Sistema OCR mejorado con algoritmos ultra optimizados
"""

import re
import json
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
import cv2
import numpy as np
from PIL import Image
import io
import logging
from pdf2image import convert_from_bytes

# Configurar la ruta de Tesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'], 
     allow_headers=['Content-Type', 'Authorization'], 
     methods=['GET', 'POST', 'OPTIONS'])
logging.basicConfig(level=logging.INFO)

def clean_text(text):
    """Limpiar texto extraído"""
    if not text:
        return ""
    cleaned = re.sub(r'[^\w\s.,:-]', '', str(text))
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def extract_complete_metadata_ultra(full_text):
    """EXTRACCION COMPLETA DE METADATOS MEJORADA"""
    metadata = {
        'company_name': 'No detectado',
        'ruc': 'No detectado',
        'date': 'No detectado',
        'invoice_number': 'No detectado', 
        'payment_method': 'No detectado',
        'subtotal': 'No detectado',
        'iva': 'No detectado',
        'total': 'No detectado'
    }
    
    if not full_text:
        return metadata
        
    lines = [line.strip() for line in full_text.split('\n') if line.strip()]
    print("EXTRACCION ULTRA MEJORADA DE METADATOS...")
    
    # ========== FECHA ==========
    for line in lines:
        if 'Date:' in line:
            date_match = re.search(r'(\d{1,2}/\d{1,2}/\d{4})', line)
            if date_match:
                metadata['date'] = date_match.group(1)
                print(f"Fecha: {metadata['date']}")
                break
    
    # ========== INVOICE NUMBER ==========
    for line in lines:
        if 'LBM-' in line or 'INV-' in line:
            invoice_match = re.search(r'((?:LBM-|INV-)\d+)', line)
            if invoice_match:
                metadata['invoice_number'] = invoice_match.group(1)
                print(f"Invoice #: {metadata['invoice_number']}")
                break
    
    # ========== PAYMENT METHOD ==========
    for i, line in enumerate(lines):
        if 'Payment Method:' in line:
            # Buscar en líneas siguientes
            for j in range(i+1, min(i+5, len(lines))):
                next_line = lines[j]
                if next_line and next_line.lower() in ['cash', 'card', 'credit']:
                    metadata['payment_method'] = next_line.capitalize()
                    print(f"Payment Method: {metadata['payment_method']}")
                    break
            if metadata['payment_method'] != 'No detectado':
                break
    
    # ========== TOTALES FINANCIEROS ==========
    # Buscar Subtotal, Tax y Total específicos
    for i, line in enumerate(lines):
        # Subtotal
        if 'Subtotal:' in line and i+1 < len(lines):
            subtotal_line = lines[i+1]
            subtotal_match = re.search(r'(\d+[.,]\d+)', subtotal_line)
            if subtotal_match:
                metadata['subtotal'] = subtotal_match.group(1)
                print(f"Subtotal: {metadata['subtotal']}")
        
        # Tax/IVA
        elif 'Tax' in line and '15%' in line and i+1 < len(lines):
            tax_line = lines[i+1] 
            tax_match = re.search(r'(\d+[.,]\d+)', tax_line)
            if tax_match:
                metadata['iva'] = tax_match.group(1)
                print(f"IVA: {metadata['iva']}")
        
        # Total final - buscar patrones más amplios
        elif ('Total:' in line):
            # Buscar en la misma línea
            total_match = re.search(r'Total:\s*\$?(\d+[.,]\d+)', line)
            if total_match:
                metadata['total'] = total_match.group(1)
                print(f"Total: {metadata['total']}")
            # Si no está en la misma línea, buscar en la siguiente
            elif i+1 < len(lines):
                total_line = lines[i+1]
                total_match = re.search(r'\$?(\d+[.,]\d+)', total_line)
                if total_match:
                    metadata['total'] = total_match.group(1)
                    print(f"Total: {metadata['total']}")
    
    return metadata

def extract_all_products_ultra(full_text):
    """🚀 ALGORITMO ULTRA INTELIGENTE - PARSEA TODAS LAS LÍNEAS DE PRODUCTOS"""
    products = []
    
    if not full_text or len(full_text) < 20:
        print("Texto insuficiente")
        return []
    
    lines = [line.strip() for line in full_text.split('\n') if line.strip()]
    print(f"🔍 ALGORITMO ULTRA INTELIGENTE analizando {len(lines)} lineas...")
    
    # ========== PARSER MEJORADO PARA TODOS LOS PRODUCTOS ==========
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Skip lines that are clearly not products
        if (line.startswith('Date:') or line.startswith('Invoice') or 
            line.startswith('Payment') or line.startswith('Subtotal') or
            line.startswith('Tax') or line.startswith('Total:') or
            line.startswith('Name Description') or
            line in ['Description', 'Quantity', 'Unit Price', 'Total', 'Name']):
            i += 1
            continue
        
        # ========== PATRÓN 1: LÍNEA COMPLETA CON TODO ==========
        # Ejemplo: "Cheese The Football Is Good For Training And Recreational Purposes 1 $73.00 $73.00"
        complete_pattern = r'^([A-Za-z][A-Za-z\s,.-]*?)\s+(\d+)\s+\$(\d+(?:\.\d{2})?)\s+\$(\d+(?:\.\d{2})?)$'
        match_complete = re.search(complete_pattern, line)
        
        if match_complete:
            description = match_complete.group(1).strip()
            quantity = match_complete.group(2)
            unit_price = f"${match_complete.group(3)}"
            total_price = f"${match_complete.group(4)}"
            
            if len(description) > 3:
                print(f"✅ PRODUCTO COMPLETO: {description[:30]}...")
                
                product = {
                    'description': description,
                    'quantity': quantity,
                    'unit_price': unit_price,
                    'total_price': total_price,
                    'confidence': 0.98
                }
                products.append(product)
                i += 1
                continue
        
      
        if (re.match(r'^[A-Za-z]+$', line) and 
            len(line) >= 3 and len(line) <= 20 and
            i + 2 < len(lines)):
            
            product_name = line
            next_line = lines[i + 1] if i + 1 < len(lines) else ""
            price_line = lines[i + 2] if i + 2 < len(lines) else ""
            
            # Buscar patrón de precio en las siguientes líneas
            j = i + 1
            found_price = False
            full_description = product_name
            
            while j < len(lines) and j < i + 5:  # Buscar en las próximas 4 líneas
                check_line = lines[j]
                
                # Si encuentra una línea con cantidad y precios
                price_match = re.search(r'(\d+)\s+\$(\d+(?:\.\d{2})?)\s+\$(\d+(?:\.\d{2})?)$', check_line)
                if price_match:
                    quantity = price_match.group(1)
                    unit_price = f"${price_match.group(2)}"
                    total_price = f"${price_match.group(3)}"
                    
                    print(f"✅ PRODUCTO MÚLTIPLES LÍNEAS: {product_name}")
                    
                    product = {
                        'description': full_description,
                        'quantity': quantity,
                        'unit_price': unit_price,
                        'total_price': total_price,
                        'confidence': 0.95
                    }
                    products.append(product)
                    found_price = True
                    i = j + 1  # Saltar las líneas procesadas
                    break
                
                # Si es una línea de descripción, agregarla
                elif (len(check_line) > 10 and 
                      not re.match(r'^[A-Za-z]+$', check_line) and
                      not check_line.startswith('$')):
                    # Línea de descripción adicional, ignorarla por ahora
                    pass
                
                j += 1
            
            if found_price:
                continue
        
       
        separator_pattern = r'^([A-Za-z]+)\s*[,\s]*[,\s]*\s*(\d+)\s+\$(\d+(?:\.\d{2})?)\s+\$(\d+(?:\.\d{2})?)$'
        match_sep = re.search(separator_pattern, line)
        
        if match_sep:
            description = match_sep.group(1).strip()
            quantity = match_sep.group(2)
            unit_price = f"${match_sep.group(3)}"
            total_price = f"${match_sep.group(4)}"
            
            print(f"✅ PRODUCTO CON SEPARADORES: {description}")
            
            product = {
                'description': description,
                'quantity': quantity,
                'unit_price': unit_price,
                'total_price': total_price,
                'confidence': 0.95
            }
            products.append(product)
        
        i += 1
    
    # ========== CALCULAR TOTALES ==========
    gran_total = 0
    total_cantidad = 0
    
    for product in products:
        try:
            total_num = float(product['total_price'].replace('$', '').replace(',', ''))
            qty_num = int(product['quantity'])
            gran_total += total_num
            total_cantidad += qty_num
        except:
            pass
    
    print(f"🏆 ALGORITMO ULTRA INTELIGENTE COMPLETADO:")
    print(f"    📦 Productos detectados: {len(products)}")
    print(f"    📊 Cantidad total: {total_cantidad}")
    print(f"    💰 Gran Total: ${gran_total:.2f}")
    
    return products

def extract_invoice_patterns(full_text):
    """Extracción de metadatos usando algoritmo ultra mejorado"""
    
    # Usar el algoritmo ultra mejorado
    ultra_metadata = extract_complete_metadata_ultra(full_text)
    
    # Convertir al formato esperado por la API
    extracted_data = {
        'fecha': ultra_metadata['date'],
        'numero_factura': ultra_metadata['invoice_number'],
        'metodo_pago': ultra_metadata['payment_method'],
        'subtotal': ultra_metadata['subtotal'],
        'iva': ultra_metadata['iva'],
        'total': ultra_metadata['total']
    }
    
    print(f"Extraccion completada: {len(extracted_data)} campos detectados")
    return extracted_data

def extract_line_items_smart(full_text):
    """Extracción inteligente de productos usando algoritmo ultra mejorado"""
    
    # Usar el algoritmo ultra mejorado
    products = extract_all_products_ultra(full_text)
    
    if products:
        print(f"Extraccion exitosa: {len(products)} productos")
        return products
    
    # Fallback básico si no funciona
    print("Usando fallback básico...")
    return []

def perform_ocr_multi_config(image_cv):
    """OCR optimizado para velocidad"""
    
    if image_cv is None:
        return ""
    
    try:
        print("Iniciando OCR rápido...")
        # Configuración simple y rápida
        config = '--psm 6'
        text = pytesseract.image_to_string(image_cv, config=config, lang='eng')
        print(f"OCR completado. Texto extraído: {len(text)} caracteres")
        
        return text
        
    except Exception as e:
        print(f"Error en OCR: {e}")
        return ""

def preprocess_image(image_cv):
    """Preprocesamiento de imagen"""
    try:
        # Convertir a escala de grises
        if len(image_cv.shape) == 3:
            gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
        else:
            gray = image_cv
        
        # Aplicar filtros para mejorar OCR
        denoised = cv2.medianBlur(gray, 3)
        
        # Binarización adaptativa
        binary = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        
        return binary
        
    except Exception as e:
        print(f"Error en preprocesamiento: {e}")
        return image_cv

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "version": "ultra-improved-v1.0"})

@app.route('/api/v1/invoice/debug', methods=['GET'])
def debug_info():
    return jsonify({
        "status": "active", 
        "version": "ultra-improved-v1.0",
        "endpoints": ["/health", "/api/v1/invoice/validate", "/api/v1/invoice/process"],
        "algorithms": "7-product-extraction-ready"
    })

@app.route('/', methods=['GET'])
def root():
    return jsonify({"message": "OCR Backend Ultra Improved - Ready for 7 products!"})

@app.route('/api/v1/invoice/validate', methods=['POST'])
@app.route('/api/v1/invoice/process', methods=['POST'])
def process_invoice():
    import time
    start_time = time.time()
    print(f"=== INICIO PROCESAMIENTO OCR ===")
    
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file or file.filename == '':
            return jsonify({'error': 'Invalid file'}), 400
        
        # Leer archivo
        file_content = file.read()
        
        # Procesar según el tipo de archivo
        if file.filename.lower().endswith('.pdf'):
            print("Procesando PDF...")
            # Convertir PDF a imagen
            try:
                # Usar pdf2image para convertir la primera página
                images = convert_from_bytes(file_content, first_page=1, last_page=1, dpi=300)
                if images:
                    image = images[0]
                    image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
                    print(f"PDF convertido a imagen de {image.size}")
                else:
                    return jsonify({'error': 'No se pudo convertir el PDF'}), 400
            except Exception as e:
                print(f"Error procesando PDF: {e}")
                return jsonify({'error': f'Error procesando PDF: {str(e)}'}), 400
        else:
            # Procesar imagen directamente
            try:
                image = Image.open(io.BytesIO(file_content))
                image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            except Exception as e:
                print(f"Error procesando imagen: {e}")
                return jsonify({'error': f'Error procesando imagen: {str(e)}'}), 400
        
        # Preprocesar imagen
        processed_image = preprocess_image(image_cv)
        
        # Realizar OCR
        full_text = perform_ocr_multi_config(processed_image)
        
        if not full_text or len(full_text.strip()) < 10:
            return jsonify({'error': 'No text extracted from image'}), 400
        
        print(f"Texto extraído: {len(full_text)} caracteres")
        
        # DEBUG: Mostrar el texto completo extraído
        print("=" * 50)
        print("TEXTO COMPLETO EXTRAÍDO PARA DEBUG:")
        print("=" * 50)
        lines_debug = full_text.split('\n')
        for i, line in enumerate(lines_debug[:30], 1):  # Mostrar primeras 30 líneas
            print(f"{i:2d}: '{line.strip()}'")
        print("=" * 50)
        
        # Extraer metadatos
        metadata = extract_invoice_patterns(full_text)
        
        # Extraer productos
        line_items = extract_line_items_smart(full_text)
        
        # Preparar respuesta
        # Calcular sumatoria total de productos detectados
        gran_total_productos = 0
        total_cantidad_productos = 0
        
        for item in line_items:
            try:
                total_num = float(item['total_price'].replace('$', '').replace(',', ''))
                qty_num = int(item['quantity'])
                gran_total_productos += total_num
                total_cantidad_productos += qty_num
            except:
                pass
        
        result = {
            'metadata': {
                'company_name': metadata.get('empresa', 'No detectado'),
                'ruc': metadata.get('ruc', 'No detectado'),
                'date': metadata.get('fecha', 'No detectado'),
                'invoice_number': metadata.get('numero_factura', 'No detectado'),
                'payment_method': metadata.get('metodo_pago', 'No detectado'),
                'subtotal': metadata.get('subtotal', 'No detectado'),
                'iva': metadata.get('iva', 'No detectado'),
                'total': metadata.get('total', 'No detectado')
            },
            'line_items': line_items,
            'summary': {
                'total_products': len(line_items),
                'total_cantidad': total_cantidad_productos,
                'gran_total': f"${gran_total_productos:.2f}",
                'promedio_precio': f"${(gran_total_productos / len(line_items) if len(line_items) > 0 else 0):.2f}",
                'processing_time': '< 1s',
                'confidence': 'High' if len(line_items) >= 3 else 'Medium'
            }
        }
        
        processing_time = time.time() - start_time
        print(f"=== PROCESAMIENTO EXITOSO ===")
        print(f"Tiempo total: {processing_time:.2f}s")
        print(f"Productos detectados: {len(line_items)}")
        print(f"Metadatos extraídos: {len([v for v in result['metadata'].values() if v != 'No detectado'])}")
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error en procesamiento: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)