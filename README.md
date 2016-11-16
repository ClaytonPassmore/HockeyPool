# HockeyPool

## Installation
This section assumes your `pwd` is the top level of the project.

Install system dependencies for debian and derivatives (other systems are not officially supported):
```bash
make system
```

Install python dependencies:
```bash
make depends
```

Install node dependencies:
```
npm install
```

Initialize and update the database:
```bash
make init
```

## Development
Once again, this section assumes your `pwd` is the top level of the project.

To compile the ECMA Script:
```
npm run grunt
```

To run the web server:
```bash
make run
```
