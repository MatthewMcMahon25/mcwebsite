import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const postsDirectory = path.join(__dirname, '../newsletter/posts');
const outputPath = path.join(__dirname, '../newsletter/posts.json');

// Parse a single Markdown file into post object
async function parseMarkdownFile(filePath) {
  const fileContent = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  // Skip draft posts
  if (data.draft) return null;

  const id = path.basename(filePath).replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');

  const sections = {
    setting: '',
    antagonist: '',
    protagonist: '',
    conclusion: ''
  };

  let current = null;
  const lines = content.split('\n');

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith('# ')) {
      const section = line.slice(2).toLowerCase();
      if (sections.hasOwnProperty(section)) current = section;
    } else if (current) {
      sections[current] += line + '\n\n';
    }
  }

  return {
    id,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    image: data.image,
    url: `/newsletter/post.html?id=${id}`,
    ...sections
  };
}

// Process all Markdown files
async function generatePostsJson() {
  const files = await glob(`${postsDirectory}/*.md`);
  const rawPosts = await Promise.all(files.map(parseMarkdownFile));
  const posts = rawPosts.filter(p => p !== null); // Remove skipped drafts
  await fs.writeFile(outputPath, JSON.stringify(posts, null, 2));
  console.log(`✅ Successfully updated posts.json with ${posts.length} posts.`);
}

generatePostsJson().catch(err => {
  console.error('❌ Failed to generate posts.json:', err);
});