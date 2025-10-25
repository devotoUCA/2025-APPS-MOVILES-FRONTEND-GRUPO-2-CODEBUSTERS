# MindGarden Frontend 🌱

Aplicación móvil de gestión de tareas y bienestar desarrollada con Expo y React Native.

## 🚀 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar conexión con el backend

Antes de iniciar la app, necesitás configurar la URL del backend en el archivo `config/api.ts`.

**Si usás Expo Go en tu celular:**

1. Abrí el archivo `config/api.ts`
2. Cambiá `192.168.0.184` por la **IP de tu computadora**
3. Para saber tu IP:
   - **Windows**: Abrí CMD y ejecutá `ipconfig` (buscá "IPv4")
   - **Mac/Linux**: Abrí Terminal y ejecutá `ifconfig` (buscá "inet")
```typescript
// config/api.ts
const API_CONFIG = {
  BASE_URL: 'http://TU_IP_AQUI:3000/api', // Ejemplo: http://192.168.1.100:3000/api
};
```

⚠️ **Importante:** Tu celular y tu computadora deben estar en la misma red WiFi.

**Si usás un emulador:**

- **Android**: podés usar `http://10.0.2.2:3000/api`
- **iOS**: podés usar `http://localhost:3000/api`

### 3. Iniciar el servidor backend

Antes de correr el frontend, asegurate de tener el backend corriendo. En la carpeta del backend ejecutá:
```bash
npm run dev
```

### 4. Iniciar la app
```bash
npx expo start
```

En la terminal verás opciones para abrir la app en:

- [Expo Go](https://expo.dev/go) (recomendado para desarrollo rápido)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)

## 📱 Desarrollo

Podés empezar a desarrollar editando los archivos dentro del directorio **app**. Este proyecto usa [file-based routing](https://docs.expo.dev/router/introduction).

## 🗂️ Estructura principal
```
├── app/
│   └── (tabs)/
│       └── agenda.tsx      # Pantalla de tareas
├── components/
│   └── task.tsx            # Componente de tarea
├── hooks/
│   └── useTasks.ts         # Lógica de conexión con backend
└── config/
    └── api.ts              # ⚙️ Configuración de URL del backend
```

## 🔄 Reiniciar el proyecto

Si querés empezar con un proyecto limpio:
```bash
npm run reset-project
```

Este comando mueve el código inicial a **app-example** y crea un directorio **app** vacío.

## ❓ Problemas comunes

### La app no se conecta al backend

1. Verificá que el backend esté corriendo (`npm run dev` en la carpeta del backend)
2. Revisá que la IP en `config/api.ts` sea correcta
3. Asegurate de que tu celular y tu compu estén en la misma WiFi
4. Probá abrir `http://TU_IP:3000/api/tasks` en el navegador de tu celular

### No veo las tareas

1. Verificá que el backend tenga datos (ejecutá `npm run seed` en el backend)
2. Recargá la app (presioná `r` en la terminal de Expo)
3. Revisá la consola de Expo para ver si hay errores

## 📚 Recursos

- [Documentación de Expo](https://docs.expo.dev/)
- [Tutorial de Expo](https://docs.expo.dev/tutorial/introduction/)
- [Expo en GitHub](https://github.com/expo/expo)
- [Discord de Expo](https://chat.expo.dev)

## 👥 Equipo

**Grupo 2 - CodeBusters**  
Universidad Católica Argentina  
Programación de Aplicaciones Móviles - 2025

---

💡 **Tip:** Mantené tanto el backend como el frontend corriendo al mismo tiempo en terminales separadas.