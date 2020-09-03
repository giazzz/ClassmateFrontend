// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://localhost:8080/api',
  // apiUrl: 'https://classmate-api-server.herokuapp.com/api',
  apiUrl: 'http://35.221.225.55/api',
  token: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbjg4OCIsImlhdCI6MTU5ODcxMDkxOCwiZXhwIjoxNTk4Nzk3MzE4fQ.Ed6AxmUrQ1bwPJCmsAanSZUXUlPu9cMTedpICrn598c1awbT0gvN8f5QFuGFJOMk4ZtbdwsrivhNP74kSUIc-w'
};
