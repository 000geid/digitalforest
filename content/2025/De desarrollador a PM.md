# El camino de los agentes

Te voy a contar el vertiginoso cambio que he enfrentado como programador en el último año. Si te interesa saber qué es un agente, dónde se consiguen, quién los vende, y sobre todo por qué puede que te “asciendan” al rol de PM más pronto de lo que crees, este artículo es para ti.

## El camino

En enero empecé a usar **[Cursor](https://www.cursor.com/)**, un editor de código impulsado por IA que combina navegación contextual, generación automática y consultas directas a la base de código. :contentReference[oaicite:0]{index=0} Durante enero y febrero lo usaba casi exclusivamente para hacerle preguntas a la codebase:

- ¿Dónde vive la lógica de este componente en el frontend?
- ¿Dónde se usan estas variables en la función?
- ¿Cuál es la payload que manda el frontend?

Intenté programar con estas primeras versiones de los modelos: Claude Sonnet 3.7, GPT-4, Gemini 2.5. Honestamente, los resultados eran malos: repetían código por todos lados, no tenían noción de cómo corría la codebase y, muchas veces, si no se les daba suficiente contexto, eran capaces de rehacer todo el proyecto desde primeros principios. En ese momento, los LLMs eran buenos en una sola tarea, pero necesitaban orquestación para ser realmente útiles.

Conforme fueron pasando los meses (marzo, abril, mayo…) el concepto de **agente** comenzó a surgir: un chat con capacidades adicionales. La siguiente pregunta naturalmente fue: ¿qué idioma va a utilizar? ¿qué protocolo? ¿HTTP? ¿WebSockets?

Anthropic propuso el **[Model Context Protocol (MCP)](https://en.wikipedia.org/wiki/Model_Context_Protocol)**, un estándar abierto para conectar modelos de IA con herramientas y servicios externos que permite integrar datos y acciones en tiempo real. :contentReference[oaicite:1]{index=1}

Un servidor MCP permite conectarte con Slack, Discord o con cualquier herramienta compatible. En entornos como Cursor, MCP se utiliza para conectar a servidores que proveen documentación actualizada o acciones de herramientas externas. :contentReference[oaicite:2]{index=2}

Comencé a utilizar servidores MCP junto al chat que usaba —que se estaba transformando lentamente en lo que hoy conozco como un agente—, en específico con **[Context7 MCP](https://github.com/upstash/context7)**, que inyecta documentación actualizada directamente en el contexto del modelo para reducir alucinaciones. :contentReference[oaicite:3]{index=3}

El chat iba ganando potencia; ahora era capaz de crear features casi autónomamente. Por supuesto, rompía la mitad de las funcionalidades ya existentes, por lo que había que entrar en un proceso de:

**Implementación → Inspección del código → Debugging → Verificación de regresiones**

Un poco engorroso, pero funcionaba.

Y fueron pasando los meses… junio, julio, agosto… Todas las empresas fueron desarrollando su propia versión de cómo se debería ver un agente de programación. Se abrieron tres caminos claros:

### Los forks de VS Code

Estas herramientas avanzadas construyeron sobre la base de Visual Studio Code para proporcionar ambientes agénticos completos, integrando soporte profundo para interacciones contextualizadas y multi-modelo.

### Los CLIs

Algunas propuestas decían que los agentes debían vivir en la terminal, lo que les dio una ventaja de **composición**: podían llamar a subagentes a demanda para orquestar múltiples tareas, aunque con una complejidad técnica más alta. En esta categoría se enceuntran:
- Codex, de OpenAI
- Claude Code, de Claude
- OpenCode, la alternativa de código abierto a estas dos

### Extensiones de VS Code

También surgieron extensiones que no redefinían todo el IDE, pero que añadían capacidades de agentes dentro del flujo tradicional de trabajo en VS Code.

Y, por supuesto, en la fiebre del oro de la inteligencia artificial, cabe preguntarse quién está vendiendo las palas. **OpenRouter** ofrece un API unificado para acceder a múltiples modelos de lenguaje desde una sola interfaz, simplificando la integración de herramientas y agentes con distintos proveedores sin tener que reconfigurar cada vez.

Independientemente de la herramienta que elijas, el flujo a seguir comenzó a estandarizarse en tres pasos:

1. **Preguntar:**  
   ¿Qué devuelve el endpoint `api/v1/customers`?

2. **Planear:**  
   Creamos un plan para agregar el campo `creation_date` a la payload de customers y especificamos tests para verificar que la salida sea correcta. En esta etapa casi siempre usaba MCP y Context7 para obtener información actualizada.

3. **Implementar:**  
   Implementamos el plan que creamos.

Una vez terminados los tres pasos, debugueábamos: ¿funciona como queríamos? ¿rompimos alguna funcionalidad antigua? Este ciclo te obliga a tener tests robustos para validar que nada quede roto. Cuando agregamos nueva funcionalidad, corremos los tests antiguos; si no pasan, ya tenemos información valiosa sobre qué investigar. Fácil, rápido y sostenible.

## El game-changer: Plan Mode de Cursor

Para mí, el momento en que los agentes de programación pudieron adjudicarse una autonomía respetable fue con el feature de **Plan Mode de Cursor**, introducido en **Cursor 2.0**. :contentReference[oaicite:4]{index=4} Este modo genera un plan de acción editable que puedes *Build* una vez satisfecho, lo que permitió:

- **Previsibilidad:** obtener resultados consistentes y modificables antes de aplicar cambios automáticos.
- **Modularidad:** usar modelos de mayor calidad para la planeación y modelos más económicos para la implementación.

Este feature salió con la versión más reciente de Cursor y reforzó el enfoque agéntico más allá de la simple programación asistida.

A partir de este momento me di cuenta de que mi rol como desarrollador estaba mutando. Por supuesto, es necesario entender el lenguaje de programación a alto y bajo nivel para crear software de calidad, pero la implementación en sí ya no era el cuello de botella. Las capacidades agénticas de las IDEs modernas permiten desplazar el enfoque hacia otros aspectos del rubro.

Si el *state of the art* sigue el curso actual, considero que en unos meses o años el rol del desarrollador de software va a mutar hacia el de un **product manager con conocimiento tecnológico**, con lo bueno y lo malo de la tarea. Habilidades clave en esta etapa:

### Requerimientos  
Hablar con usuarios, clientes y equipos para traducir ideas del cliente (“quiero que puedan dar like a los autos”) a requerimientos claros y compartidos por todos.

### Diseño de sistemas  
El diseño de sistemas resilientes y adaptables —considerando patrones de diseño y mejores prácticas— sigue siendo difícil de reemplazar por agentes.

Nota aparte: he visto que algunas personas insultan a su asistente cuando no hace lo que esperan. Me pregunto: ¿hasta qué punto es problema de la capacidad del LLM y hasta qué punto es falta de detalle del usuario? En cualquier caso, yo no insultaría a un desarrollador junior por hacer las cosas como mejor sabe hacerlo.

Es increíble ser testigo y usuario de esta época dorada para el software. Quizá así se sintieron las personas que trabajaban en textiles durante la Revolución Industrial… Ellos con el nacimiento del capitalismo industrial y nosotros con el del tecnofeudalismo.

A mí personalmente me viene perfecto. No soy el mejor trabajando en detalles finos de código, por lo que delegar esta “plomería digital” me permite centrar el esfuerzo mental en diseño, arquitectura, lógica de negocio… y jugar Minecraft un rato (el único juego que no es *pay-to-win* ni tiene sistema de progresiones abusivos).

A medida que los datasets de entrenamiento se especialicen y el desarrollo de LLMs reciba mayor financiación, creo que el rol de “programador” irá lentamente mutando hacia el de **PM técnico**. Algunos puntos a reflexionar sobre esta transición:

- ¿Pérdida o atrofia de habilidades duras o de bajo nivel?
- ¿Cómo puede aportar valor un desarrollador si la implementación se automatiza?
- ¿Qué nuevas responsabilidades deberíamos asumir?

Así que ten cuidado: hoy eres desarrollador de software, pero puede que mañana te levantes como PM.  
Cuando eso pase, asegúrate de pedir un aumento de salario apropiado.
