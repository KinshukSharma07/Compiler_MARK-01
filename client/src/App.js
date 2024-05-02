import React, { useState } from 'react';
import axios from 'axios';
import AceEditor from 'react-ace'; // Import AceEditor
import 'ace-builds/src-noconflict/mode-c_cpp'; // Import C++ mode
import 'ace-builds/src-noconflict/theme-monokai'; // Import Monokai theme

const App = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [testResults, setTestResults] = useState(null);

  const handleRunCode = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post(`http://localhost:5000/evaluate/${language}`, { code });
      // Handle response from backend
      console.log(response.data);
      setTestResults(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-md shadow-md" onSubmit={handleRunCode}>
        <h2 className="text-xl font-semibold mb-4">Code Compiler</h2>
        <div className="mb-4">
          <label htmlFor="code" className="block text-gray-700">Enter your code:</label>
          <AceEditor
            className='rounded-lg'
            mode="c_cpp" // Set the mode to C++
            theme="monokai" // Set the theme (you can change it)
            onChange={setCode} // Handle onChange event
            value={code}
            name="code"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="300px"
            fontSize={16}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="language" className="block text-gray-700">Select language:</label>
          <select
            id="language"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="" disabled>Select language</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none"
        >Submit</button>
      </form>
      {testResults && (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-md shadow-md relative">
          {testResults.success && (
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <p>Code passed for at least one test case: {testResults.success.toString()}</p>
          <pre>{JSON.stringify(testResults.results.success, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
