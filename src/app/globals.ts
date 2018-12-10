import { environment } from 'environments/environment';

// Description of membership types
export const membershipTypes = [
  {
    name: 'player',
    description: 'Interested in jamming, collaborating, or recording.',
  },
  {
    name: 'performer',
    description: 'Interested in performing music at concerts and events.',
  },
  {
    name: 'producer',
    description: 'Interested in bringing musical projects to life.',
  },
  {
    name: 'professional',
    description: 'Interested in helping creators present their music in a professional way.',
  },
  {
    name: 'patron',
    description: 'Interested in supporting musicians and sharing their music.',
  }
];

// Presets for skill tag dropdowns
export const instrumentPresets = ['Guitar', 'Piano', 'Keys', 'Bass', 'Saxophone', 'Trumpet', 'Drums', 'Percussion', 'Vocals', 'Trombone'];
export const genrePresets = ['Country', 'Rock', 'Jazz', 'Gospel', 'Metal', 'Pop', 'Acoustic'];
export const skillPresets = ['Audio Engineering', 'Pro Tools', 'Networking', 'Songwriting'];
export const resourcePresets = ['Event Space', 'Home Studio'];

const isProduction = (environment.production && window.location.hostname !== 'home--dev.herokuapp.com');

let stripePubKey,
  algolia;

if (isProduction) {
  stripePubKey = 'pk_live_cBf4BHYamd9C2UcM9RZIGQwc';
  algolia = {
    appId: 'RA4VK9L0IS',
    apiKey: '3cf8484c140b8f9e10ff08029d0cf5de'
  };

} else {
  stripePubKey = 'pk_test_78NxbjI1CGpfOb4C11H1xmXs';
  algolia = {
    appId: 'AQSGOWQQ0P',
    apiKey: '005190d747f11e226af8436cf8bb9015'
  };
}


export { stripePubKey };
export { algolia };

export const MembershipTiers = {
  COMMUNITY: 'community',
  CREATIVE: 'creative',
  COWRITE: 'cowrite',
  PRODUCTION: 'production',
  COWORK: 'cowork',
};
export const plans = {
  community: {
    title: 'Community Membership',
    price: 1000,
    id: 'community-1',
    metadata: { tier: MembershipTiers.COMMUNITY },
  },
  creative: {
    title: 'Creative Membership',
    price: 5000,
    id: 'creative-1',
    metadata: { tier: MembershipTiers.CREATIVE },
  },
  cowrite: {
    title: 'Creative + Cowrite',
    price: 8000,
    id: 'cowrite-1',
    metadata: { tier: MembershipTiers.COWRITE },
  },
  production: {
    title: 'Creative + Production',
    price: 10000,
    id: 'production-1',
    metadata: { tier: MembershipTiers.PRODUCTION },
  },
  cowork: {
    title: 'Creative + Cowork',
    price: 15000,
    id: 'cowork-1',
    metadata: { tier: MembershipTiers.COWORK },
  },
};

export const membershipTiers = Object.keys(plans);

export const sessionSettings = {
  // can book in 30 min increments
  increment: 0.5,
};

