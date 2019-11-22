# OEM - Automagic 🦄 Project Scaffolding with Code Generation.

Use OEM to build generate code for your projects or as a tool for more complex code generation needs.

The CLI requires a file named `.oemrc.js` anywhere in the directory tree you're in, e.g.: next to `package.json`.

```sh
yarn add oem
```

## Example

```js
// .oemrc.js
module.exports = {
  example({ name }) {
    return {
      [name]: ({ name }) => `Hello, ${name}!`
    };
  }
};
```

Now when you run

```sh
oem example --name World
```

The following structure will be generated (relative to `.oemrc.js`):

```
.oemrc.js
  └── World # with the contents: Hello, World!
```

It also supports async functions for template and structure generation.

More complex example can be found in this repository in [`.oemrc.js`](./.oemrc.js).
