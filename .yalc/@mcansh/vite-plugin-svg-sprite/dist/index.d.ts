import { Options } from "svgstore";
import { Plugin } from "vite";

type Config = {
	spriteOutputName?: string;
	symbolId?: string;
	logging?: boolean;
	svgstoreOptions?: Options;
};
/**
 * @deprecated - `createSvgSpritePlugin has been renamed to svgSprite, please update your imports as this will be removed in a future release.`
 */
declare function createSvgSpritePlugin(configOptions?: Config): Array<Plugin>;
declare let DEFAULT_COPY_ATTRS: string[];
declare function svgSprite(configOptions?: Config): Array<Plugin>;

export { createSvgSpritePlugin, DEFAULT_COPY_ATTRS, svgSprite, type Config };
