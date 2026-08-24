import Link from 'next/link';
import styles from './atlas-environmental-integrity-fund-strip.module.css';

const features = [
  ['✓', 'Verified allocation', 'Participant allocations are tied to actual qualifying payments.'],
  ['↗', 'Mission preferences', 'Eligible participants can direct where qualifying benefit should go.'],
  ['🔒', 'Private verification', 'Annual and cumulative records can be verified privately.'],
  ['◇', 'Recognition', 'Qualifying recognition is tied to actual allocation evidence.'],
];

export function AtlasEnvironmentalIntegrityFundStrip() {
  return (
    <aside className={styles.panel} aria-label="TA-14 Environmental Integrity Reinvestment">
      <div className={styles.inner}>
        <div>
          <div className={styles.eyebrow}>
            <span className={styles.badge}><span className={styles.dot} />Environmental Integrity Reinvestment</span>
            <span className={styles.verified}>Verified participant allocation</span>
          </div>

          <div className={styles.rates}>
            <div className={styles.rateCard}>
              <span className={styles.rateNumber}>30%</span>
              <span className={styles.rateText}><strong>Standard qualifying</strong><span>Environmental reinvestment</span></span>
            </div>
            <div className={`${styles.rateCard} ${styles.secondary}`}>
              <span className={styles.rateNumber}>50%</span>
              <span className={styles.rateText}><strong>Up to this level</strong><span>Qualifying municipal deployments</span></span>
            </div>
          </div>

          <p className={styles.description}>
            Qualifying paid TA-14 products and services can create recurring environmental-integrity allocations. Participants can direct eligible mission preferences and receive private verification, annual and cumulative records, and qualifying recognition tied to actual allocation evidence.
          </p>

          <div className={styles.features}>
            {features.map(([icon, title, body]) => (
              <div className={styles.feature} key={title}>
                <span className={styles.featureIcon}>{icon}</span>
                <strong>{title}</strong>
                <span>{body}</span>
              </div>
            ))}
          </div>

          <Link href="/atlas-environmental-integrity-fund" className={styles.cta}>
            See the reinvestment model <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.municipal}>
          <div className={styles.municipalLabel}>Municipal allocation</div>
          <div className={styles.municipalNumber}>50%</div>
          <div className={styles.municipalTitle}>Up to this level by agreement</div>
          <p className={styles.municipalCopy}>
            Qualifying municipal allocations can be directed toward eligible community environmental-integrity priorities, including schools and other public environments.
          </p>
          <div className={styles.municipalRule}>
            <strong>At sufficient scale:</strong> municipal reinvestment can help finance—and potentially fully finance—qualifying Environmental Integrity or AIR infrastructure where the actual contract value, scope, costs, authority, and evidence support it.
          </div>
        </div>
      </div>

      <div className={styles.bottomNote}>
        <span><strong>Public promise, private proof.</strong> Participants can verify their own qualifying allocation without TA-14 publishing company-wide commercial performance.</span>
        <Link href="/atlas-environmental-integrity-fund">Learn how it works →</Link>
      </div>
    </aside>
  );
}
