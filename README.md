# Flow-types-share

## Purpose

Flow is a wonderful type checker and works great with-in a package/application. If you are publishing any flow-typed libraries, you will want Flow to make use of their exported types in the consuming applications. This doesn't work as intended with Flow because of following reasons. 

If one keeps **node_modules** in the ignore list of flowconfig, then flow starts to throw **unable to resolve module** error.
To overcome this one can define modules in the flow-typed folder; however, the libraries which export flow types also starts getting ignored, hence we cannot make use of the typings provided by the library owners.

The other way, which is a recommended way across community, is not to put node_modules in the ignore list at all. Everything works fine, but the downside is if you have a very large codebase with large dependencies flow starts parsing each and every node_modules which could take a lot of time especially if you are not on ssd drive. It took me 15 mins when I ran flow using this configuration on a medium codebase.

The solution of this problem could be to ignore node_modules except for the few libraries which are exporting flow typings. But since oCamel regex, the regex supported by flowconfig [ignore], does not provide a way to exclude specific folders (there is no ! character in them); the only solution is to list down all node_modules folder name in the [ignore] list excluding the names of the 3rd party which exports flow types. 

This module just does that out of the box for you. 

## Uses

Follow below steps:

### 1. Add the package to dev dependencies
```
yarn add --dev @xt-pagesource/flow-types-share
```

### 2. In the package.json add below task under scripts

```
"flow:config": "flow-config-generate"
```

### 3. Create a .flowconfig.template file in the root folder 

It should be mirroring the .flowconfig suggested by [flow](https://flow.org/en/docs/config/) and add below content.

```
[include]

[ignore]
.*/lib1/.*
{{DYNAMIC_IGNORE}}

[exclusion]
lib2
lib3
```

>**Note:** The current script makes use of **[exclusion]** and **{{DYNAMIC_IGNORE}}**

### 4. Run the task

```
npm run flow:config
```

A .flowconfig file will be generated, listing the names of all modules present in node_modules, excluding the name present in **[exclusion]** list, at the position marked by **{{DYNAMIC_IGNORE}}**

After this you will start seeing Flow typed errors 

>**Note:** Another way to solve this would be publishing your flow-typed definitions and thats quite a big effort, since there are no mature enough tools to auto generate it, just yet. 

```
Usage: bin/flow-config-generate.js [-t|--template] [-p|--folderPath] [-o|--outputPath]

Options:
  -t, --template     path including name of .flowconfig.template file    defaults to .flowconfig.template at the root      [string]
  -p, --folderPath   path of folder from where searching happens         defaults to node_modules                          [string]
  -o, --outputPath   path including name of generated .flwconfig file    defaults to .flowconfig at root                   [string]
```

