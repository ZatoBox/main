from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from google import genai
from google.genai import types
from pydantic import BaseModel
import os
from typing import Optional, List
import httpx
from dotenv import load_dotenv
import json

# Cargar variables de entorno desde .env
load_dotenv()

# Configurar cliente Gemini API
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Modelo de Gemini para OCR
model = "gemini-1.5-flash"

app = FastAPI(
    title="ZatoBox OCR API",
    description="API para procesamiento de imágenes con Gemini AI",
)


# Modelo para respuesta JSON
class OCRResponse(BaseModel):
    text: str
    confidence: Optional[float] = None
    language: Optional[str] = None
    products: Optional[List[dict]] = None


@app.post("/ocr")
async def process_image(file: UploadFile = File(...)):
    """
    Endpoint para procesar imagen y extraer texto usando Gemini
    """
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
@app.post("/bulk-products")
async def connect_to_other_endpoint(data: OCRResponse):
    """
    Endpoint para enviar los datos procesados al endpoint de products
    """
    try:
        # Lógica para conectar con endpoint de products
        products_to_create = data.products if data.products else []

        async with httpx.AsyncClient() as http_client:
            backend_url = os.environ.get("BACKEND_URL")
            response = await http_client.post(
                f"{backend_url}/api/products/bulk", json=products_to_create
            )

        return {
            "status": "success",
            "endpoint_response": (
                response.json() if response.status_code == 200 else response.text
            ),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error conectando al endpoint: {str(e)}"
        )
