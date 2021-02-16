<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Update Flutter Packages (GitHub Action)

## Background
[Dependabot](https://dependabot.com/) is a great tool to keep dependencies up-to-date, but currently the package manager, `pub` is not supported. 
According to their [Contributions Guide](https://github.com/dependabot/dependabot-core/blob/main/CONTRIBUTING.md#why-have-we-paused-accepting-new-ecosystems), they won't be adding support to new package manager until at least June 2021.

After googling for awhile, I found [Flutter Package Updater](https://github.com/tianhaoz95/update-flutter-packages), a GitHub Action which opens a pull request to update all the packages defined in `pubspec.yaml`.
[Flutter Package Updater](https://github.com/tianhaoz95/update-flutter-packages) does it using the command `$ flutter pub upgrade` and updates the `pubspec.lock` in a Flutter repository.

However, I did not use the GitHub Action mentioned above.
Personally, I prefer dependencies updates to be performed on `pubspec.yaml` instead of `pubspec.lock` as `pubspec.yaml` is easier to read and `pubspec.lock` when I want to check the packages' versions I'm using.

## Solution
Instead of upgrading `pubspec.lock` with the command `$ flutter pub upgrade`, this action will update `pubspec.yaml` based on the outputs from the command `$ flutter pub outdated`.
After `pubspec.yaml` is updated, this action will run `$ flutter pub get` to update `pubspec.lock` based on the updated `pubspec.yaml`.

Documentations for each commands (direct to Dart Documentation)
- [`pub upgrade`](https://dart.dev/tools/pub/cmd/pub-upgrade)
- [`pub outdated`](https://dart.dev/tools/pub/cmd/pub-outdated)

This actions requires:
- [`actions/checkout@v2`]()
  - allow GitHub Action to access codes this repository
- [`actions/setup-java@v1`]()
  - setup Java environment (required by `flutter-action@v1`) on GitHub Action virtual machine
- [`subosito/flutter-action@v1`]()
  - setup Flutter environment on GitHub Action virtual machine
  - enable usage of Flutter cli-commands
- [`peter-evans/create-pull-request@v3`]()
  - create a pull request to apply updates on `pubspec.yaml`

## Usage
```yaml
- name: Update Flutter Packages
  uses: # TODO: write here after publishing to GitHub Marketplace
```

### Action inputs
Currently, there's only one input and it's **optional**.

| Input Name | Description | Default Value |
| --- | --- | --- |
| `pathToPubspecFile` | relative path to `pubspec.yaml` file from the repository's root directory. | `./pubspec.yaml` |

### Action outputs
This action doesn't have any outputs

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
        uses: # TODO: write here after publishing to GitHub Marketplace

      - name: Create Pull Request to Apply Dependencies Updates
        uses: peter-evans/create-pull-request@v3
        with: # refer to https://github.com/peter-evans/create-pull-request for customization of inputs
          commit-message: 'update pubspec.yaml based on `$ flutter pub outdated`'
          branch: flutter-pub-outdated
          base: main
          delete-branch: true
          title: 'Update Pubspec.yaml'
          body: 'update pubspec.yaml based on `$ flutter pub outdated`'
          labels: 'dependencies'
```

---

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
