import esbuild from 'esbuild';
import { rm, readFile, writeFile } from 'fs/promises';
import path from 'path';

const outdir = 'dist';
const sourceHtml = 'index.html';

async function build() {
  try {
    console.log('Starting production build...');

    // 1. Clean the output directory for a fresh build
    await rm(outdir, { recursive: true, force: true });
    console.log(`Cleaned output directory: ${outdir}`);

    // 2. Run esbuild to bundle all JS/CSS and create a metafile
    const result = await esbuild.build({
      entryPoints: ['index.tsx'],
      bundle: true,
      minify: true,
      format: 'esm',
      sourcemap: true,
      outdir: outdir,
      entryNames: 'assets/[name]-[hash]',
      chunkNames: 'assets/[name]-[hash]',
      assetNames: 'assets/[name]-[hash]',
      tsconfig: 'tsconfig.json',
      metafile: true,
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    });
    console.log('esbuild bundling complete.');

    // 3. Process the metafile to find the exact paths of the generated files
    const outputs = result.metafile.outputs;
    let jsPath = '';
    let cssPath = '';

    for (const file in outputs) {
      if (file.endsWith('.js')) {
        jsPath = file;
      } else if (file.endsWith('.css')) {
        cssPath = file;
      }
    }

    if (!jsPath) {
      throw new Error('Build failed: Could not find output JS file in metafile.');
    }
    console.log(`Found JS bundle: ${jsPath}`);
    if (cssPath) {
      console.log(`Found CSS bundle: ${cssPath}`);
    }

    // 4. Read the source index.html
    let htmlContent = await readFile(sourceHtml, 'utf-8');

    // 5. Generate the final <link> and <script> tags with correct relative paths
    //    Using .replace(/\\/g, '/') ensures paths are valid URLs on Windows
    const relativeCssPath = cssPath ? path.relative(outdir, cssPath).replace(/\\/g, '/') : '';
    const relativeJsPath = path.relative(outdir, jsPath).replace(/\\/g, '/');

    const cssTag = cssPath ? `<link rel="stylesheet" href="./${relativeCssPath}">` : '';
    const jsTag = `<script type="module" defer src="./${relativeJsPath}"></script>`;
    
    // 6. Remove the conflicting importmap script from the HTML content for production
    htmlContent = htmlContent.replace(/<script type="importmap">[\s\S]*?<\/script>/g, '');
    console.log('Removed development importmap from HTML.');

    // 7. Inject the new, correct asset tags into the HTML placeholders
    htmlContent = htmlContent.replace('<!-- INJECT_STYLES -->', cssTag);
    htmlContent = htmlContent.replace('<!-- INJECT_SCRIPTS -->', jsTag);
    console.log('Injected production asset tags into HTML.');

    // 8. Write the final, production-ready index.html to the output directory
    await writeFile(path.join(outdir, 'index.html'), htmlContent);
    console.log(`Wrote final index.html to ${outdir}`);

    console.log('Build successful! Your app is ready in the "dist" folder.');

  } catch (e) {
    console.error('Build failed:', e);
    process.exit(1);
  }
}

build();
