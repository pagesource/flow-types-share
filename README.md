# Flow-types-share

## Purpose

Flow is a wonderful typechecker but there is one shortcoming:

If one keeps **node_modules** in the ignore list of flowconfig, then flow starts to throw **unable to resolve module** error.
To overcome this one can define modules in the flow-typed folder; however, the libraries which export flow types also starts getting ignored, hence we cannot make use of the typings provided by the library owners.

The other way, which is a recomended way across community, is not to put node_modules in the ignore list at all. Everything works fine, but the downside is if you have a very large codebase with large dependencies flow starts parsing each and every node_modules which could take a lot of time expecially if you are not on ssd drive. It took me 15 mins when I ran flow using this configuration on a medium codebase.

The soultion of this problem could be to ignore node_modules except for the few libraries which are exporting flow typings. But since oCamel regex,the regex supported by flowconfig [ignore], does not provide a way to exclude specific folders(ther is no ! character in them); the only solution is to list down all node_modules folder name in the [ignore] list excluding the names of the 3rd party which exports flowtypings. The current script just does that automatically

```
yarn add --dev @xt-pagesource/flow-types-share
```
in the package.json put a script
```
"flow:config": "flow-config-generate"
```
make a .flowconfig.template file in the root folder mirroring the .flowconfig suggested by [flow](https://flow.org/en/docs/config/)
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

now run the script
```
npm run flow:config
```
A .flowconfig file will be generated which will list the name of all the files present in the node_modules folder, excludin the name present in **[exclusion]** list, at the position marked by **{{DYNAMIC_IGNORE}}**

```
Usage: bin/flow-config-generate.js [-t|--template] [-p|--folderPath] [-o|--outputPath]

Options:
  -t, --template     path including name of .flowconfig.template file    defaults to .flowconfig.template at the root      [string]
  -p, --folderPath   path of folder from where searching happens         defaults to node_modules                          [string]
  -o, --outputPath   path including name of generated .flwconfig file    defaults to .flowconfig at root                   [string]
```

