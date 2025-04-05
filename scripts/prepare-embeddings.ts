import fs from 'fs';
import path from 'path';

// Load and parse the markdown file
const loadPersonalInfo = () => {
  const filePath = path.join(process.cwd(), 'data/personal-info.md');
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Split into sections and then chunks
  const sections = content.split(/^# /gm).filter(Boolean);
  
  const chunks = [];
  
  for (const section of sections) {
    const [title, ...content] = section.split('\n');
    const sectionContent = content.join('\n').trim();
    
    // For large sections, further break down into smaller chunks
    if (sectionContent.length > 1000) {
      const paragraphs = sectionContent.split('\n\n');
      for (const paragraph of paragraphs) {
        if (paragraph.trim().length > 0) {
          chunks.push({
            title: title.trim(),
            content: paragraph.trim(),
            source: `${title.trim()} section` 
          });
        }
      }
    } else {
      chunks.push({
        title: title.trim(),
        content: sectionContent,
        source: `${title.trim()} section`
      });
    }
  }
  
  return chunks;
};

export { loadPersonalInfo }; 