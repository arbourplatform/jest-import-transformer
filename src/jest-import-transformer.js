/* eslint-env node */

/**
 * Remember to increase the version whenever transformer's content is changed. This is to inform Jest to not reuse
 * the previous cache which contains old transformer's content
 */
const version = 2;
const name = "jest-mocks-import-transformer";

/**
 * Determines if a node is the string containing module path of a manual mock registration:
 * jest.mock("./service");
 */
function isManualMockRegistration(ts, node) {
  if (!ts.isExpressionStatement(node)) {
    return false;
  }

  const callExpression = node.expression;
  if (!ts.isCallExpression(callExpression)) {
    return false;
  }

  const propertyExpression = callExpression.expression;
  if (!ts.isPropertyAccessExpression(propertyExpression)) {
    return false;
  }

  return propertyExpression.getText() === "jest.mock";
}

/**
 * Determines if a node is the string containing module path of a manual mock import:
 * import { ... } from "./__mocks__/service";
 */
function isDirectManualMockImport(ts, node) {
  if (!ts.isStringLiteral(node)) {
    return false;
  }

  if (!ts.isImportDeclaration(node.parent)) {
    return false;
  }

  return node.text.includes("/__mocks__/");
}

function createVisitor(ts, ctx, manualMocks) {
  const visitor = (node) => {
    if (isDirectManualMockImport(ts, node)) {
      const originalPath = node.text.replace("/__mocks__/", "/");
      if (manualMocks.has(originalPath)) {
        /*
            Rewrites direct manual mock import, which allows TypeScript to provide proper typings
            ```
            import { ... } from "./__mocks__/service";
            ```
            
            to original module import which jest will then does its magic:
            ```
            import { ... } from "./service";
            ```
            */
        node.text = originalPath;
      }
    }

    return ts.visitEachChild(node, visitor, ctx);
  };

  return visitor;
}

function factory({ configSet }) {
  const ts = configSet.compilerModule;

  return (ctx) => {
    return (sf) => {
      const manualMocks = new Set();

      // Build a list of jest.mock calls
      ts.visitEachChild(
        sf,
        (node) => {
          if (isManualMockRegistration(ts, node)) {
            manualMocks.add(node.expression.arguments[0].text);
          }

          return node;
        },
        ctx
      );

      // Visit nodes and update imports
      return ts.visitNode(sf, createVisitor(ts, ctx, manualMocks));
    };
  };
}

module.exports = { version, name, factory };
