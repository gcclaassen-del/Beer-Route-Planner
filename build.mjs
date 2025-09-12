import esbuild from 'esbuild';
import { copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const outdir = 'dist';

try {
  console.log('Starting build process...');

  // Ensure the output directory exists
  if (!existsSync(outdir)) {
    await mkdir(outdir);
    console.log(`Created output directory: ${outdir}`);
  }

  // Bundle the React application using tsconfig.json
  await esbuild.build({
    entryPoints: ['index.tsx'],
    bundle: true,
    outfile: `${outdir}/main.js`,
    minify: true,
    sourcemap: true,
    // This line is the crucial fix: it tells esbuild to use your tsconfig file.
    tsconfig: 'tsconfig.json',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  console.log('JavaScript bundling complete.');

  // Copy the main HTML file to the output directory
  await copyFile('index.html', `${outdir}/index.html`);

  console.log('index.html copied.');
  console.log('Build successful! Your app is ready in the "dist" folder.');

} catch (e) {
  console.error('Build failed:', e);
  process.exit(1);
}
