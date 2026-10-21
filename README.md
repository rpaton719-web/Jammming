# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Spotify setup

Create a Spotify app and add the app's redirect URI to its Spotify Dashboard settings. For local development, the default redirect URI is `http://localhost:5173/`.

Create a `.env.local` file in the project root and set the Spotify app's client ID:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

If your registered redirect URI differs from the current origin followed by `/`, set it explicitly:

```env
VITE_SPOTIFY_REDIRECT_URI=https://your-app.example/
```

Restart the development server after changing environment variables. The app uses Spotify's Authorization Code with PKCE flow; do not put a client secret in this browser-based app.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
