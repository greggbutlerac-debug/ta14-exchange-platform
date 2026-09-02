import Link from 'next/link';
import styles from './atlas-environmental-integrity-fund-strip.module.css';

const features = [
  ['✓', 'Evidence-bound allocation', 'Qualifying allocations are created only where applicable written terms and payment records support them.'],
  ['↗', 'Mission preferences', 'Eligible participants can direct where qualifying benefit should go.'],
  ['🔒', 'Participant records', 'Eligible annual and cumulative allocation records can be made available privately.'],
  ['◇', 'Recognition', 'Any qualifying recognition remains tied to preserved allocation evidence.'],
];

export function AtlasEnvironmentalIntegrityFundStrip() {
  return (
    <aside className={styles.panel} aria-label="TA-14 Environmental Integrity Reinvestment">
      <div className={styles.inner}>
        <div>
          <div className={styles.eyebrow}>
            <span className={styles.badge}><span className={styles.dot} />Environmental Integrity Reinvestment</span>
            <span className={styles.verified}>Evidence-bound program terms</span>
          </div>

          <div className={styles.rates}>
            <div className={styles.rateCard}>
              <span className={styles.rateNumber}>30%</span>
              <span className={styles.rateText}><strong>Standard qualifying rate</strong><span>Where written program terms apply</span></span>
            </div>
            <div className={`${styles.rateCard} ${styles.secondary}`}>
              <span className={styles.rateNumber}>50%</span>
              <span className={styles.rateText}><strong>Up to this level</strong><span>By qualifying municipal agreement</span></span>
            </div>
          </div>

          <p className={styles.description}>
            Qualifying paid TA-14 products and services may create environmental-integrity allocations when the applicable written program terms or contract designate the payment as qualifying. Any participant allocation, mission preference, record, or recognition remains bounded to those terms and the preserved payment and allocation evidence.
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
          <div className={styles.municipalLabel}>Municipal allocation ceiling</div>
          <div className={styles.municipalNumber}>50%</div>
          <div className={styles.municipalTitle}>Up to this level by qualifying agreement</div>
          <p className={styles.municipalCopy}>
            A municipal allocation exists only where the governing agreement designates a qualifying payment and allocation. Eligible allocations may be directed toward community environmental-integrity priorities, including schools and other public environments.
          </p>
          <div className={styles.municipalRule}>
            <strong>At sufficient scale:</strong> a qualifying municipal reinvestment may help finance Environmental Integrity or AIR infrastructure only to the extent the actual agreement, contract value, scope, costs, authority, payment record, and allocation evidence support it.
          </div>
        </div>
      </div>

      <div className={styles.bottomNote}>
        <span><strong>Program rule, then evidence.</strong> No allocation or verification is implied merely by viewing this page; each qualifying allocation must be supported by its applicable terms and preserved record.</span>
        <Link href="/atlas-environmental-integrity-fund">Review the program boundary →</Link>
      </div>
    </aside>
  );
}
