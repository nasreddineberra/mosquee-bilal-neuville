import { ArrowBigRight } from 'lucide-react';

export default function CardCtaButton({ label }: { label: string }) {
  return (
    <span className="card-cta-btn" aria-hidden="true">
      <span className="sign">
        <ArrowBigRight strokeWidth={0} />
      </span>
      <span className="text">{label}</span>
    </span>
  );
}
