export default function Head() {
  const title = 'Cross-Architecture Admissible Execution | TA-14 Flagship Founding Showcase';
  const description = 'TA-14 founding showcase connecting ONUMA / RE1 interoperability, identity contradiction, changed-context revalidation, U.S. Application 19/794,767, and the prospective PAE operating-building boundary.';
  const canonical = 'https://www.ta14exchange.com/registry/ta-14-admissible-execution-architecture/showcase/cross-architecture-revalidation';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="TA-14 Exchange" />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
