# Prueba Técnica: Estrategia de Liberación de Órdenes (Formato JSON Completo)

## 1. Objetivo

Diseñar la lógica para asignar automáticamente una estrategia de liberación a una orden, garantizando que:

- Cada orden tenga como máximo una estrategia aplicable,
- No existan estrategias que se solapen,
- El sistema pueda determinar de forma consistente qué estrategia corresponde a una orden al momento de su creación.

---

## 2. Entendimiento del problema

Una orden se crea con tres datos obligatorios:

- empresa
- tag
- usuario creador

Una estrategia se configura con esos mismos tres criterios, pero todos son opcionales:

- empresa
- tag
- usuario creador

Si un criterio en la estrategia no está definido (NULL), significa que aplica a todos los valores de esa dimensión.

**Interpretación clave**

- Una orden es un caso concreto.
- Una estrategia es una regla de clasificación.
- El sistema no usa estrategias para “buscar órdenes”, sino para determinar qué estrategia le corresponde a una orden.

---

## 3. Supuestos del análisis

1. Las estrategias se crean previamente por usuarios de negocio o administradores.
2. La asignación de estrategia ocurre al crear la orden.
3. Los valores NULL en estrategia significan “comodín” o “aplica a todos”.
4. No se permite que dos estrategias cubran una misma combinación (empresa, tag, usuario).
5. Puede existir el caso de que una orden no tenga estrategia aplicable.
6. Si una consulta de asignación retorna más de una estrategia, eso debe considerarse error de integridad.
7. El análisis está enfocado en lógica funcional y persistencia, no en interfaz ni seguridad.

---

## 4. Modelo de datos

### Estrategia

|   Campo    |   Tipo   | Requerido |           Descripcion            |
| :--------: | :------: | :-------: | :------------------------------: |
|     id     |   uuid   |    Si     |       Identificador único        |
|  empresa   |  string  |    No     |    NULL = todas las empresas     |
|    tag     |  string  |    No     |      NULL = todos los tags       |
|  usuario   |  string  |    No     |    NULL = todos los usuarios     |
|   activa   | boolean  |    Si     | Permite deshabilitar lógicamente |
| created_at | datetime |    Si     |        Fecha de creación         |

### Orden

|     Campo     |   Tipo   | Requerido |           Descripcion            |
| :-----------: | :------: | :-------: | :------------------------------: |
|      id       |   uuid   |    Si     |       Identificador único        |
|    empresa    |  string  |    Si     |       Empresa de la orden        |
|      tag      |  string  |    Si     |         Tag de la orden          |
|    usuario    |  string  |    Si     |    Usuario que creo la orden     |
| estrategia_id |   uuid   |    No     | Permite deshabilitar lógicamente |
|  created_at   | datetime |    Si     |        Fecha de creación         |

### Relacion

- Una orden puede tenet **0 o 1** estrategia asignada
- Una estrategia puede estar asociada a muchas ordenes

`estrategias (1) ---- (0..n) ordenes`

La asignación se resuelve en el momento de creación de la orden y se persiste en _ordenes.estrategia_id_.

---

## 5. Reglas de negocio

### 5.1 Aplicabilidad de estrategia

Una estrategia aplica a una orden si todos los campos definidos en la estrategia coinciden con la orden.

Ejemplos:

- Estrategia `(empresa=AndinaLog, tag=NULL, usuario=NULL)` aplica a cualquier orden de **AndinaLog**.
- Estrategia `(empresa=MarAzul, tag=Exportacion, usuario=NULL)` aplica a cualquier orden de **MarAzul** con tag **Exportacion**

### 5.2 Regla crítica: No Solapamiento

No se permiten estrategias que se pisen.

Dos estrategias se solapan si existe al menos una combinación (empresa, tag, usuario) que haga match con ambas.

**Consecuencia**

Solo se puede crear una estrategia nueva si su cobertura es disjunta de todas las existentes.

### 5.3 Estrategia Global

La estrategia:

`empresa = NULL  
tag = NULL  
usuario_creador = NULL`

aplica a todas las órdenes.

**Por lo tanto** si existe una estrategia global, no se puede crear ninguna otra,
y si ya existe cualquier estrategia, no se puede crear la global.

### 5.4 Resultado de asignación

Al crear una orden, el resultado posible es:

- 1 estrategia encontrada → se asigna.
- 0 estrategias encontradas → orden sin estrategia.
- Más de 1 estrategia encontrada → error de integridad, no debería pasar si la validación de alta de estrategia fue correcta.

---

## 6. Lógica de solapamiento

Dos estrategias A y B se solapan si, en cada dimensión, ocurre alguna de estas condiciones:

`A.valor es NULL, o  
B.valor es NULL, o  
A.valor = B.valor`

Y esto debe cumplirse simultáneamente para:

- empresa
- tag
- usuario

Fórmula conceptual
`matchCampo(A, B) =  
  A.campo IS NULL  
  OR B.campo IS NULL  
  OR A.campo = B.campo`

---

## 5. Validación en base de datos

SELECT 1
FROM estrategias e
WHERE e.activa = true
AND (e.empresa IS NULL OR :empresa IS NULL OR e.empresa = :empresa)
AND (e.tag IS NULL OR :tag IS NULL OR e.tag = :tag)
AND (e.usuario IS NULL OR :usuario IS NULL OR e.usuario = :usuario)
LIMIT 1;

---

## 6. Asignación de estrategia

SELECT \*
FROM estrategias e
WHERE e.activa = true
AND (e.empresa IS NULL OR e.empresa = :empresa)
AND (e.tag IS NULL OR e.tag = :tag)
AND (e.usuario IS NULL OR e.usuario = :usuario);

---

## 7. Flujo del sistema

1. Crear estrategia → validar que no se solape
2. Crear orden
3. Buscar estrategia aplicable
4. Asignar estrategiaId
5. Guardar orden

---

## 8. Pseudocódigo

createStrategy(json):
if existsOverlap(json):
error
insert

assignStrategy(order):
results = query(order)
if 0 → null
if >1 → error
return results[0]

createOrder(order):
strategy = assignStrategy(order)
order.strategyId = strategy?.id
insert

---

## 9. Casos de prueba

### Caso válido

E1: {empresa: A}
E2: {empresa: B}

### Caso inválido

E1: {empresa: A}
E2: {empresa: A, tag: X}

### Caso asignación

Orden: {empresa: A, tag: X}
→ E1

### Caso sin estrategia

Orden: {empresa: C}
→ null

### Caso error

E1: {empresa: A}
E2: {tag: X}
Orden: {empresa: A, tag: X}
→ error

---

## 10. Conclusión

Las estrategias funcionan como filtros que particionan el espacio de órdenes.
El sistema garantiza asignación única y sin ambigüedad usando validación en BD y queries eficientes.

```

```
