#  Mutant DNA Detector

Sistema de análisis genético para identificación de secuencias mutantes en cadenas de ADN humano.

---

##  Sobre el Proyecto

Esta aplicación web permite analizar matrices de ADN de 6x6 para determinar si un individuo presenta características genéticas mutantes. El criterio de clasificación se basa en la detección de patrones repetitivos de bases nitrogenadas.

### Criterios de Mutación

Un sujeto es clasificado como **mutante** cuando su ADN contiene:
- Mínimo 2 secuencias con 4 bases idénticas consecutivas
- Direcciones válidas: Horizontal (→), Vertical (↓), Diagonal derecha (↘), Diagonal izquierda (↙)
- Bases permitidas: Adenina (A), Timina (T), Citosina (C), Guanina (G)

---

##  Inicio Rápido

### Requisitos Previos
- Node.js (v18 o superior)
- npm (incluido con Node.js)

### Pasos de Instalación

1. **Instalar las dependencias del proyecto:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   ```

3. **Acceder a la aplicación:**  
   Abre tu navegador en: `http://localhost:4200/`

---

##  Guía de Uso

### Interfaz de Usuario

La aplicación ofrece tres formas de interactuar con la matriz de ADN:

| Opción | Descripción |
|--------|-------------|
| **Ejemplo Mutante** | Carga automáticamente un ADN con patrón mutante |
| **Ejemplo No Mutante** | Carga un ADN sin suficientes secuencias mutantes |
| **Entrada Manual** | Permite ingresar base por base manualmente |

### Flujo de Análisis

1. Completa la matriz con bases nitrogenadas (A, T, C, G)
2. Presiona "Analizar ADN"
3. El sistema mostrará:
   - ✅ **Humano Normal** si no cumple criterios de mutante
   - 🦠 **Mutante Detectado** con detalles de secuencias encontradas

---

##  Arquitectura del Código

```
mutante/
└── src/
    └── app/
        ├── app.component.ts           → Controlador principal
        ├── app.component.html         → Vista y plantilla
        ├── app.component.css          → Estilos de interfaz
        ├── mutant.service.ts          → Motor de análisis genético
        └── mutant.service.spec.ts     → Suite de pruebas
```

### Componentes Clave

- **AppComponent**: Gestiona el estado de la aplicación y la interacción del usuario con formularios reactivos
- **MutantService**: Implementa el algoritmo de detección y validación de secuencias

---

##  Implementación del Algoritmo

### Función Principal

```typescript
isMutant(dna: string[]): boolean
```

### Lógica de Detección

El algoritmo emplea una estrategia de búsqueda optimizada:

1. **Recorrido eficiente**: Analiza cada posición como punto de inicio
2. **Búsqueda direccional**: Evalúa 4 direcciones desde cada celda
3. **Terminación temprana**: Detiene la búsqueda al encontrar 2 secuencias
4. **Validación previa**: Verifica formato antes del análisis

### Caso de Prueba

```typescript
const sampleDNA = [
  "ATGCGA",
  "CAGTGC",
  "TTATGT",
  "AGAAGG",
  "CCCCTA",
  "TCACTG"
];

const result = mutantService.isMutant(sampleDNA);
// Resultado: true (detecta CCCC horizontal + secuencias diagonales)
```

---

##  Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Angular | 19 | Framework principal |
| TypeScript | 5.x | Lenguaje de programación |
| Reactive Forms | - | Gestión de estado del formulario |
| CSS3 | - | Diseño visual |

---

##  Control de Calidad

### Validaciones Implementadas

- ✓ Restricción de caracteres (solo A, T, C, G)
- ✓ Conversión automática a mayúsculas
- ✓ Un solo carácter por celda
- ✓ Verificación de matriz completa
- ✓ Dimensiones fijas 6x6

### Ejecutar Tests

```bash
npm test
```

---

##  Características Visuales

- Códificación por colores de bases nitrogenadas
- Resaltado de celdas con secuencias mutantes
- Diseño responsive
- Mensajes de error descriptivos
- Interfaz intuitiva

---

##  Notas de Desarrollo

Este proyecto utiliza:
- **Standalone Components** (Angular 19+)
- **Formularios Reactivos** para mejor control del estado
- **Subscripciones reactivas** para validación en tiempo real
- **Optimización de rendimiento** con estrategia de detección temprana

Los tests verifican:
- Detección correcta de mutantes
- Detección correcta de no mutantes  
- Validación de formatos incorrectos
- Casos específicos del enunciado
