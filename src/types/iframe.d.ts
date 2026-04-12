import 'react';

declare module 'react' {
  interface IframeHTMLAttributes<T> {
    scrolling?: string;
  }
}
