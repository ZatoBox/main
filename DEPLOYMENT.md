# Despliegue

Resumen corto:

- Este documento contiene los pasos para construir y publicar imágenes Docker y desplegarlas en producción.
- No contiene secretos; las variables se gestionan en el proveedor (Railway / Secrets Manager).

Requisitos previos:

- CI que construya y publique imágenes (ej. GitHub Actions → GHCR).
- Imágenes publicadas: `ghcr.io/<owner>/zato-backend:latest` y `ghcr.io/<owner>/zato-ocr:latest`.
- Variables de entorno configuradas en Railway (o secret manager del orquestador).

Pasos para build & push (local / CI):

- En CI (ya configurado): el workflow construye y publica las imágenes.
- Comandos de ejemplo (local, solo para pruebas):
  ```bash
      docker build -f Dockerfile.backend -t ghcr.io/<owner>/zato-backend:latest .
      docker build -f Dockerfile.ocr -t ghcr.io/<owner>/zato-ocr:latest .
      docker push ghcr.io/<owner>/zato-backend:latest
      docker push ghcr.io/<owner>/zato-ocr:latest
  ```

Despliegue en Railway (resumen):

- Crear proyecto/service en Railway.
- Seleccionar "Deploy from Docker Image" y pegar la URI de la imagen.
- Configurar variables de entorno en el panel del proyecto (PORT, DB, SECRET_KEY, etc.).
- Configurar health check y escalado según necesidad.

Producción (orquestadores / secretos):

- Para Swarm: usar Docker Secrets y `docker stack deploy` con docker-compose.prod.yml.
- Para Kubernetes: crear Secret con `kubectl create secret generic --from-env-file=...` y referenciar en los Deployments.
- No copiar `.env` en la imagen.

Rollback y verificación:

- Mantener tags por SHA o semver; para rollback solo cambiar a la imagen previa en Railway / orquestador.
- Añadir smoke checks: petición a `/health` tras desplegar.

Monitoreo y alertas:

- Registrar logs en un servicio centralizado o usar el panel del proveedor.
- Configurar alertas en errores críticos / healthcheck fail.

Contacto / notas:

- Variables requeridas: revisar `backend/zato-csm-backend/.env.example` y `OCR/.env.example`.
