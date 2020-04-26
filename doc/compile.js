const path = require("path"),
	parseYamlDocProject = require("yaml-doc").default,
	applyBootstrapTemplate = require("yaml-doc-bootstrap").default;

const project = parseYamlDocProject(path.resolve(__dirname, "project.yaml"));
applyBootstrapTemplate(project);
