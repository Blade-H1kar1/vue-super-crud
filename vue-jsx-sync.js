let syncRe = /(.*)\_sync/;
const camelizeRE = /-(\w)/g;
const camelize = (str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));
};

var genListener = function genListener(t, event, body) {
  return t.objectProperty(
    t.stringLiteral("update:" + event),
    t.arrowFunctionExpression([t.identifier("$$val")], t.blockStatement(body))
  );
};

var genAssignmentCode = function genAssignmentCode(t, model) {
  return t.expressionStatement(
    t.assignmentExpression("=", model, t.identifier("$$val"))
  );
};

module.exports = function (babel) {
  const t = babel.types;

  return {
    inherits: require("babel-plugin-syntax-jsx"),
    visitor: {
      JSXOpeningElement: function (path) {
        let attrsObject, onObject;

        path.get("attributes").forEach(function (attr) {
          let matched = attr.node.name.name.match(syncRe);
          if (matched) {
            let prop = matched[1];
            attr.node.name.name = prop;

            let model;

            attr.traverse({
              JSXExpressionContainer: function (path) {
                model = path.node.expression;
              },
            });

            if (!t.isMemberExpression(model)) {
              console.error(
                "You should use MemberExpression with sync modifier, prop [" +
                  prop +
                  "] on node [" +
                  path.node.name.name +
                  "]"
              );
              return;
            }

            // Create attrs object if not already present
            if (!attrsObject) {
              attrsObject = t.jSXAttribute(
                t.jSXIdentifier("attrs"),
                t.jSXExpressionContainer(t.objectExpression([]))
              );
              path.pushContainer("attributes", attrsObject);
            }

            // Create on object if not already present
            if (!onObject) {
              onObject = t.jSXAttribute(
                t.jSXIdentifier("on"),
                t.jSXExpressionContainer(t.objectExpression([]))
              );
              path.pushContainer("attributes", onObject);
            }

            // Add the model to the attrs object
            attrsObject.value.expression.properties.push(
              t.objectProperty(t.stringLiteral(prop), model)
            );

            // Generate the listener for the on object
            let listener = genListener(t, camelize(prop), [
              genAssignmentCode(t, model),
            ]);
            onObject.value.expression.properties.push(listener);

            // Remove the original sync attribute
            attr.remove();
          }
        });
      },
    },
  };
};
