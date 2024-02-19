import { validateGeneratedTypes } from "./validateGeneratedTypes";

describe("validateGeneratedTypes", () => {
  it("should return no error if the types match", () => {
    const sourceTypes = {
      sourceText: `
      export type MyNumber = number;
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";
    export const myNumberSchema = z.number();
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type myNumberSchemaInferredType = z.infer<typeof generated.myNumberSchema>;

      expectType<myNumberSchemaInferredType>({} as spec.MyNumber);
      expectType<spec.MyNumber>({} as myNumberSchemaInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we use a non-optional any", () => {
    const sourceTypes = {
      sourceText: `
      export interface Citizen {
        villain: any;
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";
    export const citizenSchema = z.object({
      villain: z.any()
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we reference a non-imported type", () => {
    const sourceTypes = {
      sourceText: `
      export type Villain = {
        name: string;
      }

      export type Citizen = {
        villain: Villain | null;
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";

    export const villainSchema = z.object({
      name: z.string()
    });

    export const citizenSchema = z.object({
      villain: villainSchema.nullable()
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we reference a non-imported type in an Array", () => {
    const sourceTypes = {
      sourceText: `
      export type Villain = {
        name: string;
      }

      export type Citizen = {
        villains: Array<Villain>;
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";

    export const villainSchema = z.object({
      name: z.string()
    });

    export const citizenSchema = z.object({
      villains: z.array(villainSchema)
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we use a 'deep' non-optional any", () => {
    const sourceTypes = {
      sourceText: `
      export interface Citizen {
        villain: {
          name: string
          id: any
          ids: any[]
        };
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";
    export const citizenSchema = z.object({
      villain: z.object({
        name: z.string(),
        id: z.any()
        ids: z.array(z.any())
      })
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we reference an external import", () => {
    const sourceTypes = {
      sourceText: `
      import { Hero } from "./hero-module.ts"

      export interface Citizen {
        hero: Hero
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";
    const heroSchema = z.any();

    export const citizenSchema = z.object({
      hero: heroSchema
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we reference an array of external imports", () => {
    const sourceTypes = {
      sourceText: `
      import { Hero } from "./hero-module.ts"

      export interface Citizen {
        heros: Array<Hero>
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";
    const heroSchema = z.any();

    export const citizenSchema = z.object({
      heros: z.array(heroSchema)
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we reference a zod import", () => {
    const sourceTypes = {
      sourceText: `
      import { Hero } from "./hero-module.ts"

      export interface Citizen {
        hero: Hero
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";
      import { heroSchema } from "./zHero.ts"

      export const citizenSchema = z.object({
        hero: heroSchema
      });
    `,
      relativePath: "source.zod.ts",
    };

    const extraFiles = [
      {
        sourceText: `export type Hero = { name: string; }`,
        relativePath: "hero-module.ts",
      },
      {
        sourceText: `
        import { z } from "zod";
        export const heroSchema = z.object({ name: z.string() })`,
        relativePath: "zHero.ts",
      },
    ];

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
      extraFiles,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we reference a zod import in a subdirectory", () => {
    const sourceTypes = {
      sourceText: `
      import { Hero } from "./zod/hero-module.ts"

      export interface Citizen {
        hero: Hero
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";
      import { heroSchema } from "./zod/zHero.ts"

      export const citizenSchema = z.object({
        hero: heroSchema
      });
    `,
      relativePath: "source.zod.ts",
    };

    const extraFiles = [
      {
        sourceText: `export type Hero = { name: string; }`,
        relativePath: `./zod/hero-module.ts`,
      },
      {
        sourceText: `
        import { z } from "zod";
        export const heroSchema = z.object({ name: z.string() })`,
        relativePath: `./zod/zHero.ts`,
      },
    ];

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
      extraFiles,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we reference a zod import in a parent directory", () => {
    const sourceTypes = {
      sourceText: `
      import { Hero } from "../hero-module.ts"

      export interface Citizen {
        hero: Hero
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";
      import { heroSchema } from "../zHero.ts"

      export const citizenSchema = z.object({
        hero: heroSchema
      });
    `,
      relativePath: "source.zod.ts",
    };

    const extraFiles = [
      {
        sourceText: `export type Hero = { name: string; }`,
        relativePath: `../hero-module.ts`,
      },
      {
        sourceText: `
        import { z } from "zod";
        export const heroSchema = z.object({ name: z.string() })`,
        relativePath: `../zHero.ts`,
      },
    ];

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
      extraFiles,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we reference a zod import in an exotic path", () => {
    const sourceTypes = {
      sourceText: `
      import { Hero } from "hero-module.ts"

      export interface Citizen {
        hero: Hero
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";
      import { heroSchema } from "../../zod/zHero.ts"

      export const citizenSchema = z.object({
        hero: heroSchema
      });
    `,
      relativePath: "source.zod.ts",
    };

    const extraFiles = [
      {
        sourceText: `export type Hero = { name: string; }`,
        relativePath: "hero-module.ts",
      },
      {
        sourceText: `
        import { z } from "zod";
        export const heroSchema = z.object({ name: z.string() })`,
        relativePath: `../../zod/zHero.ts`,
      },
    ];

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
      extraFiles,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we reference a zod import without its extension", () => {
    const sourceTypes = {
      sourceText: `
      import { Hero } from "./hero-module"

      export interface Citizen {
        hero: Hero
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";
      import { heroSchema } from "./zHero"

      export const citizenSchema = z.object({
        hero: heroSchema
      });
    `,
      relativePath: "source.zod.ts",
    };

    const extraFiles = [
      {
        sourceText: `export type Hero = { name: string; }`,
        relativePath: "hero-module.ts",
      },
      {
        sourceText: `
        import { z } from "zod";
        export const heroSchema = z.object({ name: z.string() })`,
        relativePath: "zHero.ts",
      },
    ];

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
      extraFiles,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we use a deep external import", () => {
    const sourceTypes = {
      sourceText: `
      import { Villain } from "./villain-module.ts"
      
      import { Hero } from "./hero-module.ts"

      export interface Citizen {
        villain: Villain
        heroData: {
          name: string
          hero: Hero
        }
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";

    const villainSchema = z.any();
    
    const heroSchema = z.any();

    export const citizenSchema = z.object({
      villain: villainSchema
      heroData: z.object({
        name: z.string(),
        hero: heroSchema
      })
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we use a deep external import with union", () => {
    const sourceTypes = {
      sourceText: `
      import { Villain } from "./villain-module.ts"
      
      import { Hero } from "./hero-module.ts"

      export interface Citizen {
        villain: Villain
        heroData: {
          name: string
          hero: Hero | string
        }
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";

    const villainSchema = z.any();
    
    const heroSchema = z.any();

    export const citizenSchema = z.object({
      villain: villainSchema,
      heroData: z.object({
        name: z.string(),
        hero: z.union([heroSchema, z.string()])
      })
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should return no error if we use a deep external import with union", () => {
    const sourceTypes = {
      sourceText: `
      import { Villain } from "./villain-module.ts"
      
      import { Hero } from "./hero-module.ts"

      export interface Citizen {
        villain: Villain
        heroData: {
          name: string
          hero: { id:Hero } | string
        }
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";

    const villainSchema = z.any();
    
    const heroSchema = z.any();

    export const citizenSchema = z.object({
      villain: villainSchema,
      heroData: z.object({
        name: z.string(),
        hero: z.union([z.object({id: heroSchema}), z.string()])
      })
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should return an error if the types doesn't match", () => {
    const sourceTypes = {
      sourceText: `
      export type MyNumber = number;
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";
      export const myStringSchema = z.string();
      `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
        import { z } from "zod";

        import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
        import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function expectType<T>(_: T) {
          /* noop */
        }

        export type myStringSchemaInferredType = z.infer<typeof generated.myStringSchema>;

        expectType<myStringSchemaInferredType>({} as spec.MyNumber);
        expectType<spec.MyNumber>({} as myStringSchemaInferredType);
    `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toMatchInlineSnapshot(`
      [
        "'MyNumber' is not compatible with 'myStringSchema':
      Argument of type 'number' is not assignable to parameter of type 'string'.",
        "'myStringSchema' is not compatible with 'MyNumber':
      Argument of type 'string' is not assignable to parameter of type 'number'.",
      ]
    `);
  });

  it("should deal with optional value with default", () => {
    const sourceTypes = {
      sourceText: `
      export interface Citizen {
        /**
         * @default true
         */
        isVillain?: boolean;
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";
    export const citizenSchema = z.object({
      isVillain: z.boolean().optional().default(true)
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: false,
    });

    expect(errors).toEqual([]);
  });

  it("should skip defaults if `skipParseJSDoc` is `true`", () => {
    const sourceTypes = {
      sourceText: `
      export interface Citizen {
        /**
         * @default true
         */
        isVillain?: boolean;
      };
    `,
      relativePath: "source.ts",
    };

    const zodSchemas = {
      sourceText: `// Generated by ts-to-zod
    import { z } from "zod";
    export const citizenSchema = z.object({
      isVillain: z.boolean().optional()
    });
    `,
      relativePath: "source.zod.ts",
    };

    const integrationTests = {
      sourceText: `// Generated by ts-to-zod
      import { z } from "zod";

      import * as spec from "./${sourceTypes.relativePath.slice(0, -3)}";
      import * as generated from "./${zodSchemas.relativePath.slice(0, -3)}";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function expectType<T>(_: T) {
        /* noop */
      }

      export type CitizenInferredType = z.infer<typeof generated.citizenSchema>;

      expectType<CitizenInferredType>({} as spec.Citizen);
      expectType<spec.Citizen>({} as CitizenInferredType);
  `,
      relativePath: "source.integration.ts",
    };

    const errors = validateGeneratedTypes({
      sourceTypes,
      zodSchemas,
      integrationTests,
      skipParseJSDoc: true,
    });

    expect(errors).toEqual([]);
  });
});
