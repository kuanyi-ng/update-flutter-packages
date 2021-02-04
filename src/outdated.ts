import { exec, ExecOptions } from "@actions/exec";

// TODO: add tests

export async function outdatedPackages() {
    let output = '';
    let error = '';

    const options: ExecOptions = {};
    options.silent = true;
    options.listeners = {
        stdout: (data: Buffer) => {
            output += data.toString();
        },
        stderr: (data: Buffer) => {
            error += data.toString();
        }
    };

    await exec('flutter', ['pub', 'outdated'], options);

    // TODO: error handling when error is emptyString
    console.log(error);

    let dependencies = parseFlutterPubOutdatedOutput(output);

    // TODO: only returns dependencies and devDependencies
    console.log(dependencies);
}

function parseFlutterPubOutdatedOutput(outputFromConsole: string): Dependencies {
    let dependencySections = splitIntoDependencySections(outputFromConsole);

    return {
        dependencies: dependencySections[0],
        devDependencies: dependencySections[1],
        transitiveDependencies: dependencySections[2],
        transitiveDevDependencies: dependencySections[3]
    };
}

function splitIntoDependencySections(fullText: string): DependencySection[] {
    // title of each dependency section
    const dependencySections = ['Dependencies', 'dev_dependencies', 'transitive dependencies', 'transitive dev_dependencies'];

    // split fullText into lines
    let lines = splitAndRemoveEmptyString(fullText, '\n');
    
    // find the starting index of each section
    let sectionStartIndexes: number[] = [];
    for (let sectionTitle of dependencySections) {
        let newSectionIndex = lines.findIndex(text => text.includes(sectionTitle));
        sectionStartIndexes.push(newSectionIndex);
    }

    // split lines into different sections
    let sections: Array<string[]> = [];
    for (let i = 0; i < sectionStartIndexes.length; i++) {
        let nextSection: string[];

        // startIndex of current section
        let startIndex = sectionStartIndexes[i];
                
        // if current section is the last section
        if ((i + 1) == sectionStartIndexes.length) {
            nextSection = lines.slice(startIndex);
        } else {
            let endIndex = sectionStartIndexes[i + 1];
            nextSection = lines.slice(startIndex, endIndex);
        }

        sections.push(nextSection);
    }

    return sections.map(parseIntoDependencySection);
}

function parseIntoDependencySection(section: string[]): DependencySection {
    let dependencies: Array<string[]> = [];

    let rows = section.slice(1);
    for (const row of rows) {
        let dependencyDetails = splitAndRemoveEmptyString(row, ' ');
        if (dependencyDetails.length == 5) {
            dependencies.push(dependencyDetails);
        }
    }

    return dependencies.map(parseIntoPackageVersionInfo);
}

function parseIntoPackageVersionInfo(dependency: string[]): PackageVersionInfo {
    return {
        packageName: dependency[0],
        currentVersion: dependency[1],
        upgradableVersion: dependency[2],
        resolvableVersion: dependency[3],
        latestVersion: dependency[4]
    };
}

function splitAndRemoveEmptyString(targetString: string, separator: string): string[] {
    return targetString
        .split(separator)
        .filter(element => element != '');
}

interface PackageVersionInfo {
    packageName: string,
    currentVersion: string,
    upgradableVersion: string,
    resolvableVersion: string,
    latestVersion: string
}

interface DependencySection {
    [index: number]: PackageVersionInfo
}

interface Dependencies {
    dependencies: DependencySection,
    devDependencies: DependencySection,
    transitiveDependencies: DependencySection,
    transitiveDevDependencies: DependencySection
}

