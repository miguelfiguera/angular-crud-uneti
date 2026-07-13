/**
 * Genera el documento explicativo APA (.docx) sobre el proceso de
 * desarrollo del sistema CRUD de películas (Angular + Node.js + MongoDB).
 *
 * Formato APA 7ma edición con excepción: alineación justificada
 * en lugar de alineada a la izquierda para los párrafos del cuerpo.
 *
 * Uso: node generate.mjs  →  escribe el .docx en docs/
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  PageNumber,
  Header,
  TabStopType,
  TabStopPosition,
  PageOrientation,
  PageBreak,
  LineRuleType,
  ShadingType,
} from 'docx';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  portada,
  introduccion,
  etapas,
  conclusion,
  referencias,
  anexos,
  indice,
  capturas,
} from './content.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = join(__dirname, '..', '..', 'Fotos');
const OUTPUT_PATH = join(__dirname, '..', 'MIGUEL_FIGUERA_EVAL_2.docx');
const MAX_IMAGE_WIDTH = 560;

const FONT = 'Times New Roman';
const CODE_FONT = 'Courier New';
const FONT_SIZE = 24;
const CODE_SIZE = 18;
const CAPTION_SIZE = 22;
const TITLE_SIZE = 30;
const HEADING1_SIZE = 28;
const HEADING2_SIZE = 26;
const LINE_SPACING_DOUBLE = 480;
const LINE_SPACING_SINGLE = 276;
const INDENT_FIRST_LINE = 720;
const MARGIN_INCH = 1440;

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: opts.size ?? FONT_SIZE,
    bold: opts.bold ?? false,
    italics: opts.italics ?? false,
  });
}

function bodyParagraph(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 0, line: LINE_SPACING_DOUBLE, lineRule: LineRuleType.AUTO },
    indent: { firstLine: INDENT_FIRST_LINE },
    children: [run(text)],
  });
}

function heading1(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240, line: LINE_SPACING_DOUBLE, lineRule: LineRuleType.AUTO },
    children: [run(text, { bold: true, size: HEADING1_SIZE })],
  });
}

function heading2(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 200, after: 200, line: LINE_SPACING_DOUBLE, lineRule: LineRuleType.AUTO },
    children: [run(text, { bold: true, size: HEADING2_SIZE })],
  });
}

function emptyLine() {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
    children: [],
  });
}

function pageBreakParagraph() {
  return new Paragraph({ children: [new PageBreak()] });
}

/** Bloque de código fuente: monoespaciado, interlineado sencillo, fondo gris claro. */
function buildCodeBlocks(titulo, codigo) {
  const paragraphs = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 160, after: 80, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
      children: [run(titulo, { bold: true, italics: true, size: CAPTION_SIZE })],
    }),
  ];

  const lines = codigo.split('\n');
  for (let i = 0; i < lines.length; i++) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: {
          before: 0,
          after: i === lines.length - 1 ? 160 : 0,
          line: LINE_SPACING_SINGLE,
          lineRule: LineRuleType.AUTO,
        },
        indent: { left: 360 },
        shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
        children: [
          new TextRun({ text: lines[i] || ' ', font: CODE_FONT, size: CODE_SIZE }),
        ],
      }),
    );
  }

  return paragraphs;
}

function scaleImage(width, height) {
  if (width <= MAX_IMAGE_WIDTH) return { width, height };
  const ratio = MAX_IMAGE_WIDTH / width;
  return { width: MAX_IMAGE_WIDTH, height: Math.round(height * ratio) };
}

function readScreenshot(archivo) {
  const path = join(SCREENSHOTS_DIR, archivo);
  if (!existsSync(path)) {
    throw new Error(`No se encontró la captura: ${path}`);
  }
  return readFileSync(path);
}

function buildScreenshotBlocks(archivo, figureNumber) {
  const info = capturas[archivo];
  if (!info) throw new Error(`Sin pie de figura para: ${archivo}`);
  const size = scaleImage(info.width, info.height);
  const data = readScreenshot(archivo);

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
      children: [
        new ImageRun({
          type: 'png',
          data,
          transformation: { width: size.width, height: size.height },
          altText: {
            title: `Figura ${figureNumber}`,
            description: info.descripcion,
            name: archivo,
          },
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
      children: [
        run(`Figura ${figureNumber}. `, { italics: true, size: CAPTION_SIZE }),
        run(info.descripcion, { italics: true, size: CAPTION_SIZE }),
      ],
    }),
  ];
}

function buildCover() {
  const instLines = [
    'REPÚBLICA BOLIVARIANA DE VENEZUELA',
    'MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN UNIVERSITARIA',
    'UNIVERSIDAD NACIONAL EXPERIMENTAL DE LAS TELECOMUNICACIONES E INFORMÁTICA',
    'UNETI — EXTENSIÓN LA VICTORIA',
  ];

  const paragraphs = [];

  for (const line of instLines) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 0, after: 0, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
        children: [run(line, { bold: true })],
      }),
    );
  }

  for (let i = 0; i < 4; i++) paragraphs.push(emptyLine());

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0, line: 360, lineRule: LineRuleType.AUTO },
      children: [run(portada.titulo, { bold: true, size: TITLE_SIZE })],
    }),
  );

  paragraphs.push(emptyLine());

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0, line: 360, lineRule: LineRuleType.AUTO },
      children: [run(portada.asignatura, { size: 26 })],
    }),
  );

  for (let i = 0; i < 5; i++) paragraphs.push(emptyLine());

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 0, after: 0, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
      children: [run('Autor:', { bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 0, after: 0, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
      children: [run(portada.autor)],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 0, after: 0, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
      children: [run(portada.cedula)],
    }),
  );

  for (let i = 0; i < 3; i++) paragraphs.push(emptyLine());

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
      children: [run(portada.lugarFecha)],
    }),
  );

  paragraphs.push(pageBreakParagraph());
  return paragraphs;
}

function buildIndex() {
  const paragraphs = [heading1('ÍNDICE'), emptyLine()];

  for (const item of indice) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 120, line: LINE_SPACING_DOUBLE, lineRule: LineRuleType.AUTO },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: 'dot' }],
        children: [run(item.label), run(`\t${item.page}`)],
      }),
    );
  }

  paragraphs.push(pageBreakParagraph());
  return paragraphs;
}

function buildIntroduction() {
  const paragraphs = [heading1('INTRODUCCIÓN')];
  for (const p of introduccion) paragraphs.push(bodyParagraph(p));
  paragraphs.push(pageBreakParagraph());
  return paragraphs;
}

function buildEtapas(figureCounter) {
  const paragraphs = [];

  for (let i = 0; i < etapas.length; i++) {
    const etapa = etapas[i];
    paragraphs.push(heading1(`ETAPA ${etapa.numero}`));
    paragraphs.push(heading2(etapa.titulo));

    for (const bloque of etapa.bloques) {
      if (bloque.tipo === 'p') {
        paragraphs.push(bodyParagraph(bloque.texto));
      } else if (bloque.tipo === 'codigo') {
        paragraphs.push(...buildCodeBlocks(bloque.titulo, bloque.codigo));
      } else if (bloque.tipo === 'captura') {
        figureCounter.n += 1;
        paragraphs.push(...buildScreenshotBlocks(bloque.archivo, figureCounter.n));
      }
    }

    paragraphs.push(pageBreakParagraph());
  }

  return paragraphs;
}

function buildConclusion() {
  const paragraphs = [heading1('CONCLUSIÓN')];
  for (const p of conclusion) paragraphs.push(bodyParagraph(p));
  paragraphs.push(pageBreakParagraph());
  return paragraphs;
}

function buildReferences() {
  const paragraphs = [heading1('REFERENCIAS')];

  for (const ref of referencias) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 200, line: LINE_SPACING_DOUBLE, lineRule: LineRuleType.AUTO },
        indent: { left: INDENT_FIRST_LINE, hanging: INDENT_FIRST_LINE },
        children: [run(ref)],
      }),
    );
  }

  paragraphs.push(pageBreakParagraph());
  return paragraphs;
}

function buildAnexos() {
  const paragraphs = [heading1('ANEXOS')];

  for (let i = 0; i < anexos.length; i++) {
    const anexo = anexos[i];
    paragraphs.push(heading2(anexo.titulo));

    for (const p of anexo.parrafos) {
      if (p.startsWith('URL:')) {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 0, line: LINE_SPACING_DOUBLE, lineRule: LineRuleType.AUTO },
            children: [run(p, { italics: true })],
          }),
        );
      } else {
        paragraphs.push(bodyParagraph(p));
      }
    }

    if (anexo.codigo) {
      paragraphs.push(...buildCodeBlocks('Estructura de carpetas', anexo.codigo));
    }

    if (i < anexos.length - 1) {
      paragraphs.push(emptyLine());
    }
  }

  return paragraphs;
}

function buildHeader() {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: FONT_SIZE }),
        ],
      }),
    ],
  });
}

function buildDocument() {
  const figureCounter = { n: 0 };

  const allParagraphs = [
    ...buildCover(),
    ...buildIndex(),
    ...buildIntroduction(),
    ...buildEtapas(figureCounter),
    ...buildConclusion(),
    ...buildReferences(),
    ...buildAnexos(),
  ];

  return {
    doc: new Document({
      creator: portada.autor,
      title: 'Proceso de Desarrollo: Sistema CRUD con Angular, Node.js y MongoDB',
      description:
        'Documento explicativo del proceso de desarrollo del sistema CRUD de películas para UNETI',
      styles: {
        default: {
          document: { run: { font: FONT, size: FONT_SIZE } },
        },
      },
      sections: [
        {
          properties: {
            page: {
              size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
              margin: {
                top: MARGIN_INCH,
                right: MARGIN_INCH,
                bottom: MARGIN_INCH,
                left: MARGIN_INCH,
                header: 720,
                footer: 720,
              },
            },
          },
          headers: { default: buildHeader() },
          children: allParagraphs,
        },
      ],
    }),
    figures: figureCounter.n,
  };
}

async function main() {
  const { doc, figures } = buildDocument();
  const buffer = await Packer.toBuffer(doc);

  writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Documento generado: ${OUTPUT_PATH}`);
  console.log(`Tamaño: ${(buffer.length / 1024).toFixed(1)} KB`);
  console.log(`Capturas insertadas: ${figures}`);
}

main().catch((err) => {
  console.error('Error generando documento:', err);
  process.exit(1);
});
