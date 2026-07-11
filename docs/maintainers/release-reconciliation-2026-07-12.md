# Release and distribution reconciliation — 2026-07-12

This is a read-only snapshot of the repository, Git remotes, npm registry, and
GitHub release state. It does not authorize publication, deployment, rename, or
registry submission.

## Verified state

| Surface                  | Evidence                                                                                | Reconciled status                                                                                                                                        |
| ------------------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canonical remote         | `origin` is `https://github.com/edithatogo/nz-legislation/`                             | Repository-local source of truth is the `nz-legislation` repository.                                                                                     |
| Git branches             | `main`=`3da8c027`, `next`=`858dd835`, current branch=`3bc8654d`                         | Branches exist; current feature branch is not a release branch.                                                                                          |
| GitHub releases          | Latest non-draft release `v1.2.0`                                                       | No release was created by this reconciliation.                                                                                                           |
| GitHub Packages          | Repository package API returned `404 Not Found`                                         | No visible GitHub Packages package was verified.                                                                                                         |
| Local package            | `nz-legislation-tool@1.2.0`, `private: true`, repository URL points to `nz-legislation` | Local publication remains disabled and metadata is repository-correct.                                                                                   |
| npm registry             | `nz-legislation-tool` latest `1.2.1`, published 2026-03-22                              | External package exists, but its repository metadata points to the stale `anz-legislation` URL and must not be treated as reconciled with this checkout. |
| Latest branch automation | Docs runs `29156384087` and earlier CodeQL/package-mirror runs passed                   | Current branch automation is green for the verified runs; historical failures remain historical.                                                         |

## Release decision

The umbrella track remains active and external-submission-blocked. The npm
registry package must not be republished, renamed, or claimed as synchronized
until maintainers explicitly authorize a metadata/version reconciliation and all
release gates pass. GitHub Packages and mirror credentials remain unverified.
