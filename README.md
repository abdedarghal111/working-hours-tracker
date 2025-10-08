# Working Hours Tracker

<p align="center">
    <img src="https://raw.githubusercontent.com/abdedarghal111/working-hours-tracker/refs/heads/main/assets/icon.png" alt="App icon" width="200">
</p>

Un sencillo pero potente tracker de horas de trabajo construido con Electron, React, TypeScript y Bootstrap.
Simple but powerfull hours tracker / time tracker builded with Electron, Solid.js, Typescript and Bootstrap.

## Motivación

Esta aplicación nació de la necesidad personal de automatizar y simplificar el registro de las horas de trabajo. En lugar de depender de métodos manuales, quería una herramienta que me permitiera iniciar, pausar y detener un contador de tiempo fácilmente, guardando un historial de todas las sesiones para futuras consultas.

## Características

- **Control del tiempo:** Controla tu tiempo con un solo clic.
- **Gestión de Pausas:** Pausa y reanuda el temporizador tantas veces como necesites.
- **Historial de Sesiones:** Revisa todas tus sesiones de trabajo anteriores.
- **Portable:** Diseñada para funcionar como aplicación portable.
- **Datos independientes:** Si existen los datos los carga y son fáciles de rescatar y mover a otra instalación.
- **Persistente:** Si en cualquier comento se cierra la aplicación se renaura automáticamente al volver a inciarse manteniendo el tracking.

## Comandos

**Testeado en windows.** Recomiendo usar el ejecutable win-unpacked y crear un acceso directo para la mejor experiencia.

```bash
# Instalar dependencias
yarn install

# Ejecutar en modo de desarrollo
yarn dev

# Compilar para Windows
# tienes que activar el modo desarrollador en los ajustes para que no te de "error de simlinks"
yarn build:win

# Compilar para macOS
yarn build:mac

# Compilar para Linux
yarn build:linux

# output en /dist
```
