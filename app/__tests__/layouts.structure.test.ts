import fs from 'fs';
import path from 'path';

const readFile = (...segments: string[]) => {
  const root = process.cwd();
  const filePath = path.join(root, ...segments);
  return fs.readFileSync(filePath, 'utf8');
};

describe('Layout structure guards (non-UI)', () => {
  it('Root layout contains Navbar and Footer, and main has top padding for fixed nav', () => {
    const content = readFile('app', 'layout.tsx');
    expect(content).toContain('<Navbar');
    expect(content).toContain('<Footer');
    expect(content).toContain('<main');
    expect(content).toContain('pt-16');
  });

  it('Admin layout contains Navbar and Footer, and main has top padding for fixed nav', () => {
    const content = readFile('app', 'admin', 'layout.tsx');
    expect(content).toContain('<Navbar');
    expect(content).toContain('<Footer');
    expect(content).toContain('<main');
    expect(content).toContain('pt-16');
  });

  it('Navbar is fixed at the top for consistent presence across pages', () => {
    const content = readFile('components', 'layout', 'Navbar.tsx');
    expect(content).toContain('fixed top-0');
    expect(content).toContain('left-0 right-0');
  });
});
