
const fs = require("fs");
const path = require("path");
const readline = require("readline-sync");
const yaml = require('js-yaml');
const util = require("util");
const cp = require("child_process");

 let driverPath = __dirname;
 let tmpPath = path.join(driverPath, "tmp");
 const ioFilePath = path.join(tmpPath, "ioData_600-037.txt"); 

 function saveIOData(inputs, outputs, descriptions, ioFilePath) {
    // S'assurer que le répertoire existe
    const dir = path.dirname(ioFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    let combinedData = inputs.map((input, index) => {
        const inputFormatted = formatObject(input.message);
        const output = outputs[index];
        const outputEntries = Object.keys(output).map(key => {
            let record = output[key];
            let naturePart = record.nature ? `, nature: '${record.nature}'` : '';
            let eventTimePart = record.eventTime ? `, eventTime: '${record.eventTime}'` : '';
            let keyFormatted = key.match(/:\d+$/) ? `'${key}'` : key;
            return `${keyFormatted}: { unitId: '${record.unitId}', ` +
                   `${record.records ? 'records: ' + JSON.stringify(record.records) : 'record: ' + JSON.stringify(record.record)}`+
                   `${eventTimePart}${naturePart} }`;

        }).join(",\n  ");

        return `Description: ${descriptions[index]}\nINPUT\n{\n  message: ${inputFormatted}\n}\n\nOUTPUT\n{\n  ${outputEntries}\n}`;
    }).join("\n\n---------------------------------\n\n");

    fs.writeFileSync(ioFilePath, combinedData);
}

function formatObject(obj) {
    return JSON.stringify(obj, null, 2) // Pretty print the JSON with indentation
        .replace(/\"([^(\")"]+)\":/g, "$1:")  // Remove quotes around keys
        .replace(/\"/g, "'");
}

function formatObject(obj) {
    return JSON.stringify(obj, null, 2) // Pretty print the JSON with indentation
        .replace(/\"([^(\")"]+)\":/g, "$1:")  // Remove quotes around keys
        .replace(/\"/g, "'");
}

function readIOData(ioFilePath) {
    if (fs.existsSync(ioFilePath)) {
        const fileContent = fs.readFileSync(ioFilePath, 'utf8');
        const parts = fileContent.split('\nOutputs:\n');
        const inputsPart = parts[0].split('\n').slice(1); // Ignore the first line "Inputs:"
        const outputsPart = parts[1] ? parts[1].split('\n') : [];

        const inputs = inputsPart.map(input => JSON.parse(input));
        const outputs = outputsPart.map(output => JSON.parse(output));

        return { inputs, outputs };
    }
    return { inputs: [], outputs: [] };
}

if(!fs.existsSync("./node_modules/path")) {
    cp.execSync("npm install --save-dev path", {
        env: process.env,
        cwd: driverPath,
        stdio: "inherit",
    });
}

if(!fs.existsSync("./node_modules/readline-sync")) {
    cp.execSync("npm install --save-dev readline-sync", {
        env: process.env,
        cwd: driverPath,
        stdio: "inherit",
    });
}

if(!fs.existsSync("./node_modules/js-yaml")) {
    cp.execSync("npm install --save-dev js-yaml", {
        env: process.env,
        cwd: driverPath,
        stdio: "inherit",
    });
}

if(!fs.existsSync("./node_modules/util")) {
    cp.execSync("npm install --save-dev util", {
        env: process.env,
        cwd: driverPath,
        stdio: "inherit",
    });
}

let ontologyUnitsFolderPath = "./../../../../ontology/units.yaml";
let publicRepoURL = "https://github.com/actility/device-catalog";

function fixExtractPointsExport(driverPath) {
    let extractPointsFile = require(`${driverPath}/extractPoints.js`);
    let extractPointsContent = fs.readFileSync(`${driverPath}/extractPoints.js`, 'utf-8');
    if (extractPointsContent.includes("extractPoints") && !extractPointsFile.extractPoints) {
        fs.appendFileSync(`${driverPath}/extractPoints.js`, ";\n\nexports.extractPoints = extractPoints;", 'utf-8');
        delete require.cache[require.resolve(`${driverPath}/extractPoints.js`)];
        extractPointsFile = require(`${driverPath}/extractPoints.js`);
    }
}

fixExtractPointsExport(driverPath);

function getExamples() {
    let examples = [];

    let driverFolderContents = fs.readdirSync(driverPath);
    if(driverFolderContents.includes("examples.json")) {
        examples.push(...JSON.parse(fs.readFileSync(`${driverPath}/examples.json`, 'utf-8')));
    }
    else if(driverFolderContents.includes("examples")) {
        let examplesFiles = fs.readdirSync(`${driverPath}/examples`);
        for(let examplesFile of examplesFiles.filter(obj => obj.endsWith(".json"))) {
            let jsonExamples = JSON.parse(fs.readFileSync(`${driverPath}/examples/${examplesFile}`, 'utf-8'));
            examples.push(...jsonExamples);
        }
    }
    else {
        console.log("Could not find examples in this repository (device-catalog-private)");
        
        console.log("Cloning the public repository (device-catalog)...");
       
      
        if (!fs.existsSync(tmpPath)) {
            fs.mkdirSync(tmpPath);
        }
        
        if (!fs.existsSync(path.join(tmpPath, "device-catalog"))) {
            cp.execSync("git clone " + publicRepoURL, {
                env: process.env,
                cwd: path.join(tmpPath),
                stdio: "inherit",
            });
        }

        

        // Fonction pour sauvegarder les inputs et outputs
      
        
        
        
        
        // Au début de votre script, lisez les données si elles existent
        let { inputs, outputs } = readIOData();
        if (inputs.length > 0 && outputs.length > 0) {
            console.log("Using saved IO data.");
        } else {
            console.log("No saved IO data found, running checks...");
            // Vous pourriez vouloir exécuter checkOneExtractPoints ici si aucune donnée n'est trouvée
        }
        

        let branchList;
        try {
            // Execute git branch command synchronously
            const branches = cp.execSync('git branch -r', { 
                env: process.env,
                cwd: path.join(tmpPath, "device-catalog"),
                encoding: 'utf-8' 
            });
        
            // Split the output by newline character
            branchList = branches.trim().split('\n');
        
            // Extract branch names from the output
            branchList.forEach(branch => {
                console.log(`${branchList.indexOf(branch)+1}. ${branch.trim().replace(/^\*?\s/, '')}`);
            });
        } catch (error) {
            console.error('Error getting branches:', error);
        }
        
        const selectedBranchQuery = readline.question("Enter the # of the branch you want to checkout to: ");
        let selectedBranch = selectedBranchQuery ? branchList[parseInt(selectedBranchQuery)-1].trim() : "main";
        if(selectedBranch === "* main") selectedBranch = "main";

        console.log(`Checking out to ${selectedBranch}`);

        cp.execSync(`git checkout ${selectedBranch}`, {
            env: process.env,
            cwd: path.join(tmpPath, "device-catalog")
        });

        console.log("Looking for examples in the public repository (device-catalog)...");
        
        const currentDir = driverPath;
        let absoluteDriverPath = path.resolve(currentDir, driverPath);
        let publicRepoDriverPath = path.join(tmpPath, "device-catalog");
        let fullPublicRepoDriverPath = path.join();
        let dirName = path.basename(absoluteDriverPath);
        while(dirName !== "device-catalog-private" && dirName) {
            absoluteDriverPath = path.dirname(absoluteDriverPath);
            fullPublicRepoDriverPath = path.join(dirName, fullPublicRepoDriverPath);
            dirName = path.basename(absoluteDriverPath);
        }
        
        publicRepoDriverPath = path.join(publicRepoDriverPath, fullPublicRepoDriverPath);
        console.log(publicRepoDriverPath);

        try {
            driverFolderContents = fs.readdirSync(publicRepoDriverPath);
        }
        catch(err) {
            return [];
        }
        
        if(driverFolderContents.includes("examples.json")) {
            examples.push(...JSON.parse(fs.readFileSync(path.join(publicRepoDriverPath, "examples.json"), 'utf-8')));
        }
        else if(driverFolderContents.includes("examples")) {
            let examplesFiles = fs.readdirSync(path.join(publicRepoDriverPath, "examples"));
            for(let examplesFile of examplesFiles.filter(obj => obj.endsWith(".json"))) {
                let jsonExamples = JSON.parse(fs.readFileSync(path.join(publicRepoDriverPath, "examples", examplesFile), 'utf-8'));
                examples.push(...jsonExamples);
            }
        }
    }

    return examples;
}

let examples = getExamples();
if (examples.length > 0) {
    // Exécuter les vérifications seulement si les exemples sont présents
    let { inputs, outputs } = readIOData(ioFilePath);
    if (inputs.length > 0 && outputs.length > 0) {
        console.log("Using saved IO data.");
    } else {
        console.log("No saved IO data found, running checks...");
        // Exécution des tests unitaires ou d'autres vérifications ici
    }
}
let compilingErrors = [];

    

function checkOneExtractPoints(driverPath, jsonDriverExamples) {
    fixExtractPointsExport(driverPath);

    let driverXTP = require(`${driverPath}/extractPoints.js`);
    let extractPoints = driverXTP?.extractPoints;

    let descriptions = examples.filter(obj => obj.type === "uplink").map(obj => obj.description);
    let inputs = getInputs(jsonDriverExamples);
    let outputs = getOutputs(inputs, extractPoints);

    saveIOData(inputs, outputs,descriptions,ioFilePath);

    let allPoints = [];
    let ontology = getOntology();
        
    let warnings = [];

    console.log("\x1b[47m INPUTS/OUTPUTS \x1b[0m");
    for(let output of outputs) {
        let fieldUnitArray = {};

        console.log("\n---------------------------------\n");
        console.log("DESCRIPTION");
        console.log(descriptions[outputs.indexOf(output)], "\n");
        console.log("INPUT");
        console.log(util.inspect(inputs[outputs.indexOf(output)], { depth: null }), "\n");
        console.log("OUTPUT");
        console.log(util.inspect(output, { depth: null }));
        if(outputs.indexOf(output) == outputs.length-1) console.log("\n---------------------------------\n");

        for(let point in output) {

            if(!allPoints.includes(point)) allPoints.push(point);

            let matchingOntologyPoint = null;

            let object = output[point];
            
            // Checking point field unitId consistency
            let pointFieldSyntax = true;
            let pointConsistency = true;
            const checkConsistency = () => {
                if(point.split(":").length === 2){
                    let fieldIndex = point.split(":")[1];
                    if(fieldIndex.length > 1 || parseInt(fieldIndex) === NaN) {
                        pointFieldSyntax = false;
                        return;
                    }
                }
                if(point.split(":").length > 2) {
                    pointFieldSyntax = false;
                    return;
                }
                if(fieldUnitArray[point.split(":")[0]] && fieldUnitArray[point.split(":")[0]] !== object.unitId) pointConsistency = false;
            }
            
            // Checking point and sensor parity
            let pointParity = false;
            for(let sensor of ontology) {
                if(sensor.id === object.unitId && sensor.sensors.includes(point.split(":")[0])) {
                    pointParity = true;
                    checkConsistency();
                    fieldUnitArray[point.split(":")[0]] = object.unitId;
                    break;
                }
            }

            // Checking point existence
            let pointExists = false;
            for(let sensor of ontology) {
                if(sensor.sensors.includes(point.split(":")[0])) {
                    pointExists = true;
                    matchingOntologyPoint = sensor;
                    break;
                }
            }
            if(!pointExists) {
                let inexistenceError = new Error(`\x1b[43m WARN \x1b[0m [Existence]: Point with sensor name "${point.split(":")[0]}" DOES NOT exist \x1b[0m`);
                inexistenceError.stack = `Point "${point.split(":")[0]}" failed with existence test at "${driverPath}/extractPoints.js"`;
                inexistenceError.name = "";
                warnings.push(inexistenceError);
            }

            if(pointExists) {
                if(!pointParity) {
                    let parityError = new Error(`\x1b[43m WARN \x1b[0m [Parity]: unitId ${object.unitId} DOES NOT match sensor field "${point.split(":")[0]}" \x1b[0m`);
                    parityError.stack = `Point "${point.split(":")[0]}" failed with parity test at "${driverPath}/extractPoints.js"`;
                    parityError.name = "";
                    warnings.push(parityError);
                }
            }

            // Log of point field syntax check
            if(!pointFieldSyntax) {
                let consistencyError = new Error(`\x1b[43m WARN \x1b[0m [Consistency]: Field name "${point}" has incorrect syntax \x1b[0m`);
                consistencyError.stack = `Point "${point.split(":")[0]}" failed with point field syntax test at "${driverPath}/extractPoints.js"`;
                consistencyError.name = "";
                warnings.push(consistencyError);
            }

            // Log of consistency check
            if(!pointConsistency) {
                let consistencyError = new Error(`\x1b[43m WARN \x1b[0m [Consistency]: Field name "${point.split(":")[0]}" already has a different unitId "${fieldUnitArray[point.split(":")[0]]}" that DOES NOT match new unitId "${object.unitId}" \x1b[0m`);
                consistencyError.stack = `Point "${point.split(":")[0]}" failed with consistency test at "${driverPath}/extractPoints.js"`;
                consistencyError.name = "";
                warnings.push(consistencyError);
            }

            // Checking point record type
            let typeMatch = true;
            
            if(pointParity) {
                if(object.record !== null) {
                    if(!checkType(object.record, matchingOntologyPoint.type)) {
                        let recordTypeError = new Error(`\x1b[43m WARN \x1b[0m [Record Type]: Type of record "${typeof object.record}" DOES NOT match required sensor value type of "${matchingOntologyPoint.type}" \x1b[0m`);
                        recordTypeError.stack = `Point "${point.split(":")[0]}" failed with type test at "${driverPath}/extractPoints.js"`;
                        recordTypeError.name = "";
                        warnings.push(recordTypeError);

                        typeMatch = false;
                    }
                }
                else if(object.records !== null) {
                    for(let record of object.records) {
                        if(!checkType(record, matchingOntologyPoint.type)) {
                            typeMatch = false;
                        }
                    }
                    if(!typeMatch) {
                        let recordTypeError = new Error(`\x1b[43m WARN \x1b[0m [Record Type]: Type of at least one record in array DOES NOT match the required sensor type "${matchingOntologyPoint.type}" \x1b[0m`);
                        recordTypeError.stack = `Point "${point.split(":")[0]}" failed with type test at "${driverPath}/extractPoints.js"`;
                        recordTypeError.name = "";
                        warnings.push(recordTypeError);
                    }
                }
                else {
                    let recordTypeError = new Error(`\x1b[43m WARN \x1b[0m [Record Type]: Neither \"record\" nor \"records\" values attributes are defined \x1b[0m`);
                    recordTypeError.stack = `Point "${point.split(":")[0]}" failed with record type test at "${driverPath}/extractPoints.js"`;
                    recordTypeError.name = "";
                    warnings.push(recordTypeError);
                    
                    typeMatch = false;
                }
            }

        }
    }

    let codeCheckWarnings = checkCode(allPoints, driverPath, extractPoints);
    
    return [compilingErrors, warnings, codeCheckWarnings];
}

function getInputs(examples) {
    if(examples.length === 0) return [];
    
    let inputs = examples.filter(example => example.type === "uplink").map(obj => {
        let input = {};
        if(obj.output) {
            input = obj.output.data ?? obj.output;
        }
        else if(obj.data) {
            input = obj.data;
        }
        return { message: input };
    });

    return inputs;
}

function getOutputs(inputs, extractPoints) {
    let outputsArray = [];
    compilingErrors = [];
    for(let input of inputs) {
        try {
            let output = extractPoints(input);
            outputsArray.push(output);
        } catch(err) {
            let error = err;
            error.message = `${err}`;
            error.name = "";
            error.stack = [error.stack.split("\n")[0], error.stack.split("\n")[1]].join("\n");
            compilingErrors.push(error);
            outputsArray.push({});
        }
    }

    return outputsArray;
}

function getOntology() {
    // Read YAML file
    let yamlData = fs.readFileSync(ontologyUnitsFolderPath, 'utf8');

    // Convert YAML to JS object
    const jsonData = yaml.load(yamlData);

    // If jsonData is an array, you're done. If not, put it in an array.
    const jsonArray = Array.isArray(jsonData) ? jsonData : [jsonData];

    let ontologyArray = [];
    for(let sensor of jsonArray) {
        let sensorObject = JSON.parse(JSON.stringify(sensor));

        if(sensor.parentId && !sensor.sensors) {
            let parentSensor = jsonArray.find(obj => obj.id === sensor.parentId);
            sensorObject.sensors = parentSensor.sensors;
        }

        ontologyArray.push(sensorObject);
    }

    return ontologyArray;
}

function checkCode(points, driverPath, extractPoints) {
    let code = extractPoints.toString();
    let codeWarns = [];
    for(let point of points) {
        let occurrences = code.split(point).length - 1;
        if(occurrences > 1) {
            codeWarns.push(`\x1b[43m WARN \x1b[0m [Point Repetition]: \tPoint ${point} appears ${occurrences} times in the extractPoints code \x1b[0m`);
        }
    }

    if(codeWarns.length) {
        let warnings = new Error(`Code Warnings in extractPoints at ${driverPath}:`);
        warnings.stack = codeWarns.join("\n");
        return [warnings];
    }

    return [];
    
}

function checkType(record, ontologySensorType) {
    let UnitType = {
        STRING: "string",
        INT64: "int64",
        DOUBLE: "double",
        BOOLEAN: "boolean",
        OBJECT: "object"
    }

    let type = typeof record;
    let typesMatch = 
        (type === 'number' && (ontologySensorType === UnitType.INT64 || ontologySensorType === UnitType.DOUBLE)) ||
        (type === 'object' && ontologySensorType === UnitType.OBJECT) ||
        (type === 'string' && ontologySensorType === UnitType.STRING) ||
        (type === 'boolean' && ontologySensorType === UnitType.BOOLEAN);
    
    return typesMatch;
}

// TEST RESULTS
console.log("\x1b[44m\n\n POINT UNIT TESTING\n", "\x1b[0m\n");
if(examples.length === 0) {
    throw Error("No examples found. Please add examples to test.");
}

let results = checkOneExtractPoints(driverPath, examples);
for(issue of results) {

    if(results.indexOf(issue) === 0) console.log("\x1b[41m", "COMPILATION ERRORS", "\x1b[0m");
    else if(results.indexOf(issue) === 1) console.log("\x1b[43m", "WARNINGS", "\x1b[0m");
    else console.log("\x1b[45m", "CODE CHECKS WARNINGS", "\x1b[0m");

    for(item of issue) {
        switch(results.indexOf(issue)) {
            case 0:
                console.log(item);
                break;
            case 1:
                console.log(item.toString());
                break;
            default:
                console.log(item.stack, "\n");
        }
    }
    console.log("");
    if(issue.length === 0) console.log("Nothing wrong here...\n");
}

try {
    describe("extractPoints.script.js", () => {
        let i = 0;
        test('extractPoints compilation results', () => {
            if(examples.length-1 >= i && results[0].length-1 >= i) expect(results[0][i]).toBe(true);
            else if(examples.length-1 >= i) expect(true).toBe(true);
            else return;
            i++;
        });
    })
} catch(err) {

}





