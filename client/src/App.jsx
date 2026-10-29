import { useState } from "react";
import AppRoutes from "./routes/app.routes.jsx";
import Loader from "./components/ui/Loader.jsx";

export default function App() {
  const [pageRevealed, setPageRevealed] = useState(false);

  return (
    <>
      <Loader
        once={false}
        minDuration={2600}
        onStartReveal={() => setPageRevealed(true)}
      />

      <div
        className={`min-h-screen transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          pageRevealed
            ? "opacity-100 scale-100 translate-y-0 filter-none"
            : "opacity-0 scale-[0.985] translate-y-2 blur-[3px]"
        }`}
      >
        <AppRoutes />
      </div>
    </>
  );
}
