# RELEASES

## This document outlines the release process and policy for the interplanetary-notebook project and related services

### 1. Version Numbering

We follow Semantic Versioning (SemVer) for our releases:

- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backwards compatible manner
- PATCH version for backwards compatible bug fixes

Example: 1.2.3 (Major.Minor.Patch)

### 2. Release Cycle

- We aim for a regular release cycle with new versions every two weeks.
- Major releases are scheduled quarterly, pending significant changes.
- Hotfixes may be released as needed for critical bugs or security issues.

### 3. Release Branches

- `main` branch: Always represents the latest stable release.
- `develop` branch: Integration branch for features and non-critical fixes.
- `release-x.y.z` branches: Created for each release for final testing and preparation.
- `hotfix-x.y.z` branches: Created for emergency fixes to be applied to main.

### 4. Release Process

1. **Feature Freeze**
   - All features for the upcoming release must be merged into `develop` by this date.
   - Code freeze begins; only bug fixes are allowed after this point.

2. **Create Release Branch**
   - Branch `release-x.y.z` is created from `develop`.
   - Version numbers in relevant files are updated.

3. **Testing and Stabilization**
   - Thorough testing is performed on the release branch.
   - Only bug fixes are committed directly to this branch.
   - Significant bugs found are fixed in `develop` and cherry-picked to the release branch.

4. **Documentation Update**
   - Ensure all documentation is up-to-date, including README, API docs, and CHANGELOG.

5. **Final Testing**
   - Perform final round of testing, including integration and performance tests.

6. **Release Candidate**
   - If needed, publish a release candidate for wider testing.

7. **Merge to Main**
   - Once stabilized, the release branch is merged into `main`.
   - `main` is tagged with the new version number.

8. **Build and Deploy**
   - Automated CI/CD pipeline builds and deploys the release.

9. **Publish Release**
   - Create a new release on GitHub with release notes.
   - Update the project website and documentation.

10. **Post-Release**
    - Merge `main` back into `develop` to sync version numbers.
    - Clean up any completed feature branches.

### 5. Hotfix Process

1. Create a `hotfix-x.y.z` branch from `main`.
2. Implement and test the fix.
3. Merge the hotfix branch into both `main` and `develop`.
4. Tag `main` with the new patch version.
5. Build, test, and deploy the hotfix.

### 6. Release Artifacts

Each release should include:

- Compiled binaries for supported platforms
- Source code (as a zip and tarball)
- Release notes detailing changes, bug fixes, and any breaking changes
- Updated documentation

### 7. Communication

- Upcoming releases are announced on our project mailing list and Slack channel.
- Release notes are published on GitHub and the project website.
- Major releases may include a blog post detailing significant changes.

### 8. Support Policy

- The latest major version receives full support and regular updates.
- The previous major version receives critical bug fixes and security updates for 6 months.
- Earlier versions are considered unsupported.

### 9. Deprecation Policy

- Features to be deprecated are marked as such in the codebase and documentation.
- Deprecated features remain functional for at least one major release cycle before removal.

### 10. Release Approval

- Each release must be approved by the project lead and at least one other core maintainer.
- Approval is based on meeting quality standards, passing all tests, and completing all release checklist items.

This release process is subject to change as our project evolves. Any significant changes to this process will be communicated to all team members and contributors.
