# Backend Questions & Requests

## Contexto
Implementación frontend de los campos: Piece, Styles, Materials.

## Preguntas / Dudas
1. **Validaciones de Integridad**: ¿La API validará que los IDs enviados (piece_id, style_ids, material_ids) existan en los catálogos? ¿Qué error retorna si un ID es inválido?
2. **Campos Opcionales/Requeridos**:
    - Se asume `piece_id` es obligatorio.
    - ¿Son `style_ids` y `material_ids` obligatorios o pueden ser listas vacías?
    - En el payload, si no se envían styles/materials, ¿se asume vacío o se requiere enviar `[]` explícitamente?

## Pedidos / Ajustes Sugeridos
1. **Payload de Update (PUT)**: Confirmar que el endpoint `PUT /api/v1/designs/{id}` acepta el mismo payload que el POST para estos campos, reemplazando las relaciones existentes por completo (estrategia full replacement para many-to-many).
2. **Ordenamiento**: Sería útil que el endpoint `/options` retorne las listas ordenadas alfabéticamente por nombre para facilitar la visualización en los selectores.
3. **Seed Data**: Confirmar si los datos de prueba actuales en dev incluyen variedad suficiente de Pieces, Styles y Materials para probar bordes (nombres largos, categorías vacías, etc).

## Respuestas del Backend (2025-12-21)

Se ha recibido confirmación del equipo de backend:

1.  **Validaciones**:
    -   IDs de estilos/materiales inválidos son ignorados silenciosamente (silent skip).
    -   ID de pieza inválido provoca error 500 (se mejorará a 400).
2.  **Opcionales/Requeridos**:
    -   `piece_id`: Requerido.
    -   `styles`/`materials`: Opcionales (default `[]`).
3.  **Payload POST/PUT**:
    -   Confirmado reemplazo completo de relaciones.
    -   Acepta payload idéntico.
4.  **Ordenamiento**:
    -   El endpoint `/options` retorna listas ya ordenadas (Categoría, Luego Nombre).
