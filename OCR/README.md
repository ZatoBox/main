# ZatoBox OCR API

API para procesamiento de imágenes usando Gemini AI y devolución de texto en formato JSON.

## Instalación

1. Clona o navega al directorio del proyecto
2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Crea un archivo `.env` en el directorio del proyecto con tu API key:
   ```
   GEMINI_API_KEY=tu_clave_aqui
   ```

## Ejecución

```bash
uvicorn main:app --reload
```

La API estará disponible en `http://localhost:8000`

## Endpoints

- `GET /`: Información básica de la API
- `POST /ocr`: Procesa una imagen y devuelve el texto extraído
  - Parámetro: `file` (imagen a procesar)
  - Respuesta: JSON con el texto extraído
- `POST /connect-to-endpoint`: Envía los datos procesados a otro endpoint
  - Parámetro: `data` (OCRResponse)
  - Respuesta: Resultado del envío

## Documentación Interactiva

Visita `http://localhost:8000/docs` para la documentación interactiva de la API.

## Próximos Pasos

- Ajusta el modelo `OCRResponse` según tu formato JSON específico
- Modifica la ruta `/connect-to-endpoint` para apuntar a tus endpoints existentes
- Agrega validaciones adicionales y manejo de errores
- Implementa autenticación si es necesario

## Dependencias

- FastAPI: Framework web moderno para Python
- Uvicorn: Servidor ASGI para FastAPI
- Google GenAI: SDK para Gemini
- Python Multipart: Para manejo de archivos subidos
- Pydantic: Validación de datos
- HTTPX: Cliente HTTP asíncrono
- Python Dotenv: Para cargar variables de entorno desde .env
