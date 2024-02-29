import path from "node:path";

import fse from "fs-extra";
import { globSync } from "glob";
import { format } from "prettier";
import svgstore from "svgstore";

let ASSETS_PATH = path.join(process.cwd(), "assets");

let OUT_DIR = path.join(process.cwd(), "app", "components", "sprite");
let OUT_FILE = path.join(OUT_DIR, "index.svg");
let COMPONENT_FILE = path.join(OUT_DIR, "index.tsx");

let js = String.raw;

async function createSprite() {
	let icons = globSync("./**/*.svg", {
		cwd: ASSETS_PATH,
		absolute: true,
		nodir: true,
	});
	if (icons.length === 0) {
		console.log("No svg icons found");
		return;
	}

	let sprites = svgstore();
	let union = [];

	for (let icon of icons) {
		let basename = path.basename(icon);
		let icons_name = basename.replace(".svg", "");
		let content = await fse.readFile(icon, "utf-8");
		sprites.add(icons_name, content);
		union.push(icons_name);
	}

	let component = js`
    import iconsHref from "./index.svg?url";

    export type SpriteName = ${[...union]
			.map((icon) => `"${icon}"`)
			.join(" | ")};

    export type SpriteProps = { name: SpriteName; } & JSX.IntrinsicElements["svg"];

    export function Svg({ name, ...svgProps }: SpriteProps) {
      return (
        <svg {...svgProps}>
          <use href={iconsHref + "#" + name} />
        </svg>
      );
    }
  `;

	await Promise.all([
		fse.writeFile(
			OUT_FILE,
			await format(sprites.toString(), { parser: "html" }),
		),
		fse.writeFile(
			COMPONENT_FILE,
			await format(component, { parser: "typescript" }),
		),
	]);
}

async function compile() {
	await fse.ensureDir(path.dirname(OUT_FILE));
	await createSprite();
}

compile();
