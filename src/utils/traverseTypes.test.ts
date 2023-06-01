import ts from "typescript";
import { getExtractedTypeNames } from "./traverseTypes";
import { findNode } from "./findNode";

describe("traverseTypes", () => {
  describe("getExtractedTypeNames", () => {
    it("should find only itself", () => {
      const testCases = [
        `
        export type Superhero = {
            id: number, 
            name: string
          };
        `,
        `
        export interface Superhero = {
            id: number, 
            name: string
          };
        `,
        `
        export enum Superhero = {
            Superman = "superman",
            ClarkKent = "clark_kent",
          };
        `,
      ];

      testCases.forEach((source: string) => {
        const result = extractNames(source);
        expect(result).toEqual(["Superhero"]);
      });
    });

    it("should extract type referenced in property", () => {
      const source = `
        export interface Superhero {
            id: number,
            person: Person,
        }`;

      const result = extractNames(source);
      expect(result).toEqual(["Superhero", "Person"]);
    });

    it("should extract type referenced in extend clause", () => {
      const source = `
          export interface Superhero extends Person {
              id: number,
          }`;

      const result = extractNames(source);
      expect(result).toEqual(["Superhero", "Person"]);
    });

    it("should extract type referenced in multiple extend clauses", () => {
      const source = `
            export interface Superhero extends Person, Person2 {
                id: number,
            }`;

      const result = extractNames(source);
      expect(result).toEqual(["Superhero", "Person", "Person2"]);
    });

    it("should extract type referenced in property as array", () => {
      const source = `
            export interface Superhero {
                id: number,
                sidekicks: Person[],
            }`;

      const result = extractNames(source);
      expect(result).toEqual(["Superhero", "Person"]);
    });

  });
});

function extractNames(sourceText: string) {
  const sourceFile = ts.createSourceFile(
    "index.ts",
    sourceText,
    ts.ScriptTarget.Latest
  );
  const declaration = findNode(
    sourceFile,
    (
      node
    ): node is
      | ts.InterfaceDeclaration
      | ts.TypeAliasDeclaration
      | ts.EnumDeclaration =>
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isEnumDeclaration(node)
  );
  if (!declaration) {
    throw new Error("No `type` or `interface` found!");
  }

  return getExtractedTypeNames(declaration, sourceFile);
}
