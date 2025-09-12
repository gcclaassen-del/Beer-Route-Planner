import esbuild from 'esbuild';
import { copyFile, mkdir, writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const outdir = 'dist';

try {
  console.log('Starting production build process with cache busting...');

  // Ensure the output directory exists
  if (!existsSync(outdir)) {
    await mkdir(outdir);
    console.log(`Created output directory: ${outdir}`);
  }

  // Bundle the application with a hashed filename.
  // We use write: false to get the file content in memory.
  const result = await esbuild.build({
    entryPoints: ['index.tsx'],
    bundle: true,
    minify: true,
    format: 'esm',
    sourcemap: true,
    entryNames: '[name]-[hash]', // This creates the unique filename e.g., main-A1B2C3D4.js
    outdir: outdir,
    tsconfig: 'tsconfig.json',
    write: false, // We will write the files manually after updating index.html
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  if (result.outputFiles.length === 0) {
    throw new Error('esbuild did not produce any output files.');
  }

  // Find the generated JS file (and its map if it exists)
  const jsFile = result.outputFiles.find(file => file.path.endsWith('.js'));
  const cssFile = result.outputFiles.find(file => file.path.endsWith('.css')); // In case CSS is extracted

  if (!jsFile) {
    throw new Error('Could not find the generated JavaScript file in the build output.');
  }

  const jsFileName = path.basename(jsFile.path);
  
  console.log(`JavaScript bundled successfully: ${jsFileName}`);
  
  // Write the main JS file to the dist folder
  await writeFile(jsFile.path, jsFile.contents);

  // Read the source index.html
  let htmlContent = await readFile('index.html', 'utf-8');

  // CRITICAL FIX 1: Remove the development-only importmap
  htmlContent = htmlContent.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');
  console.log('Removed development importmap from index.html.');

  // CRITICAL FIX 2: Replace the placeholder script with the new cache-busted filename
  htmlContent = htmlContent.replace(
    /<script type="module" defer src=".\/main.js"><\/script>/,
    `<script type="module" defer src="./${jsFileName}"></script>`
  );
  console.log('Updated index.html to point to the new cache-busted script.');

  // Write the updated index.html to the dist folder
  await writeFile(path.join(outdir, 'index.html'), htmlContent);
  console.log('index.html processed and copied to dist.');
  
  console.log('Build successful! Your app is ready in the "dist" folder with cache busting enabled.');

} catch (e) {
  console.error('Build failed:', e);
  process.exit(1);
}
