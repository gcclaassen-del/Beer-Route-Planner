import esbuild from 'esbuild';
import { copyFile } from 'fs/promises';

try {
  // Bundle the JavaScript/TypeScript code
  await esbuild.build({
    entryPoints: ['index.tsx'],
    bundle: true,
    minify: true,
    format: 'esm',
    outfile: 'dist/index.js',
    loader: {
      '.tsx': 'tsx',
    },
  });

  // Copy the main HTML file to the output directory
  await copyFile('index.html', 'dist/index.html');

  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
