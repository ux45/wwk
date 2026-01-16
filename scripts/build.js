const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const templatePath = path.join(root, "template.html");
const contentPath = path.join(root, "content.json");
const outPath = path.join(root, "grownups.html");

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// generate grownups-like page if content.json exists
try {
  if (fs.existsSync(contentPath) && fs.existsSync(templatePath)) {
    const content = loadJSON(contentPath);
    let template = fs.readFileSync(templatePath, "utf8");
    const sections = [];
    for (let i = 1; i <= 6; i++) {
      const tKey = `section_${i}_title`;
      const bKey = `section_${i}_bullets`;
      const title = content[tKey];
      const bullets = content[bKey] || [];
      if (!title && bullets.length === 0) continue;
      const items = bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("\n");
      const html = `
    <section class="col-12 col-md-6">
      <div class="card h-100">
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(title || "")}</h3>
          <ul>
            ${items}
          </ul>
        </div>
      </div>
    </section>
  `;
      sections.push(html);
    }
    template = template.replace(/%%PAGE_TITLE%%/g, escapeHtml(content.page_title || ""));
    template = template.replace(/%%HERO_IMAGE%%/g, escapeHtml(content.hero_image || ""));
    template = template.replace(/%%SECTIONS%%/g, sections.join("\n"));
    fs.writeFileSync(outPath, template, "utf8");
    console.log("Generated", outPath);
  }
} catch (err) {
  console.error("Error generating grownups page:", err);
}

// generate story pages for any JSON files inside the stories/ directory
try {
  const storiesDir = path.join(root, "stories");
  const storyTemplatePath = path.join(root, "story_template.html");

  if (fs.existsSync(storyTemplatePath) && fs.existsSync(storiesDir)) {
    const files = fs.readdirSync(storiesDir).filter((f) => /\.json$/i.test(f));
    if (files.length > 0) {
      function slugify(text) {
        return String(text || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      files.forEach((file) => {
        try {
          const storyContentPath = path.join(storiesDir, file);
          const s = loadJSON(storyContentPath);
          let tpl = fs.readFileSync(storyTemplatePath, "utf8");

          // build sections dynamically (any number)
          const sections = [];
          for (let i = 1; i <= 20; i++) {
            const tKey = `section_${i}_title`;
            const bKey = `section_${i}_bullets`;
            const title = s[tKey];
            const bullets = s[bKey] || [];
            if (!title && bullets.length === 0) continue;
            const items = bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("\n");
            const html = `
      <article class="mb-4">
        <h2>${escapeHtml(title || "")}</h2>
        <ul>
          ${items}
        </ul>
      </article>
      `;
            sections.push(html);
          }

          // prepare play control: use HTML5 audio if play_url provided
          let playControl = "";
          if (s.play_url) {
            playControl = `<audio controls preload="none" style="width:100%"><source src="${escapeHtml(s.play_url)}"></audio>`;
          } else {
            playControl = `<div class="text-muted">Audio not provided</div>`;
          }

          tpl = tpl.replace(/%%PAGE_TITLE%%/g, escapeHtml(s.page_title || ""));
          tpl = tpl.replace(/%%COVER_IMAGE%%/g, escapeHtml(s.cover_image || ""));
          tpl = tpl.replace(/%%AUTHOR%%/g, escapeHtml(s.author || ""));
          tpl = tpl.replace(/%%DURATION%%/g, escapeHtml(s.duration || ""));
          tpl = tpl.replace(/%%PLAY_CONTROL%%/g, playControl);
          tpl = tpl.replace(/%%SECTIONS%%/g, sections.join("\n"));

          // fallback slug: prefer page_title, otherwise derive from filename
          const base = slugify(s.page_title) || slugify(path.basename(file, ".json"));
          let filenameOut = `story-${base}.html`;
          // ensure uniqueness
          let counter = 1;
          while (fs.existsSync(path.join(root, filenameOut))) {
            filenameOut = `story-${base}-${counter}.html`;
            counter++;
          }

          const storyOut = path.join(root, filenameOut);
          fs.writeFileSync(storyOut, tpl, "utf8");
          console.log("Generated", storyOut);
        } catch (err) {
          console.error(`Error generating from ${file}:`, err);
        }
      });
    }
  }
} catch (err) {
  console.error("Error generating story pages:", err);
}
