import { createDirectus, rest, authentication } from '@directus/sdk';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
  .with(rest())
  .with(authentication());

export default directus;