'use client';

import { useEffect, useRef, useState } from 'react';

const SHARE_TITLE = 'TA-14 Exchange Platform';

const SHARE_TEXT =
  'Build, test, govern, preserve, verify, and independently replay consequential execution routes through the TA-14 Exchange.';

type ShareState = 'idle' | 'shared' | 'copied' | 'error';

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 8a3 3 0 1 0-2.83-4A3 3 0 0 0 15 5c0 .24.03.47.08.69l-6.2 3.1A3 3 0 0 0 6 7a3 3 0 1 0 2.88 3.82l6.2 3.1A3 3 0 0 0 15 15a3 3 0 1 0 .88-2.12l-6.2-3.1c.04-.18.07-.37.08-.56l6.2-3.1A3 3 0 0 0 18 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function resolveExchangeUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://ta14-exchange-platform-theta.vercel.app/';
  }

  return `${window.location.origin}/`;
}

async function copyToClipboard(value: string): Promise<void> {
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    window.isSecureContext
  ) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const temporaryInput = document.createElement('textarea');

  temporaryInput.value = value;
  temporaryInput.setAttribute('readonly', '');
  temporaryInput.style.position = 'fixed';
  temporaryInput.style.left = '-9999px';
  temporaryInput.style.top = '0';

  document.body.appendChild(temporaryInput);
  temporaryInput.select();

  const copied = document.execCommand('copy');

  document.body.removeChild(temporaryInput);

  if (!copied) {
    throw new Error('Unable to copy the Exchange URL.');
  }
}

export default function ShareExchangeButton() {
  const [shareState, setShareState] = useState<ShareState>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  function showTemporaryState(nextState: ShareState) {
    setShareState(nextState);

    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }

    resetTimer.current = setTimeout(() => {
      setShareState('idle');
    }, 2400);
  }

  async function handleShare() {
    const url = resolveExchangeUrl();

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url,
        });

        showTemporaryState('shared');
        return;
      }

      await copyToClipboard(url);
      showTemporaryState('copied');
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      try {
        await copyToClipboard(url);
        showTemporaryState('copied');
      } catch {
        showTemporaryState('error');
      }
    }
  }

  const buttonLabel =
    shareState === 'shared'
      ? 'Exchange shared'
      : shareState === 'copied'
        ? 'Exchange URL copied'
        : shareState === 'error'
          ? 'Unable to share'
          : 'Share Exchange';

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={buttonLabel}
      title="Share the TA-14 Exchange"
      style={{
        display: 'inline-flex',
        minHeight: '42px',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '9px',
        border: '1px solid rgba(104, 221, 255, 0.42)',
        borderRadius: '999px',
        padding: '10px 17px',
        background:
          shareState === 'shared' || shareState === 'copied'
            ? 'rgba(74, 222, 128, 0.12)'
            : 'linear-gradient(135deg, rgba(31, 111, 235, 0.18), rgba(18, 208, 255, 0.08))',
        color:
          shareState === 'error'
            ? '#fca5a5'
            : shareState === 'shared' || shareState === 'copied'
              ? '#86efac'
              : '#dff8ff',
        font: 'inherit',
        fontSize: '0.78rem',
        fontWeight: 800,
        letterSpacing: '0.08em',
        lineHeight: 1,
        textTransform: 'uppercase',
        cursor: shareState === 'error' ? 'not-allowed' : 'pointer',
        boxShadow:
          'inset 0 0 20px rgba(67, 191, 255, 0.04), 0 0 24px rgba(12, 176, 255, 0.06)',
        transition:
          'border-color 160ms ease, background 160ms ease, color 160ms ease, transform 160ms ease',
      }}
    >
      <ShareIcon />
      <span aria-live="polite">{buttonLabel}</span>
    </button>
  );
}
