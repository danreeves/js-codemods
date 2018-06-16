module.exports = function(fileInfo, api, options) {
  const src = fileInfo.source;
  const js = api.jscodeshift;
  const ast = js(src);

  // Remove react-pure-render imports
  ast
    .find(js.ImportDeclaration)
    .filter(node => node.value.source.value.includes("react-pure-render"))
    .remove();

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

  // Change parent class to PureComponent
  ast
    .find(js.ClassDeclaration)
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
};
