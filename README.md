# Notice (2022.10.09)

Development and maintenance of this GitHub Action is stopped because `pub` is officially supported by [Dependabot](https://dependabot.com/).
Please consider to migrate over to Dependabot if you are using this GitHub Action.

You can checkout the [official documentation](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file) for information on how to configure the Dependabot.
Below is an example of the `dependabot.yml` for `pub`.
```yml
# Check the official documentation for the latest configuration
# as the content here might be old (written on 2022/10/09).
version: 2
updates:
  - package-ecosystem: "pub"
    directory: "/"
    schedule:
      interval: "daily"
```

Also, you can check [this PR](https://github.com/kuanyi-ng/update-flutter-packages/pull/208) to get a sense of how Dependabot works with `pub`.

Reference links:
- [`pub` being listed as one of the supported ecosystem in the official documentation.](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#package-ecosystem)
- [(GitHub Blog) pub beta support for Dependabot version updates](https://github.blog/changelog/2022-04-05-pub-beta-support-for-dependabot-version-updates/)
- [(GitHub Blog) GitHub’s supply chain features now support Dart](https://github.blog/changelog/2022-10-06-githubs-supply-chain-features-now-support-dart/)
- [(GitHub Blog) GitHub’s supply chain security features now support Dart](https://github.blog/2022-10-06-githubs-supply-chain-security-features-now-support-dart/)

---

<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Flutter Pubspec Updater

## Background
[Dependabot](https://dependabot.com/) is a great tool to keep dependencies up-to-date, but the package manager, `pub` is not supported. 
According to their [Contributions Guide](https://github.com/dependabot/dependabot-core/blob/main/CONTRIBUTING.md#why-have-we-paused-accepting-new-ecosystems), they won't be adding support to new package manager until at least June 2021.

After googling for a while, I found [Flutter Package Updater](https://github.com/tianhaoz95/update-flutter-packages), a GitHub Action which opens a pull request to update all the packages defined in `pubspec.yaml`.
[Flutter Package Updater](https://github.com/tianhaoz95/update-flutter-packages) does via the command `$ flutter pub upgrade` and updates the `pubspec.lock` in a Flutter repository.

However, I did not use the GitHub Action mentioned above.
I prefer updating dependencies in `pubspec.yaml` instead of `pubspec.lock` as `pubspec.yaml` is easier to read and `pubspec.lock` when I want to check the packages' versions I'm using.

## Solution
Instead of upgrading `pubspec.lock` with the command `$ flutter pub upgrade`, this action will update `pubspec.yaml` based on the outputs from the command `$ flutter pub outdated`.
After `pubspec.yaml` is updated, this action will run `$ flutter pub get` to update `pubspec.lock` based on the updated `pubspec.yaml`.

Documentations for each commands (direct to Dart Documentation)
- [`pub upgrade`](https://dart.dev/tools/pub/cmd/pub-upgrade)
- [`pub outdated`](https://dart.dev/tools/pub/cmd/pub-outdated)

This actions requires:
- [`actions/checkout@v2`](https://github.com/actions/checkout)
  - allow GitHub Action to access codes this repository
- [`actions/setup-java@v1`](https://github.com/actions/setup-java)
  - setup Java environment (required by `flutter-action@v1`) on GitHub Action virtual machine
- [`subosito/flutter-action@v1`](https://github.com/subosito/flutter-action)
  - setup Flutter environment on GitHub Action virtual machine
  - enable usage of Flutter cli-commands
- [`peter-evans/create-pull-request@v3`](https://github.com/peter-evans/create-pull-request)
  - create a pull request to apply updates on `pubspec.yaml`

## Usage
```yaml
# use the latest version
- name: Update Flutter Packages
  uses: kuanyi-ng/update-flutter-packages@main

# use a specific version
- name: Update Flutter Packages
  uses: kuanyi-ng/update-flutter-packages@v0.1.0
```

### Action inputs
Currently, there's only one input and it's **optional**.

| Input Name | Description | Default Value |
| --- | --- | --- |
| `pathToPubspecFile` | relative path to `pubspec.yaml` file from the repository's root directory. | `./pubspec.yaml` |

### Action outputs
There's only one output from this action.

| Output Name | Description | Type |
| --- | --- | --- |
| `pullRequestRequired` | a boolean value deciding if a new pull request should be made or not (using another GitHub Action). | `boolean` |

## Example

```yaml
jobs:
  updateDependencies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up Java environment
        uses: actions/setup-java@v1
        with:
          java-version: '12.x'

      - name: Set up Flutter environment
        uses: subosito/flutter-action@v1
        with:
          channel: 'stable' # or: 'beta' or 'dev'
    
      - name: Update Flutter Packages
        uses: kuanyi-ng/update-flutter-packages@main

      - name: Create Pull Request to Apply Dependencies Updates
        uses: peter-evans/create-pull-request@v3
        with: # refer to https://github.com/peter-evans/create-pull-request for customization of inputs
          commit-message: 'update pubspec.yaml based on `$ flutter pub outdated`'
          branch: flutter-pub-outdated
          base: main # sets the pull request base branch here
          delete-branch: true
          title: 'Update Pubspec.yaml'
          body: 'update pubspec.yaml based on `$ flutter pub outdated`'
          labels: 'dependencies'
```
