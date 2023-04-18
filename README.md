<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Send Test Results to Hatchways

This actions sends test result JUnit XML files to Hatchways.

## Usage:

```yaml
- uses: hatchways/hatchways-action@main
  with:
    api_key: ${{ secrets.HATCHWAYS_API_KEY }}
    files: |
      - outputs/*.xml
```
