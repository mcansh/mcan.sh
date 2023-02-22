import type {
  V2_HtmlMetaDescriptor,
  V2_MetaFunction,
} from "@remix-run/server-runtime";

export const mergeMeta = (
  overrideFn: V2_MetaFunction,
  appendFn?: V2_MetaFunction
): V2_MetaFunction => {
  return (args) => {
    // get meta from parent routes
    let mergedMeta = args.matches.reduce<V2_HtmlMetaDescriptor[]>(
      (acc, match) => {
        return acc.concat(match.meta || []);
      },
      []
    );

    // replace any parent meta with the same name or property with the override
    let overrides = overrideFn(args);
    for (let override of overrides) {
      let index = mergedMeta.findIndex((meta) => {
        let name =
          "name" in meta && "name" in override && meta.name === override.name;
        let property =
          "property" in meta &&
          "property" in override &&
          meta.property === override.property;
        let title = "title" in meta && "title" in override;
        return name || property || title;
      });

      if (index !== -1) {
        mergedMeta.splice(index, 1, override);
      }
    }

    // append any additional meta
    if (typeof appendFn === "function") {
      mergedMeta = mergedMeta.concat(appendFn(args));
    }

    return mergedMeta;
  };
};
