from fastapi import FastAPI, File, UploadFile, HTTPException, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from pydantic import BaseModel
import os
from typing import Optional, List
import httpx
from dotenv import load_dotenv
import json
import time
from collections import defaultdict

# Cargar variables de entorno desde .env
load_dotenv()

# Configurar cliente Gemini API
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Modelo de Gemini para OCR
model = "gemini-1.5-flash"

# Rate limiting: 5 minutos entre peticiones por usuario
RATE_LIMIT_SECONDS = 300  # 5 minutos
user_last_request = defaultdict(float)

app = FastAPI(
    title="ZatoBox OCR API",
    description="API para procesamiento de imágenes con Gemini AI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Modelo para respuesta JSON
class OCRResponse(BaseModel):
    text: str
    confidence: Optional[float] = None
    language: Optional[str] = None
    products: Optional[List[dict]] = None


@app.post("/ocr")
async def process_image(
    file: UploadFile = File(...), authorization: str = Header(None)
):
    """
    Endpoint para procesar imagen y extraer texto usando Gemini
    """
    # Rate limiting: verificar si el usuario puede hacer la petición
    user_id = "anonymous"
    if authorization:
        # Usar el token como identificador único del usuario
        user_id = (
            authorization.replace("Bearer ", "")
            if authorization.startswith("Bearer ")
            else authorization
        )

    current_time = time.time()
    last_request_time = user_last_request[user_id]

    if current_time - last_request_time < RATE_LIMIT_SECONDS:
        remaining_time = int(RATE_LIMIT_SECONDS - (current_time - last_request_time))
        raise HTTPException(
            status_code=429,
            detail=f"Demasiadas peticiones. Debes esperar {remaining_time} segundos antes de hacer otra petición OCR.",
        )

    # Actualizar el timestamp de la última petición
    user_last_request[user_id] = current_time

    try:
        # Validar tipo de archivo
        allowed_types = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/webp",
            "application/pdf",
        ]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, detail="El archivo debe ser PNG, JPG, JPEG, WEBP o PDF"
            )

        # Leer datos de la imagen
        image_data = await file.read()

        # Procesar con Gemini
        prompt = os.environ.get("OCR_PROMPT")
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt),
                    types.Part.from_bytes(data=image_data, mime_type=file.content_type),
                ],
            )
        ]
        response = client.models.generate_content(model=model, contents=contents)

        extracted_text = response.text.strip()

        # Limpiar si viene en bloque de código Markdown
        if extracted_text.startswith("```json"):
            extracted_text = extracted_text[7:]
        if extracted_text.endswith("```"):
            extracted_text = extracted_text[:-3]
        extracted_text = extracted_text.strip()

        # Intentar parsear como JSON
        try:
            result = json.loads(extracted_text)
            if isinstance(result, list):
                products = result
            elif isinstance(result, dict):
                if "productos" in result:
                    products = result["productos"]
                else:
                    products = [result]
            else:
                products = None
            return OCRResponse(
                text=extracted_text, confidence=0.95, language="es", products=products
            )
        except json.JSONDecodeError:
            # Si no es JSON válido, devolver como texto
            return OCRResponse(
                text=extracted_text,
                confidence=0.95,
                language="es",
            )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error procesando la imagen: {str(e)}"
        )


@app.get("/")
async def root():
    return {"message": "ZatoBox OCR API con Gemini"}


# Conexión a products endpoint
@app.post("/bulk")
async def connect_to_other_endpoint(
    data: OCRResponse, authorization: str = Header(None)
):
    """
    Endpoint para enviar los datos procesados al endpoint de products
    """
    try:
        # Lógica para conectar con endpoint de products
        products_to_create = data.products if data.products else []

        headers = {}
        if authorization:
            token = (
                authorization.replace("Bearer ", "")
                if authorization.startswith("Bearer ")
                else authorization
            )
            headers["Authorization"] = f"Bearer {token}"

        async with httpx.AsyncClient() as http_client:
            backend_url = os.environ.get("BACKEND_URL")
            response = await http_client.post(
                f"{backend_url}/api/products/bulk",
                json=products_to_create,
                headers=headers,
            )

        return {
            "status": "success" if response.status_code == 200 else "error",
            "response_status": response.status_code,
            "endpoint_response": (
                response.json() if response.status_code == 200 else response.text
            ),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error conectando al endpoint: {str(e)}"
        )
