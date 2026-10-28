import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-900 px-6 text-center">
      <p className="font-mono text-xs text-flag">error 404</p>
      <h1 className="mt-3 text-3xl font-semibold text-mist-100 md:text-4xl">
        This route didn't pass verification.
      </h1>
      <p className="mt-3 max-w-sm text-mist-500">
        Nothing here matched a known path. Head back and try again.
      </p>
      <Button as={Link} to="/" variant="verify" className="mt-8">
        Back to home
      </Button>
    </div>
  );
}
