import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * The main entry point of the React application.
 *
 * It finds the root element in the DOM (with id "root") and renders the `App` component into it.
 */
createRoot(document.getElementById("root")!).render(<App />);
