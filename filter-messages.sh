#!/bin/bash
# Git commit message filter script for nz-legislation-tool extraction
# Removes references to "conductor", "track", and health research work

sed -e "s/(conductor)//g" \
    -e "s/Track [0-9]* - //g" \
    -e "s/Add track improvements and new DX\/Performance tracks/Improve developer experience and performance/g" \
    -e "s/sync local workspace and conductor status metadata/Update project metadata/g" \
    -e "s/Complete Track 11 - Advanced Automation & Hardening/Add advanced automation and hardening/g" \
    -e "s/Add Track 11 to registry and mark as in progress/Add automation track/g" \
    -e "s/Current Schemas & Standards Analysis/Update schemas and standards/g" \
    -e "s/Integrate Perplexity external research findings/Integrate external research/g" \
    -e "s/Track 12 Action Summary - Clear Next Steps/Update action items/g" \
    -e "s/Track 12 Phase 2 Planning Documents/Add planning documents/g" \
    -e "s/Track 12 Phase 1 Research Complete - Australian API Documentation/Document Australian API/g" \
    -e "s/Add Track 12 - Australian Legislation API Integration Feasibility/Add Australian legislation feasibility study/g" \
    -e "s/ chore/conductor: chore/g" \
    -e "s/ docs/conductor: docs/g" \
    -e "s/ feat/conductor: feat/g" \
    -e "s/ fix/conductor: fix/g"
