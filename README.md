# js-codemods

> A place to save the jscodeshift codemods I write

## Usage

```sh
npm run jscodeshift -- -t ./transforms/[pick a transform] ~/your/src/dir
```

If you're using flow you will need to also add `--parse flow`.

## Codemods

- [react-pure-render](./transforms/react-pure-render.js)

  It ports React code using the `react-pure-render` package over to using the builtin `React.PureComponent`

# License

See the [license file](./LICENSE)
