/**
 * Genera el documento de entrega de la Evaluación 3 — Bases de Datos (.docx).
 *
 * Formato APA 7ma edición con excepción: alineación justificada
 * en lugar de alineada a la izquierda para los párrafos del cuerpo.
 * La portada incluye el logo institucional de la UNETI.
 *
 * Uso: node generate-eval3.mjs  →  escribe el .docx en la raíz del repo
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

import { portada, secciones, capturas, indice } from './content-eval3.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, 'assets');
const SCREENSHOTS_DIR = join(ASSETS_DIR, 'eval3');
const LOGO_PATH = join(ASSETS_DIR, 'uneti-logo.png');
const OUTPUT_PATH = join(__dirname, '..', '..', 'base-de-datos-eval-3-miguel-figuera.docx');
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

function heading2(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 200, line: LINE_SPACING_DOUBLE, lineRule: LineRuleType.AUTO },
    children: [run(text, { bold: true, size: HEADING2_SIZE })],
  });
}

function heading1(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240, line: LINE_SPACING_DOUBLE, lineRule: LineRuleType.AUTO },
    children: [run(text, { bold: true, size: HEADING1_SIZE })],
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

function bulletParagraph(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 0, after: 0, line: LINE_SPACING_DOUBLE, lineRule: LineRuleType.AUTO },
    indent: { left: INDENT_FIRST_LINE },
    children: [run(`• ${text}`)],
  });
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

function buildScreenshotBlocks(archivo, figureNumber) {
  const info = capturas[archivo];
  if (!info) throw new Error(`Sin pie de figura para: ${archivo}`);
  const path = join(SCREENSHOTS_DIR, archivo);
  if (!existsSync(path)) throw new Error(`No se encontró la captura: ${path}`);
  const size = scaleImage(info.width, info.height);

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
      children: [
        new ImageRun({
          type: 'png',
          data: readFileSync(path),
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

  paragraphs.push(emptyLine());

  // Logo institucional (180 × 55 px, tamaño natural ampliado ×1.5)
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120, line: LINE_SPACING_SINGLE, lineRule: LineRuleType.AUTO },
      children: [
        new ImageRun({
          type: 'png',
          data: readFileSync(LOGO_PATH),
          transformation: { width: 270, height: 83 },
          altText: {
            title: 'Logo UNETI',
            description: 'Logo institucional de la UNETI',
            name: 'uneti-logo.png',
          },
        }),
      ],
    }),
  );

  for (let i = 0; i < 3; i++) paragraphs.push(emptyLine());

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
      children: [run(portada.subtitulo, { size: 26 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0, line: 360, lineRule: LineRuleType.AUTO },
      children: [run(portada.asignatura, { size: 26 })],
    }),
  );

  for (let i = 0; i < 4; i++) paragraphs.push(emptyLine());

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

function buildSecciones(figureCounter) {
  const paragraphs = [];

  for (const seccion of secciones) {
    paragraphs.push(heading2(seccion.titulo));

    for (const bloque of seccion.bloques) {
      if (bloque.tipo === 'p') {
        paragraphs.push(bodyParagraph(bloque.texto));
      } else if (bloque.tipo === 'codigo') {
        paragraphs.push(...buildCodeBlocks(bloque.titulo, bloque.codigo));
      } else if (bloque.tipo === 'lista') {
        for (const item of bloque.items) paragraphs.push(bulletParagraph(item));
      } else if (bloque.tipo === 'captura') {
        figureCounter.n += 1;
        paragraphs.push(...buildScreenshotBlocks(bloque.archivo, figureCounter.n));
      }
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
    ...buildSecciones(figureCounter),
  ];

  return {
    doc: new Document({
      creator: portada.autor,
      title: 'Evaluación 3 — Bases de Datos: Cine UNETI',
      description:
        'Documento de entrega de la Evaluación 3 de Bases de Datos: repositorio, instrucciones y capturas de MongoDB',
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
