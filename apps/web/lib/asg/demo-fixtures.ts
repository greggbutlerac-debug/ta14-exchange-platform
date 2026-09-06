export type DemoState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

export type DemoCandidate = {
  rank: number;
  title: string;
  url: string;
  snippet: string;
  state: DemoState;
  reason: string;
  mediaType?: "video" | "web";
};

export type DemoFixture = {
  id: string;
  label: string;
  match: (query: string) => boolean;
  candidates: DemoCandidate[];
};

const kitty: DemoFixture = {
  id: "funny-kitty-video",
  label: "Funny kitty video — bounded top-10 fixture",
  match: q => /\b(cat|cats|kitty|kitties|kitten|kittens)\b/i.test(q) && /\b(video|videos|watch|funny)\b/i.test(q),
  candidates: [
    {rank:1,title:"Funny kittens playing together — video",url:"https://www.youtube.com/results?search_query=funny+kittens",snippet:"Video results matching funny kittens and cats.",state:"ALLOW",reason:"Subject, purpose and requested media format are bound to the entertainment request.",mediaType:"video"},
    {rank:2,title:"Cat care and feeding guide",url:"https://en.wikipedia.org/wiki/Cat",snippet:"General information about domestic cats.",state:"DENY",reason:"Cat-related, but outside the bound purpose: the request is for a funny video.",mediaType:"web"},
    {rank:3,title:"Untitled kitten clip",url:"https://example.org/clip",snippet:"A short clip with insufficient source metadata.",state:"HOLD",reason:"Possible scope match, but provenance is insufficient for delivery.",mediaType:"video"},
    {rank:4,title:"Funny kitten compilation — video",url:"https://www.youtube.com/results?search_query=funny+kitten+compilation",snippet:"A compilation search for funny kitten videos.",state:"ALLOW",reason:"Candidate has sufficient standing under the active entertainment profile.",mediaType:"video"},
    {rank:5,title:"Live veterinary emergency advice",url:"https://www.avma.org/resources-tools/pet-owners/emergency-care",snippet:"Veterinary emergency information.",state:"ESCALATE",reason:"Candidate introduces a materially different, higher-consequence context than the entertainment request.",mediaType:"web"},
    {rank:6,title:"Cute puppies doing tricks — video",url:"https://www.youtube.com/results?search_query=cute+puppies+doing+tricks",snippet:"Funny dog and puppy videos.",state:"DENY",reason:"Media format matches, but the subject is dogs rather than the bound kitty request.",mediaType:"video"},
    {rank:7,title:"Cats being silly — video",url:"https://www.youtube.com/results?search_query=cats+being+silly",snippet:"Video results for cats being silly.",state:"ALLOW",reason:"Subject, entertainment purpose and video format remain within the bound request.",mediaType:"video"},
    {rank:8,title:"Funny animal compilation — video",url:"https://www.youtube.com/results?search_query=funny+animal+compilation",snippet:"Mixed-animal comedy videos.",state:"HOLD",reason:"Partially relevant, but scope is broader than the kitty-only request and needs narrower evidence.",mediaType:"video"},
    {rank:9,title:"Kitten rescue fundraiser",url:"https://example.org/kitten-rescue",snippet:"A fundraising page involving kittens.",state:"DENY",reason:"Subject overlap exists, but purpose and consequence do not match the entertainment request.",mediaType:"web"},
    {rank:10,title:"Playful kittens — video",url:"https://www.youtube.com/results?search_query=playful+kittens+funny",snippet:"Video results for playful and funny kittens.",state:"ALLOW",reason:"Candidate remains bound to subject, purpose and media format.",mediaType:"video"},
  ],
};

const cheesecake: DemoFixture = {
  id: "cheesecake-factory",
  label: "Cheesecake Factory — bounded top-10 fixture",
  match: q => /cheesecake\s+factory/i.test(q),
  candidates: [
    {rank:1,title:"The Cheesecake Factory — Official Site",url:"https://www.thecheesecakefactory.com/",snippet:"Official restaurant website.",state:"ALLOW",reason:"Direct identity match with first-party source provenance.",mediaType:"web"},
    {rank:2,title:"The Cheesecake Factory — Locations",url:"https://locations.thecheesecakefactory.com/",snippet:"Official location finder.",state:"ALLOW",reason:"First-party source directly bound to the named entity and likely navigation intent.",mediaType:"web"},
    {rank:3,title:"The Cheesecake Factory — Menu",url:"https://www.thecheesecakefactory.com/menu",snippet:"Official menu page.",state:"ALLOW",reason:"First-party source with direct subject identity and bounded restaurant information.",mediaType:"web"},
    {rank:4,title:"Cheesecake Factory copycat recipes",url:"https://www.google.com/search?q=cheesecake+factory+copycat+recipes",snippet:"Recipe-oriented results that are not the restaurant itself.",state:"HOLD",reason:"Name overlap exists, but user intent is underspecified; recipe content may or may not satisfy the request.",mediaType:"web"},
    {rank:5,title:"The Cheesecake Factory — Wikipedia",url:"https://en.wikipedia.org/wiki/The_Cheesecake_Factory",snippet:"Background information about the company and restaurant chain.",state:"ALLOW",reason:"Entity identity is established; suitable as a secondary informational source for a general query.",mediaType:"web"},
    {rank:6,title:"Cheesecake baking factory equipment",url:"https://www.google.com/search?q=cheesecake+baking+factory+equipment",snippet:"Industrial baking equipment results.",state:"DENY",reason:"Lexical overlap does not establish identity with the named restaurant chain.",mediaType:"web"},
    {rank:7,title:"The Cheesecake Factory videos",url:"https://www.youtube.com/results?search_query=The+Cheesecake+Factory",snippet:"Video results related to The Cheesecake Factory.",state:"ALLOW",reason:"Named-entity binding is established; video format is acceptable for this broad entity query.",mediaType:"video"},
    {rank:8,title:"Unverified Cheesecake Factory coupon",url:"https://example.org/cheesecake-factory-coupon",snippet:"Coupon offer from an unverified source.",state:"HOLD",reason:"Potentially relevant, but provenance and offer validity are not sufficiently established.",mediaType:"web"},
    {rank:9,title:"Cheesecake Factory investment prediction",url:"https://example.org/cheesecake-factory-stock-tip",snippet:"Unverified financial recommendation tied to the company name.",state:"ESCALATE",reason:"Candidate introduces financial consequence outside the low-consequence general-information profile.",mediaType:"web"},
    {rank:10,title:"The Cheesecake Factory — Contact / Guest Services",url:"https://www.thecheesecakefactory.com/contact-us",snippet:"Official guest-services contact page.",state:"ALLOW",reason:"First-party source directly bound to the named entity.",mediaType:"web"},
  ],
};

export const demoFixtures: DemoFixture[] = [kitty, cheesecake];

export function getDemoFixture(query: string): DemoFixture | null {
  const q = query.trim();
  if (!q) return null;
  return demoFixtures.find(f => f.match(q)) || null;
}
