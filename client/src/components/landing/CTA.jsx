import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";

export default function CTA() {
  return (
    <section className="container-xl pb-28 pt-4">
      <div className="card relative overflow-hidden px-8 py-14 text-center md:px-16">
        {/* Dark moon purple ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.16),transparent_55%)]" />

        {/* Subtle violet edge glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative">
          <h2 className="mx-auto max-w-xl text-3xl font-semibold text-mist-100 md:text-4xl">
            Stop listing skills. Start proving them.
          </h2>

          <p className="mx-auto mt-4 max-w-md text-mist-300">
            Your first evaluated submission takes about ten minutes. Your
            profile does the talking after that.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              as={Link}
              to="/register"
              variant="verify"
              size="lg"
            >
              Create your profile
            </Button>

            <Button
              as={Link}
              to="/login"
              variant="ghost"
              size="lg"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}