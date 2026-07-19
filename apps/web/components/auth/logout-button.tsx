import { logout } from '../../app/login/actions';

export function LogoutButton() {
  return (
    <form action={logout}>
      <button className="ta14-logout-button" type="submit">
        Sign out
      </button>

      <style>{`
        .ta14-logout-button {
          display: inline-flex;
          min-height: 38px;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border: 1px solid rgba(137, 174, 213, 0.17);
          border-radius: 999px;
          color: #cbd9e7;
          background: rgba(9, 19, 31, 0.68);
          cursor: pointer;
          font: inherit;
          font-size: 0.74rem;
          font-weight: 850;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .ta14-logout-button:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 126, 126, 0.42);
          background: rgba(62, 24, 29, 0.88);
        }

        .ta14-logout-button:focus-visible {
          outline: 2px solid #54e8ff;
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .ta14-logout-button {
            transition: none;
          }
        }
      `}</style>
    </form>
  );
}
