# User Stories: Piece, Styles, and Materials Implementation

## Contexto
Se requiere enriquecer el modelo de datos de los diseños para incluir información estructurada sobre la prenda base (Piece), estilos (Styles) y materiales utilizados (Materials). Esto mejorará la categorización, búsqueda y visualización de los diseños upcycled.

## User Stories

### Creación de Diseño
1. **Selección de Prenda (Piece)**
   - **Como** diseñador,
   - **Quiero** seleccionar el tipo de prenda base (Piece) de una lista predefinida (ej. Jacket, Pants) al crear un nuevo diseño,
   - **Para** categorizar correctamente mi diseño desde el inicio.
   - *Criterios de Aceptación*: Campo obligatorio, selección única (Select).

2. **Selección de Estilos (Styles)**
   - **Como** diseñador,
   - **Quiero** seleccionar uno o más estilos (Styles) que representen mi diseño (ej. Retro, Punk),
   - **Para** comunicar mejor la estética de mi creación.
   - *Criterios de Aceptación*: Selección múltiple, búsqueda dentro de opciones.

3. **Selección de Materiales (Materials)**
   - **Como** diseñador,
   - **Quiero** seleccionar los materiales utilizados (Materials) de una lista (ej. Denim, Leather),
   - **Para** especificar detalladamente la composición de mi diseño.
   - *Criterios de Aceptación*: Selección múltiple, búsqueda dentro de opciones.

### Edición de Diseño
4. **Modificación de Campos**
   - **Como** diseñador,
   - **Quiero** poder modificar la Prenda, Estilos y Materiales de un diseño existente,
   - **Para** corregir errores o actualizar la información.
   - *Criterios de Aceptación*: El formulario de edición debe precargar los valores actuales y permitir cambios idénticos al flujo de creación.

### Visualización y Listado
5. **Visualización en Detalle**
   - **Como** usuario (visitante o diseñador),
   - **Quiero** ver la Prenda, Estilos y Materiales en la página de detalle del diseño,
   - **Para** entender mejor las características del producto.
   - *Criterios de Aceptación*: Mostrar los nombres de los tags (badges o texto) en la UI de detalle.

6. **Visualización en Listado**
   - **Como** diseñador,
   - **Quiero** ver la Prenda y/o Materiales principales en mi tabla de diseños,
   - **Para** identificar rápidamente mis diseños.
   - *Criterios de Aceptación*: Actualizar la columna de materiales para usar los nuevos objetos estructurados.

## Tareas Técnicas Frontend (Draft)
- [ ] Actualizar interfaces TypeScript (`Design`, `Piece`, `Style`, `Material`).
- [ ] Crear componentes de UI para selectores (Single y Multi Select) integrados con `react-hook-form`.
- [ ] Refactorizar `CreateDesignForm` para consumir endpoint `/options` y enviar IDs.
- [ ] Refactorizar `EditDesignForm` para manejar la carga inicial de relaciones y actualización.
- [ ] Actualizar `DesignDetails` para renderizar los nuevos datos.
- [ ] Actualizar `DesignsTable` para manejar la nueva estructura de datos.
