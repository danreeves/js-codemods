import { get } from "lodash";

export default function(fileInfo, api, options) {
  const src = fileInfo.source;
  const js = api.jscodeshift;
  const ast = js(src);

  // Remove react-pure-render imports
  const reactPureRenderImports = ast
    .find(js.ImportDeclaration)
    .filter(node => node.value.source.value.includes("react-pure-render"));

  if (!reactPureRenderImports.length) {
    return ast.toSource();
  }

  reactPureRenderImports.remove();

  // Remove shouldComponentUpdate ClassProperty
  ast
    .find(js.ClassProperty)
    .filter(node => {
      const actualNode = node.value;
      const key = actualNode.key;
      const val = actualNode.value;
      return (
        key &&
        val &&
        key.name === "shouldComponentUpdate" &&
        val.name === "shouldPureComponentUpdate"
      );
    })
    .remove();

  // Remove shouldComponentUpate AssignmentExpression
  ast
    .find(js.AssignmentExpression)
    .filter(nodepath => {
      const node = nodepath.value;
      return (
        get(node, "left.property.name") === "shouldComponentUpdate" &&
        get(node, "right.name") === "shouldPureComponentUpdate"
      );
    })
    .remove();

  // Change parent class to PureComponent
  function fixSuperClass(collection) {
    return collection
      .filter(nodepath => {
        const node = nodepath.value;
        const name = node.superClass.name || node.superClass.property.name;
        return name && name === "Component";
      })
      .replaceWith(nodepath => {
        const node = nodepath.value;
        if (node.superClass.property) {
          node.superClass.property.name = "PureComponent";
        } else {
          node.superClass.name = "PureComponent";
        }
        return node;
      });
  }
  fixSuperClass(ast.find(js.ClassDeclaration));
  fixSuperClass(ast.find(js.ClassExpression));

  // Update imports
  ast
    .find(js.ImportSpecifier)
    .filter(nodepath => {
      const node = nodepath.value;
      return node.imported.name === "Component";
    })
    .replaceWith(nodepath => {
      const node = nodepath.value;
      node.imported.name = "PureComponent";
      return node;
    });

  return ast.toSource();
}
