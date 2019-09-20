# Solidarity Command Options
A listing of CLI options can be found by passing the `help` command to the CLI.

```
 $ solidarity help

Solidarity
 Commands

  solidarity     Check environment against solidarity rules
  create (c)     Displays this help
  help (h)       Displays this help
  report (r)     Report solidarity info about the current machine
  snapshot (s)   Take a snapshot of the versions and store in solidarity file

 Flags

  --verbose		 (-a) Prints all detected info during solidarity check
  --moderate		 (-m) Prints failures in check or single success message
  --silent		 (-s) No output, just a return code of success/failure
  --solidarityFile	 (-f) Use given path to solidarity file for settings
  --module		 (-d) Search for a solidarity file in the given npm package
  --stack		 (-t) Use a known technology stack, and not the local file
  --fix		     Apply fixes to failing rules if fix is available on rule

Solidarity is open source - https://github.com/infinitered/solidarity
If you need additional help, join our Slack at http://community.infinite.red
```

Here we will go into detail on each option flag.

## verbose (-a)
Passing `--verbose` or `-a` flags will modify output to be verbose.

## moderate (-m)
Passing `--moderate` or `-m` flags will modify output to be moderate, meaning only failures exclusive or a single success will be printed.

## silent (-s)
Passing `--silent` or `-s` flags will modify output to be silent, meaning no output will occur.  You'll have to see if the command return is non-zero to see if it failed.

## solidarityFile (-f)
Passing `--solidarityFile` or `-f` flags will direct the file to use for the solidarity check.

> For example:  `solidarity -solidarityFile ./my/special/file.json` will run the designated file instead of looking for a local folder Solidarity file.

## module (-m)
Passing `--module` or `-m` flags will modify the designated solidarity file, to run a file found in the given `node_module` stack.

> For example:  `solidarity --module smoothReporter` will run the solidarity file in the root of the npm package `smoothReporter` instead of our own.

## stack (-t)
Passing `--stack` or `-t` flags will make our stack look to GitHub for a well known tech stack.

> For example: `solidarity --stack react-native` will check our machine if we are ready to run React Native projects, but not a specific React Native project.

Stacks are community managed and found here: https://github.com/infinitered/solidarity-stacks

## fix
Passing `--fix` flag will run fix scripts on any failing rules providing them.