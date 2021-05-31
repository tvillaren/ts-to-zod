import ts from "typescript";
import { SimplifiedJSDocTag } from "../config";

/**
 * Get a simplified version of a node JSDocTags.
 *
 * @param jsDocs
 */
export function getSimplifiedJsDocTags(
  jsDocs: ts.JSDoc[]
): SimplifiedJSDocTag[] {
  const tags: SimplifiedJSDocTag[] = [];
  jsDocs.forEach((jsDoc) => {
    (jsDoc.tags || []).forEach((tag) => {
      const name = tag.tagName.escapedText.toString();
      tags.push({ name, value: tag.comment });
    });
  });

  return tags;
}
