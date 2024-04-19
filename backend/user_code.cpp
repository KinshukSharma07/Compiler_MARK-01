#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    // Prompt the user to enter a string
    string input;
    getline(cin, input); // Read the entire line including spaces

    // Sort the string
    sort(input.begin(), input.end());

    // Display the sorted string
    cout << input << endl;

    return 0;
}
