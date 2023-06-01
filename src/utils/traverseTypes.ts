import ts from "typescript";

export type TypeNode =
  | ts.InterfaceDeclaration
  | ts.TypeAliasDeclaration
  | ts.EnumDeclaration;

export function isTypeNode(node: ts.Node): node is TypeNode {
  return (
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEnumDeclaration(node)
  );
}

export function getExtractedTypeNames(
  node: TypeNode,
  sourceFile: ts.SourceFile
): string[] {
  const referenceTypeNames = new Set<string>();
  referenceTypeNames.add(node.name.text);

  const heritageClauses = (node as ts.InterfaceDeclaration).heritageClauses;

  if (heritageClauses) {
    heritageClauses.forEach((clause) => {
      const extensionTypes = clause.types;
      extensionTypes.forEach((extensionTypeNode) => {
        const typeName = extensionTypeNode.expression.getText(sourceFile);

        referenceTypeNames.add(typeName);
      });
    });
  }

  node.forEachChild((child) => {
    const childNode = child as ts.PropertySignature;
    if (!ts.isPropertySignature(childNode)) {
      return;
    }

    if (childNode.type && ts.isTypeReferenceNode(childNode.type)) {
      referenceTypeNames.add(childNode.type.getText(sourceFile));
    }
  });

  return Array.from(referenceTypeNames);
}
