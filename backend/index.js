const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { spawnSync } = require('child_process');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive C++ code from frontend
app.post('/evaluate/cpp', (req, res) => {
    handleEvaluation(req, res, 'cpp');
});

// Endpoint to receive C code from frontend
app.post('/evaluate/c', (req, res) => {
    handleEvaluation(req, res, 'c');
});

// Endpoint to receive Python code from frontend
app.post('/evaluate/python', (req, res) => {
    handleEvaluation(req, res, 'python');
});

// Endpoint to receive Java code from frontend
app.post('/evaluate/java', (req, res) => {
    handleEvaluation(req, res, 'java');
});

// Function to handle evaluation for all languages
function handleEvaluation(req, res, language) {
    const { code } = req.body;

    // Write code to a file
    let fileName;
    let compileCommand;
    if (language === 'cpp') {
        fileName = 'user_code.cpp';
        compileCommand = ['g++', fileName, '-o', 'user_code'];
    } else if (language === 'c') {
        fileName = 'user_code.c';
        compileCommand = ['gcc', fileName, '-o', 'user_code'];
    } else if (language === 'python') {
        fileName = 'user_code.py';
        fs.writeFileSync(fileName, code);
    } else if (language === 'java') {
        fileName = 'Main.java';
        fs.writeFileSync(fileName, code);
        compileCommand = ['javac', fileName];
    } else {
        return res.status(400).json({ error: 'Unsupported Language', message: 'The API only supports C++, C, Python, and Java languages' });
    }

    // Compile code if necessary
    if (language === 'cpp' || language === 'c' || language === 'java') {
        const compileResult = spawnSync(compileCommand[0], compileCommand.slice(1));
        if (compileResult.status !== 0) {
            const errorMessage = compileResult.stderr.toString();
            return res.status(400).json({ error: 'Compilation Error', message: errorMessage });
        }
    }

    // Read test cases from file
    const testCases = JSON.parse(fs.readFileSync('testcase.json'));

    // Store results of each test case
    const results = [];

    // Run code against each test case
    testCases.forEach((testCase, index) => {
        const inputValues = Object.values(testCase.input);
        const input = inputValues.join(' ');
        const expectedOutput = testCase.output.toString();

        let output;
        let success;
        if (language === 'cpp' || language === 'c') {
            output = spawnSync('./user_code', { input, encoding: 'utf-8' }).stdout.trim();
            success = output === expectedOutput;
        } else if (language === 'python') {
            output = spawnSync('python', [fileName], { input, encoding: 'utf-8' }).stdout.trim();
            success = output === expectedOutput;
        } else if (language === 'java') {
            const className = fileName.replace('.java', '');
            const javaProcess = spawnSync('java', [className], { input, encoding: 'utf-8' });
            output = javaProcess.stdout.trim();
            success = output === expectedOutput;
        }

        // Store result of current test case
        results.push({
            input: inputValues,
            expectedOutput,
            actualOutput: output,
            success
        });
    });

    // Write results to a JSON file
    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));

    // Send response to frontend
    res.json(results);
}

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
