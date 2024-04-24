import { AppProps } from "next/app";
import "../globals.css";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <h1>Header</h1>
      <Component {...pageProps} />
    </div>
  );
}
