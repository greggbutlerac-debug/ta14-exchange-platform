import type { CorpusRecord } from './corpus-merged';
import { CORPUS_FAMILIES, type CorpusFamilyId } from './corpus-families';
import { getPrimaryFamily, getRelatedFamilies } from './corpus-family-classification';

type RelatedFamilyBadgesProps = {
  record: CorpusRecord;
  onSelectFamily?: (familyId: CorpusFamilyId) => void;
};

export default function RelatedFamilyBadges({ record, onSelectFamily }: RelatedFamilyBadgesProps) {
  const primaryId = getPrimaryFamily(record) as CorpusFamilyId;
  const relatedIds = getRelatedFamilies(record) as CorpusFamilyId[];
  const primary = CORPUS_FAMILIES.find((item) => item.id === primaryId);
  const related = relatedIds
    .map((id) => CORPUS_FAMILIES.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
      {primary && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={labelStyle}>PRIMARY FAMILY</span>
          <button
            type="button"
            onClick={() => onSelectFamily?.(primary.id)}
            style={{ ...badgeStyle, borderColor: '#f5c76b', color: '#ffe39a' }}
            title={`Primary architecture family: ${primary.title}`}
          >
            {primary.title}
          </button>
        </div>
      )}

      {related.length > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={labelStyle}>RELATED FAMILIES</span>
          {related.map((family) => (
            <button
              key={family.id}
              type="button"
              onClick={() => onSelectFamily?.(family.id)}
              style={badgeStyle}
              title={`Related architecture family: ${family.title}`}
            >
              {family.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.5,
  color: '#70ddff',
  opacity: 0.78,
} as const;

const badgeStyle = {
  border: '1px solid #31546c',
  borderRadius: 999,
  background: 'rgba(8, 28, 43, .9)',
  color: '#a9ecff',
  padding: '6px 10px',
  fontSize: 11,
  fontWeight: 800,
  lineHeight: 1.2,
  cursor: 'pointer',
} as const;
