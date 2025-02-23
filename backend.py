from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import torch  
import cv2
import pytesseract

import traceback
from pdf2image import convert_from_bytes
import os
import re
import base64
import io
from pathlib import Path
import pandas as pd  
from dotenv import load_dotenv
import sys
import yaml
import json
import uuid

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR / 'yolov5'))  

try:
    from utils.general import non_max_suppression
except ImportError:
    non_max_suppression = None  
app = Flask(__name__)

NGROK_URL = os.getenv("NEXT_PUBLIC_API_URL", "")
ENV = os.getenv("FLASK_ENV", "production")

allowed_origins = [
    "http://127.0.0.1:3000",  # Localhost para desarrollo
    "https://web-navy-nine.vercel.app",  # App en Vercel
    "https://*.ngrok-free.app"  # Dominios de ngrok
]

if NGROK_URL:
    allowed_origins.append(NGROK_URL)  # URL dinámica de ngrok

if ENV == "development":
    CORS(app, resources={r"/*": {"origins": ["https://*.ngrok-free.app", "https://web-navy-nine.vercel.app/ocr"]}}, supports_credentials=True)

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    print("CORS configurado para desarrollo (orígenes: *)")
else:
   
 @app.after_request
 def add_cors_headers(response):
    """
    Agregar encabezados CORS adicionales para asegurar compatibilidad.
    """
    origin = request.headers.get("Origin")
    if origin and origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response



MODEL_PATH = Path('/home/yesenia/Escritorio/react/Alcolab/Web/backend/backup-backend-ocr.git/yolov5/runs/train/exp_retrain/weights/best.pt')
DATA_PATH = BASE_DIR / 'datasets/data.yaml'

print(f"Ruta esperada de data.yaml: {DATA_PATH}")  # Debugging



if not MODEL_PATH.exists():
    print(f"ERROR: El modelo no existe en la ruta: {MODEL_PATH}")
    exit(1)

    if not MODEL_PATH.exists():
        print(f"ERROR: El modelo no existe en la ruta: {MODEL_PATH}")
    exit(1)

    if not DATA_PATH.exists():
        print(f"ERROR: No se encontro el archivo de configuracion: {DATA_PATH}")
        print("Usando fallback de clases en código.")
        exit(1)


if DATA_PATH.exists():
    print(f"✅ Archivo data.yaml encontrado en: {DATA_PATH}")
    try:
        with open(DATA_PATH, 'r') as file:
            yaml_content = yaml.safe_load(file)
            classes = yaml_content.get('names', [])  # Obtener nombres de clases
            if classes:
                print(f"✅ Clases cargadas correctamente: {classes}")
            else:
                print("⚠️ WARNING: No se encontraron clases en el YAML.")
    except yaml.YAMLError as e:
        print(f"⚠️ ERROR al leer el YAML: {e}")
        classes = []
else:
    print(f"❌ ERROR: No se encontró el archivo de clases en {DATA_PATH}")
    classes = []


pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
TESSDATA_DIR = '/usr/share/tesseract-ocr/5/tessdata/'
os.environ['TESSDATA_PREFIX'] = TESSDATA_DIR

print(f"Tesseract versión: {pytesseract.get_tesseract_version()}")
print(f"TESSDATA_PREFIX: {os.environ.get('TESSDATA_PREFIX')}")


DATA_PATH = BASE_DIR / 'datasets/data.yaml'


if not DATA_PATH.exists():
    print("Usando fallback de clases en código.")
    classes = {0: 'logo', 1: 'R.U.C', 2: 'numero_factura', 3: 'fecha_hora',
               4: 'razon_social', 5: 'cantidad', 6: 'descripcion', 7: 'precio_unitario',
               8: 'precio_total', 9: 'subtotal', 10: 'iva',11: 'Descripcion', 12: 'Cantidad', 13: 'unidades', 14: 'unidad', 15: 'Cajas_cantidad', 16: 'Articulo', 17: 'Nombre_del_producto'}
    print(f"Clases por defecto: {classes}")
    print(f"Clases cargadas desde YAML: {classes}")
    print(f"Ruta esperada de data.yaml: {DATA_PATH}")

else:
     with open(DATA_PATH, 'r') as file:
        classes = yaml.safe_load(file).get('names', {})
     print(f"Clases cargadas desde YAML: {classes}")

try:
    model = torch.hub.load(
        str(BASE_DIR / "yolov5"),  
        "custom",
        path=str(MODEL_PATH),
        source="local"
    )

    print("✅ Modelo YOLOv5 cargado correctamente")
    print("📌 Clases del modelo:", model.names)
except Exception as e:
    print(f"❌ Error al cargar el modelo YOLOv5: {e}")
    exit(1)


def allowed_file(filename):
    return ('.' in filename and 
            filename.rsplit('.', 1)[1].lower() in 
            {'png','jpg','jpeg','tiff','bmp','pdf'})

def detect_sections(image):
    try:
        results = model(image)
        df = results.pandas().xyxy[0]
        print("🔍 Detecciones YOLOv5:", df) 
        df['name'] = df['class'].apply(lambda c: classes[int(c)] if int(c) < len(classes) else f'Clase_{int(c)}')
        return df
    except Exception as e:
        print(f"Error en YOLOv5: {e}")
        return pd.DataFrame(columns=['xmin', 'ymin', 'xmax', 'ymax', 'confidence', 'class', 'name'])

def detect_sections_plan_b(image_bgr):
    """
    PLAN B: Se llama cuando 'model(image)' falla en producción.
    1) Convertir BGR a Tensor
    2) Llamar al modelo => salida bruta
    3) Non-Max-Suppression => Nx6
    4) Convertir a DataFrame => columns=[xmin,ymin,xmax,ymax,confidence,class]
       + name
    """
    if non_max_suppression is None:
        print("No se pudo importar non_max_suppression. Actualiza tu 'yolov5'.")
        # Retorna un DF vacío
        return pd.DataFrame(columns=['xmin','ymin','xmax','ymax','confidence','class','name'])

    if len(image_bgr.shape) == 3 and image_bgr.shape[2] == 3:
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    else:
        image_rgb = image_bgr
    image_rgb = cv2.resize(image_rgb, (640,640), interpolation=cv2.INTER_LINEAR)

    image_tensor = torch.from_numpy(image_rgb).float().permute(2,0,1).unsqueeze(0)/255.0

    with torch.no_grad():
        raw_preds = model(image_tensor) 

    nms = non_max_suppression(raw_preds, conf_thres=0.25, iou_thres=0.45)
    if not nms or nms[0] is None or len(nms[0])==0:
        print("Detecciones YOLOv5 (Plan B): vacio")
        df = pd.DataFrame(columns=['xmin','ymin','xmax','ymax','confidence','class','name'])
        return df

    pred = nms[0].cpu().numpy()  
    df = pd.DataFrame(
        pred, 
        columns=['xmin','ymin','xmax','ymax','confidence','class']
    )
    df['name'] = df['class'].apply(lambda c: classes.get(int(c), f'class_{int(c)}'))
    print("Detecciones YOLOv5 (Plan B) => DF:\n", df)
    return df

def assign_column(bb, x_desc_max=900, x_cant_max=1200):
    clase = bb["class"].lower()
    x_center = (bb["xmin"] + bb["xmax"]) / 2

   
    if clase in ["cantidad", "Cantidad"]:
        return "cantidad"
    elif clase in ["precio", "precio_unitario", "precio_total"]:
        return "precio"
    elif clase in ["descripcion", "Descripcion"]:
        return "descripcion"
   
    
    if x_center < x_desc_max:
        return "descripcion"
    elif x_center < x_cant_max:
        return "cantidad"
    else:
        return "precio"



def group_bboxes_by_rows_and_cols(bboxes, row_tol=15, x_desc_max=900, x_cant_max=1200):
    """
    bboxes: lista de dict con:
      {
        'class': 'descripcion' (u otra),
        'text': 'Texto OCR…',
        'confidence': 0.95,
        'xmin': ...,
        'ymin': ...,
        'xmax': ...,
        'ymax': ...
      }
    row_tol: tolerancia vertical para agrupar en filas
    x_desc_max, x_cant_max: límites X para separar las columnas

    return: lista final de dicts:
       [ { 'descripcion':..., 'cantidad':..., 'precio':..., 'confidence':...}, ... ]
    """

    filtered = []
    for bb in bboxes:
        cls = bb["class"].lower()
        if cls in ["logo", "r.u.c", "ruc", "fecha_hora", "numero_factura", "razon_social"]:
           
            continue
        filtered.append(bb)
    if not filtered:
        return []

    
    for bb in filtered:
        bb['y_center'] = (bb['ymin'] + bb['ymax']) / 2

    # 2) Ordenar por y_center ascendente
    bboxes_sorted = sorted(filtered, key=lambda b: b['y_center'])

    rows = []
    # Agrupamos la 1a fila
    current_row = [bboxes_sorted[0]]
    rows = [current_row]
    current_row_center = bboxes_sorted[0]['y_center']

    # 3) Recorrer el resto
    for bb in bboxes_sorted[1:]:
        if abs(bb['y_center'] - current_row_center) < row_tol:
            current_row.append(bb)
            # (Opcional) recalcular center
            all_y = [b['y_center'] for b in current_row]
            current_row_center = sum(all_y) / len(all_y)
        else:
            current_row = [bb]
            rows.append(current_row)
            current_row_center = bb['y_center']

    # 4) Por cada fila => dict {descripcion, cantidad, precio, confidence}
    extracted_rows = []
    for fila_bb in rows:
        row_dict = {
            "descripcion": "",
            "cantidad": "",
            "precio": "",
            "confidence": 1.0
        }

        for bb in fila_bb:
            col = assign_column(bb, x_desc_max, x_cant_max)
            if col == "descripcion":
                row_dict["descripcion"] += bb["text"] + " "
            elif col == "cantidad":
                row_dict["cantidad"] += bb["text"] + " "
            else:
                row_dict["precio"] += bb["text"] + " "

           

        # Limpieza
        row_dict["descripcion"] = row_dict["descripcion"].strip() or "No detectado"
        row_dict["cantidad"]    = row_dict["cantidad"].strip()    or "No detectado"
        row_dict["precio"]      = row_dict["precio"].strip()      or "No detectado"

        extracted_rows.append(row_dict)

    return extracted_rows


def extract_text_from_roi(image, detections):
   
    bboxes = []
    for _, row in detections.iterrows():
        x_min, y_min, x_max, y_max = map(int, [row["xmin"], row["ymin"], row["xmax"], row["ymax"]])
        roi = preprocess_image(image[y_min:y_max, x_min:x_max])
        text_ocr = pytesseract.image_to_string(roi, config="--psm 6", lang="spa").strip()
        text_ocr = re.sub(r"[^\w\d\s.,-]", "", text_ocr).strip()

        bboxes.append({
            "class": row["name"],  
            "text": text_ocr,
            "confidence": row["confidence"],
            "xmin": x_min,
            "ymin": y_min,
            "xmax": x_max,
            "ymax": y_max
        })

   
    final_rows = group_bboxes_by_rows_and_cols(bboxes,
                    row_tol=15, x_desc_max=700, x_cant_max=1200)

    return final_rows
 

def mark_detections(image, detections):
    """Dibuja las cajas de detección en la imagen y las devuelve para el frontend"""
    if image is None or image.size == 0:
        return None

    for _, row in detections.iterrows():
        x_min, y_min, x_max, y_max = map(int, [row['xmin'], row['ymin'], row['xmax'], row['ymax']])
        class_name = row['name']
        confidence = row['confidence']

        cv2.rectangle(image, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
        cv2.putText(image, f"{class_name} ({confidence:.2f})", (x_min, y_min - 10), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

    return image



def image_to_base64(image):

    """Convierte la imagen a formato Base64 solo si es válida."""
    if image is None or image.size == 0:
        print("⚠ Advertencia: La imagen está vacía, se devuelve un valor por defecto.")
        return None  
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')


def preprocess_image(image):
    """Preprocesa la imagen para mejorar la detección del OCR"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convertir a escala de grises
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)  # Reducir ruido con desenfoque
    thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)  
    return thresh

def detect_table(image):
    """Detecta líneas de la tabla para extraer celdas"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, minLineLength=50, maxLineGap=10)
    
    mask = np.zeros_like(gray)
    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line[0]
            cv2.line(mask, (x1, y1), (x2, y2), 255, 2)
    
    kernel = np.ones((3,3), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=1)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    bounding_boxes = [cv2.boundingRect(cnt) for cnt in contours]
    bounding_boxes = sorted(bounding_boxes, key=lambda x: (x[1], x[0]))
    return bounding_boxes

def extract_text_from_table(image):
    """Extrae texto de cada celda de la tabla"""
    table_cells = detect_table(image)
    extracted_data = []
    for (x, y, w, h) in table_cells:
        roi = image[y:y+h, x:x+w]
        text = pytesseract.image_to_string(roi, config='--psm 6', lang='spa').strip()
        extracted_data.append({"x": x, "y": y, "text": text})
    return extracted_data


def normalize_text(text):
    text = re.sub(r'[^\w\d\s.,-]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def process_detected_regions(image, detections):
    """Procesa las regiones detectadas, extrayendo texto y clasificando correctamente las cantidades"""
    extracted_data = []
    detected_values = {
        "cantidad": [],
        "descripcion": []
    }

    for _, row in detections.iterrows():
        cls_id = int(row['class'])
        cls_name = classes.get(cls_id, f'class_{cls_id}')
        
        x_min, y_min, x_max, y_max = map(int, [row['xmin'], row['ymin'], row['xmax'], row['ymax']])
        roi = image[y_min:y_max, x_min:x_max]
        preprocessed_roi = preprocess_image(roi)

        try:
            text = pytesseract.image_to_string(preprocessed_roi, config='--psm 6', lang='spa').strip()
            text = normalize_text(text)

            if re.search(r'\b(Cant\.?|Cantidad)\b', text, re.IGNORECASE):
                cls_name = "cantidad"

        
            if re.match(r'^\d+(\.\d+)?$', text):  
                if "precio" in cls_name.lower():  
                    continue 
                cls_name = "cantidad"
                detected_values["cantidad"].append(text)

            
            if re.match(r'^\$\d+(\.\d+)?$', text):  
                cls_name = "precio_unitario"

            extracted_data.append({
                "class": cls_name,
                "text": text,
                "confidence": row['confidence'],  
                "bbox": [x_min, y_min, x_max, y_max]
            })

        except Exception as e:
            extracted_data.append({"class": cls_name, "text": "Error OCR", "confidence": 0.0})

    return extracted_data

@app.route('/process-document', methods=['POST'])
def process_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'El nombre del archivo está vacío'}), 400
    
    image_bgr = None
    
    if file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
        try:
            image_bgr = cv2.cvtColor(np.array(Image.open(file.stream).convert('RGB')), cv2.COLOR_RGB2BGR)
        except Exception as e:
            return jsonify({'error': f'Error procesando la imagen: {e}'}), 500
    
    elif file.filename.lower().endswith('.pdf'):
        try:
            images = convert_from_bytes(file.read())
            if not images:
                return jsonify({'error': 'No se pudo convertir el PDF en imágenes'}), 400
            image_bgr = cv2.cvtColor(np.array(images[0]), cv2.COLOR_RGB2BGR)
        except Exception as e:
            return jsonify({'error': f'Error procesando el PDF: {e}'}), 500
    else:
        return jsonify({'error': 'Tipo de archivo no soportado'}), 400

    detections = detect_sections(image_bgr)
    data = extract_text_from_roi(image_bgr, detections)
    

    marked_image = mark_detections(image_bgr, detections)
    image_base64 = image_to_base64(marked_image)

    return jsonify({'data': data, 'image': image_base64}), 200
    
@app.route('/save-document-changes', methods=['POST'])
def save_document_changes():
    try:
        req_data = request.get_json()
        print("DEBUG => req_data:", req_data)  
        rows = req_data.get("rows", [])
        invoice_number = req_data.get("invoiceNumber", "SIN_NRO")
        
        file_path = "data_invoices.json"
        print("File path =>", file_path)
        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                f.write("{}")

        with open(file_path, "r+") as f:
            existing_data = json.load(f)
            existing_data[invoice_number] = rows
            f.seek(0)
            json.dump(existing_data, f, indent=2)
            f.truncate()

        return jsonify({"message": "Cambios guardados con éxito"}), 200
    except Exception as e:
        print("Error guardando cambios:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/get-orders', methods=['GET'])
def get_orders():
    try:
        file_path = "orders.json"
        if not os.path.exists(file_path):
         
            return jsonify([]), 200

        with open(file_path, "r") as f:
            data = json.load(f)
        return jsonify(data), 200
    except Exception as e:
        print("Error al leer orders.json:", e)
        return jsonify({"error": "No se pudo cargar las órdenes"}), 500
    

@app.route("/archive-invoice", methods=["POST"])
def archive_invoice():
    try:
        raw_data = request.get_data(as_text=True)
        print("DEBUG => raw_data:", repr(raw_data))
        data = request.json
        print("DEBUG => data:", data)

        file_path = "orders.json"
      
        if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
            with open(file_path, "w") as f:
                json.dump([], f)

      
        val_total = data.get("total", 999.99)
        if val_total is None:
            val_total = 999.99  

        with open(file_path, "r+") as f:
            orders = json.load(f)
            new_id = str(uuid.uuid4())

            new_order = {
                "id": new_id,
                "fecha": data.get("fecha", "Fecha Desconocida"),
                "proveedor": data.get("proveedor", "Proveedor Desconocido"),
                "total": val_total,
                "estado": data.get("estado", "Pendiente"),
                "acciones": ["Ver Factura", "Ver Recepción"],
                "lineas": data.get("lineas", [])
            }

            orders.append(new_order)
            f.seek(0)
            json.dump(orders, f, indent=2)
            f.truncate()

        return jsonify({"message": "Factura archivada con éxito"}), 200

    except Exception as e:
        print("Error archivando factura:", e)
        return jsonify({"error": str(e)}), 500   


@app.route('/get-order/<string:order_id>', methods=['GET'])
def get_order(order_id):
    try:
        file_path = "orders.json"
        if not os.path.exists(file_path):
            return jsonify({"error": "No hay órdenes"}), 404

        with open(file_path, "r") as f:
            orders = json.load(f) 

       
        order = next((o for o in orders if o["id"] == order_id), None)
        if not order:
            return jsonify({"error": "Orden no encontrada"}), 404

        return jsonify(order), 200
    except Exception as e:
        print("Error al leer orders.json:", e)
        return jsonify({"error": str(e)}), 500


    
        

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
