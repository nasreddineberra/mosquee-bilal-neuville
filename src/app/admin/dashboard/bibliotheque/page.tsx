'use client';

import { Image as ImageIcon } from 'lucide-react';
import ImageLibrary from '@/components/ImageLibrary';

export default function BibliothequeAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Bibliothèque d&apos;images</h1>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <ImageLibrary columns={5} />
      </div>
    </div>
  );
}
