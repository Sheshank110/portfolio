import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center section-container">
        <h1 className="font-heading text-8xl md:text-9xl font-bold text-border mb-4">
          404
        </h1>
        <p className="font-heading text-xl md:text-2xl text-text-primary mb-4">
          Page not found
        </p>
        <p className="text-text-secondary text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
