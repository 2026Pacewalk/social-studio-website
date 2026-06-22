import bcrypt from 'bcryptjs';
import db from './db.js';

const PORTFOLIO = [
  ['Crimson Royalty', 'Weddings', '2025', 'Bridal couture editorial — regal jewellery and hand-crafted lehenga under a crimson glow.', '/assets/portfolio/wedding-seated.jpg', 'wide'],
  ['Audi Q8 Unveiled', 'Automobile', '2025', 'Outdoor showcase shoot for Audi Chandigarh — powered by Social Studios & Social Theory.', '/assets/portfolio/auto-audi-q8.jpg', 'wide'],
  ['Tied in Gold', 'Jewelry', '2025', 'Macro product photography of a gold bow ring styled on flowing silk.', '/assets/portfolio/jewelry-ring.jpg', 'square'],
  ['Sculpted in Light', 'Fashion', '2025', 'High-fashion portrait on a sculpted blue set — where beauty meets the lens.', '/assets/portfolio/fashion-white-dress.jpg', 'tall'],
  ['Grand Living', 'Real Estate', '2025', 'Architectural interior of a luxury residence — every angle tells a story.', '/assets/portfolio/realestate-living.jpg', 'wide'],
  ['The Conversation Room', 'Podcasts', '2025', 'Cinematic podcast set design — where conversations come to life.', '/assets/portfolio/podcast-studio.jpg', 'square'],
  ['Heirloom Elegance', 'Weddings', '2025', 'Fine-art bridal portrait — style that speaks louder than words.', '/assets/portfolio/wedding-lehenga.jpg', 'tall'],
  ['Scented Stories', 'Brands', '2025', 'Crafted product shot for a luxury candle brand — set the mood, light the moment.', '/assets/portfolio/brand-candle.jpg', 'wide'],
  ['Tropical Pour', 'Food', '2025', 'Beverage styling and photography — savour the flavour through the lens.', '/assets/portfolio/food-mojito.jpg', 'tall'],
  ['Turbo Charged', 'Automobile', '2025', 'Detail study of a Porsche Turbo — ads that perform fast, focused, fearless.', '/assets/portfolio/auto-porsche-turbo.jpg', 'wide'],
  ['Azure Muse', 'Fashion', '2025', 'Editorial fashion campaign with sculptural styling and azure light.', '/assets/portfolio/fashion-blue-seated.jpg', 'wide'],
  ['Heart of Gold', 'Jewelry', '2025', 'Delicate pendant photographed to tell your story in gold.', '/assets/portfolio/jewelry-necklace.jpg', 'square'],
  ['Behind the Light', 'Studio', '2025', 'Inside our studio — softboxes, strobes and the craft behind every frame.', '/assets/portfolio/studio-setup.jpg', 'tall'],
  ['Pop the Moment', 'Food', '2025', 'Premium beverage product shoot styled for editorial campaigns.', '/assets/portfolio/food-champagne.jpg', 'wide'],
  ['The Veiled Bride', 'Weddings', '2025', 'Intimate bridal close-up — every shot is a masterpiece.', '/assets/portfolio/wedding-veil.jpg', 'wide'],
  ['Taycan Nights', 'Automobile', '2025', 'Low-light automotive campaign — luxury framed right, Porsche by Social Studio.', '/assets/portfolio/auto-taycan.jpg', 'wide'],
  ['Eternal Radiance', 'Brands', '2025', 'Crafting the perfect shot for a luxury skincare brand.', '/assets/portfolio/brand-serum.jpg', 'square'],
  ['Lobby Luxe', 'Real Estate', '2025', 'Picture-perfect interiors — just a click away.', '/assets/portfolio/realestate-lobby.jpg', 'wide'],
  ['Bow Sonata', 'Jewelry', '2025', 'Statement earrings styled on tulle for a campaign hero shot.', '/assets/portfolio/jewelry-earrings.jpg', 'square'],
  ['Power Formals', 'Fashion', '2025', 'Apparel campaign for modern formal wear — style that speaks.', '/assets/portfolio/fashion-formal.jpg', 'square'],
  ['Your Voice, Our Vision', 'Podcasts', '2025', 'Studio-grade audio capture for premium podcast production.', '/assets/portfolio/podcast-mic.jpg', 'wide'],
  ['Cockpit Craft', 'Automobile', '2025', 'Interior detailing shot — precision in performance, power in results.', '/assets/portfolio/auto-interior.jpg', 'tall'],
  ['Sweet Indulgence', 'Food', '2025', 'Styled dessert and beverage flat-lay for a lifestyle campaign.', '/assets/portfolio/food-dessert.jpg', 'wide'],
  ['Brand in Bloom', 'Brands', '2025', 'Lifestyle product styling for Social Theory — crafted for the elite.', '/assets/portfolio/brand-decor.jpg', 'tall'],
  ['Spaces that Speak', 'Real Estate', '2025', 'Editorial interior photography that turns spaces into stories.', '/assets/portfolio/realestate-interior.jpg', 'wide'],
  ['The Creative Lounge', 'Studio', '2025', 'Our in-house creative lounge — premium sets built for every brief.', '/assets/portfolio/studio-lounge.jpg', 'wide'],
];

const TESTIMONIALS = [
  ['The team made us feel comfortable from the very first shoot. The final visuals honestly felt like a movie.', 'Rahul & Priya Sharma', 'Wedding Clients', 5, 'RS'],
  ['Social Studios completely changed how our brand looked online. Everything felt premium and professional.', 'Neha Sharma', 'Brand Owner, Luxe Essentials', 5, 'NS'],
  ['Every emotion from our wedding was captured beautifully. Watching the film still gives us goosebumps.', 'Aman & Kritika Malhotra', 'Wedding Clients', 5, 'AM'],
];

export function seed() {
  // First admin user
  if (db.prepare('SELECT COUNT(*) n FROM users').get().n === 0) {
    const name = process.env.ADMIN_NAME || 'Administrator';
    const email = process.env.ADMIN_EMAIL || 'admin@socialstudios.in';
    const password = process.env.ADMIN_PASSWORD || 'changeme123';
    db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run(name, email, bcrypt.hashSync(password, 10), 'admin');
    console.log(`[seed] Created admin: ${email}`);
    if (!process.env.ADMIN_PASSWORD) console.log('[seed] ⚠ Using default password "changeme123" — change it after first login!');
  }

  if (db.prepare('SELECT COUNT(*) n FROM portfolio').get().n === 0) {
    const ins = db.prepare('INSERT INTO portfolio (title, category, year, description, image, aspect, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)');
    PORTFOLIO.forEach((p, i) => ins.run(...p, i));
    console.log(`[seed] Inserted ${PORTFOLIO.length} portfolio items`);
  }

  if (db.prepare('SELECT COUNT(*) n FROM testimonials').get().n === 0) {
    const ins = db.prepare('INSERT INTO testimonials (text, author, role, rating, initials, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
    TESTIMONIALS.forEach((t, i) => ins.run(...t, i));
    console.log(`[seed] Inserted ${TESTIMONIALS.length} testimonials`);
  }
}

// Allow running directly: `npm run seed`
if (import.meta.url === `file://${process.argv[1]}`) {
  (await import('dotenv')).default.config();
  seed();
  console.log('[seed] Done.');
}
