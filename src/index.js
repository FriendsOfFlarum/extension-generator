const path = require('path');
const filesystem = require('fs');
const args = require('args');
const inquirer = require('inquirer');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const yosay = require('yosay');
const ora = require('ora');

const licenseList = Array.from(require('spdx-license-list/simple'));

args
  .option(
    'path',
    'The root directory in which to create the Flarum extension',
    process.cwd(),
    p => path.resolve(p)
  );

const flags = args.parse(process.argv);
const dir = (args.sub[0] && path.resolve(args.sub[0])) || flags.path;
const store = memFs.create();
const fs = editor.create(store);

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

let spinner;

new Promise((resolve, reject) => {
  spinner = ora('Starting...').start();
  filesystem.readdir(dir, (err, files = []) => {
    spinner.stop();
    console.log(yosay('Welcome to a Flarum extension generator\n\n- ReFlar'));
    resolve((!err || err.code !== 'ENOENT') && files.length !== 0);
  });
})
  .then(exists =>
    inquirer.prompt([
      {
        name: 'verify',
        message: `Write to ${dir}:`,
        type: 'confirm',
      },
      {
        name: 'overwrite',
        message: 'Directory not empty. Overwrite?',
        type: 'confirm',
        default: false,
        when: answers => answers.verify && exists,
      },
    ])
  )
  .then(({ verify, overwrite }) => {
    if (!verify) return process.exit();

    if (overwrite) fs.delete(dir);
    else if (overwrite === false) process.exit();

    process.stdout.write('\n');

    return inquirer.prompt([
      {
        name: 'packageName',
        message: 'Package:',
        validate: s =>
          /^([a-zA-Z-]{2,})\/([a-zA-Z-]{2,})$/.test(s.trim()) ||
          'Invalid package name format, author/extension-name',
        filter: s => s.toLowerCase(),
      },
      {
        name: 'packageDescription',
        message: 'Package description:',
      },
      {
        name: 'namespace',
        message: 'Package namespace:',
        validate: s =>
          /^([a-zA-Z]+)\\([a-zA-Z]+)$/.test(s.trim()) ||
          'Invalid namespace format, Author\\ExtensionName',
        filter: str =>
          str &&
          str
            .split('\\')
            .map(s => s[0].toUpperCase() + s.slice(1))
            .join('\\'),
      },
      {
        name: 'authorName',
        message: 'Author name:',
      },
      {
        name: 'authorEmail',
        message: 'Author email:',
        validate: s =>
          !s ||
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            s
          ) ||
          'Invalid email format',
      },
      {
        name: 'license',
        message: 'License:',
        type: 'autocomplete',
        source(o, s) {
          const regex = new RegExp(s, 'i');
          return Promise.resolve(
            s ? licenseList.filter(l => regex.test(l)) : licenseList
          );
        },
      },
      {
        name: 'extensionName',
        message: 'Extension name:',
        validate: str => !!str.trim() || 'The extension name is required',
        filter: str =>
          str
            .split(' ')
            .map(s => (s.length > 3 ? s[0].toUpperCase() + s.slice(1) : s))
            .join(' '),
      },
      {
        name: 'admin',
        message: 'Admin CSS & JS:',
        type: 'confirm',
      },
      {
        name: 'forum',
        message: 'Forum CSS & JS:',
        type: 'confirm',
      },
      {
        name: 'useLocale',
        message: 'Locale:',
        type: 'confirm',
      },
      {
        name: 'useJs',
        message: 'Javascript',
        type: 'confirm',
        when: answers => answers.admin || answers.forum,
      },
      {
        name: 'useCss',
        message: 'CSS',
        type: 'confirm',
        when: answers => answers.admin || answers.forum,
      },
      {
        name: 'resourcesFolder',
        message: 'Move LESS & locale into resources folder?',
        type: 'confirm',
        when: answers => answers.useLocale || answers.useCss,
      },
    ]);
  })
  .then(data => {
    process.stdout.write('\n');
    spinner = ora('Setting up extension...').start();

    const tpl = Object.assign(data, {
      packageNamespace: data.namespace.replace(/\\/, '\\\\'),
      resourcesFolder: `__DIR__.'/../..${
        data.resourcesFolder ? '/resources' : ''
      }`,
    });

    const mv = (from, to) =>
      fs.move(path.resolve(dir, from), path.resolve(dir, to));
    const rename = (from, to) =>
        filesystem.renameSync(path.resolve(dir, from), path.resolve(dir, to));
    const del = f => fs.delete(path.resolve(dir, f));
    const boilerplate = path.resolve(__dirname, '../boilerplate/**');

    fs.copyTpl(boilerplate, dir, tpl);
    mv('gitignore', '.gitignore');

    if (!tpl.useLocale) del('locale');
    if (!tpl.useJs) del('js');
    if (!tpl.useCss) del('less');
    if (!tpl.admin) {
      del('less/admin.less');
      del('js/admin');
    }
    if (!tpl.forum) {
      if (tpl.useCss) del('less/app.less');
      if (tpl.useJs) del('js/forum');
    }
    if (!tpl.admin && !tpl.forum && !tpl.useLocale) del('src');
    if (tpl.resourcesFolder) {
      if (tpl.useCss) {
        if (tpl.admin) mv('less/admin.less', 'resources/less/admin.less');
        if (tpl.forum) mv('less/app.less', 'resources/less/app.less');
        del('less');
      }
      if (tpl.useLocale) mv('locale/**', 'resources/locale');
    } else del('resources');

    const license = require(`spdx-license-list/licenses/${data.license}`);
    fs.write(path.resolve(dir, 'LICENSE.md'), license.licenseText);

    return new Promise((resolve, reject) => {
      fs.commit(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  })
  .then(() => {
    spinner.succeed(`Successfully set up Flarum extension in ${dir}`);
  })
  .catch(err => spinner && spinner.fail(err));
