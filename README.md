<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Send Test Results to Hatchways

This actions sends test result JUnit XML files to the Hatchways Platform.

Sending the test results to the Hatchways Platform allows you to see the integrated results in the same place where you're making decisions about candidates, as opposed to having to log into GitHub. It also allows you the ability to automate decisions about a candidate based on those test results (for example, to move them forward or not in the hiring process).

## Required Inputs

### `if: always()`

This key-value pair should always be added. Otherwise, if the tests fail, the action will stop. By adding this, you can make sure that the results of the tests are always sent to the Hatchways Platform, even if the tests fail.

### `with`

#### `api_key`

The value of the `api_key` should always be `${{ secrets.HATCHWAYS_API_KEY }}`.

This key is automatically added to the repository created when a candidate submits their assessment for review. For more information about this kind of automatically created repository, read the "Candidate Repositories and Marking Repositories" section in the [official platform documentation](https://docs.hatchways.io/docs/automating-an-assessment#4-optional-display-automated-tests-results-in-the-hatchways-platform).

#### `files`

The value of the `files` key is a list of the `xml` test files that you want to send to the Hatchways Platform. It's important to note that the format of the output files should be **JUnit XML**. Most testing frameworks nowadays support this format.

You can use glob patterns to specify many different files in a single entry of the list.

## Usage

Here is an example of what the `hatchways-action` section of the GitHub Actions file could look like:

```yaml
- uses: hatchways/hatchways-action@v1
  if: always()
  with:
    api_key: ${{ secrets.HATCHWAYS_API_KEY }}
    files: |
      - outputs/*.xml
```

It's important to note that this action should be added after the tests are run and the output file (a JUnit XML file) has been created.

### Example: Jest JavaScript Testing Framework

Here is an example of what a GitHub Actions file might look like if it's running tests using the Jest JavaScript testing framework:

```yaml
- name: Install jest-junit reporter
  run: npm install --save-dev jest-junit
- name: Run tests
  if: always()
  run: jest --verbose --reporters=default --reporters=jest-junit
- uses: hatchways/hatchways-action@v1
  if: always()
  with:
    api_key: ${{ secrets.HATCHWAYS_API_KEY }}
    files: |
      - test-results/*.xml # this can be glob format, just showing that here
```

### Example: Pytest Python Testing Library

Here is an example of what a GitHub Actions file might look like if it was running tests using the Pytest Python library:

```yaml
- name: Run tests
  run: pytest tests/ -v --junitxml="test-results/result.xml"
- uses: hatchways/hatchways-action@v1
  if: always()
  with:
    api_key: ${{ secrets.HATCHWAYS_API_KEY }}
    files: |
      - test-results/api-tests.xml
```

## Official Docs

For more information and examples of using the `hatchways-action` with different testing frameworks, please reference the action's [Official Docs](https://docs.hatchways.io/docs/using-the-hatchways-action-github-action).
