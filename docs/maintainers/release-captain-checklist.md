# Release Captain Checklist

## Stable release

1. Confirm the target branch is `main`.
2. Confirm the PR set has correct changesets.
3. Confirm `CI` is green.
4. Confirm no emergency or incompatible work is still landing.
5. Let `Release Stable` create the release PR or publish.
6. Verify npm `latest` after publish.
7. Verify GitHub release notes and attached metadata.
8. Verify the GitHub Packages mirror path if that workflow is enabled remotely.
9. If automated npm publish is disabled, use `workflow_dispatch` after verifying npm publisher access or trusted publishing configuration.

## Prerelease

1. Confirm the target branch is `next`.
2. Confirm the work is intended for the governed prerelease lane only.
3. Confirm `CI` is green.
4. Run or allow `Release Next`.
5. Verify npm `next` dist-tag only.
6. Confirm no stable users are told to install the prerelease build.
7. If automated npm publish is disabled, use `workflow_dispatch` after verifying npm publisher access or trusted publishing configuration.

## After release

1. Check for immediate install or regression issues.
2. Update roadmap or release notes if a material scope decision changed.
3. Record anything unusual in the governance track progress log.
