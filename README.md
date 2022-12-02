# test-freq

A command-line utility that outputs some frequency data about your unit tests. You can save the output to CSV and then pull it in to your favourite graphing program (Excel, Numbers, ...).

It works under the following circumstances:

 * You are working with JavaScript or TypeScript files
 * You are using a function named `it` to describe your tests
 * You are using `expect` to write your expectations

(That's not to say it couldn't be expanded to do something else; see the _Contributing_ section below.)

Right now it has two modes:

### Descriptions

`npx test-freq descriptions`

Outputs frequencies of your test description _starting verbs_. Example:

```
it("calculates the value", ...)
```

In this case, the starting verb is `calculates`.

The tool has special handling for test descriptions starting with `should`, `should not`, `does not`.

### Matchers

`npx test-freq matchers`

Outputs frequencies of the matchers used. Example:

```
expect(foo).toEqual(bar);
```

In this case, the matcher is `toEqual`.


## Contributing

All contributions are welcome! PRs, issues, etc.
