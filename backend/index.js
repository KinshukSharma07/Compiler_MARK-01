const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { spawnSync } = require('child_process');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive code and language from frontend
app.post('/evaluate', (req, res) => {
    const { code, language } = req.body;
    console.log(req.body);

    // Write code to a file
    let fileName;
    let compileCommand;
    if (language === 'cpp') {
        fileName = 'user_code.cpp';
        compileCommand = ['g++', fileName, '-o', 'user_code'];
    } else if (language === 'c') {
        fileName = 'user_code.c';
        compileCommand = ['gcc', fileName, '-o', 'user_code'];
    } else {
        return res.status(400).json({ error: 'Unsupported Language', message: 'The API only supports C++ and C languages' });
    }
    fs.writeFileSync(fileName, code);

    // Compile code if necessary
    let compileResult;
    if (language === 'cpp' || language === 'c') {
        compileResult = spawnSync(compileCommand[0], compileCommand.slice(1));
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
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
