import { readFileSync, writeFileSync } from "node:fs";
const path="src/app/programs/page.tsx";
const old='>Предварительный каталог по опубликованным сведениям bsu.kg. Наличие набора, формы обучения и условия поступления необходимо уточнять в приёмной комиссии БГУ.</p>';
const text=readFileSync(path,"utf8");
if(text.includes("<CatalogNoteV14 />")){console.log("Already patched");process.exit(0);}
if(!text.includes(old)) throw new Error("Source changed; stop rather than overwrite existing edits");
const updated='import CatalogNoteV14 from "@/components/i18n/CatalogNoteV14";\n'.replace("\n","\n")+text.replace(old,'><CatalogNoteV14 /></p>');
writeFileSync(path,updated);console.log("Updated programs disclaimer");
