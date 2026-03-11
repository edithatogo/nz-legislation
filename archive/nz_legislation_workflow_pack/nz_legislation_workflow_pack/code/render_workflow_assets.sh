#!/usr/bin/env bash
set -euo pipefail
dot -Tsvg workflow.dot -o ../images/workflow_graphviz.svg
dot -Tpng -Gdpi=180 workflow.dot -o ../images/workflow_graphviz.png
dot -Tsvg workflow_portrait.dot -o ../images/workflow_portrait.svg
dot -Tpng -Gdpi=180 workflow_portrait.dot -o ../images/workflow_portrait.png
