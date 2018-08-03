const path = require('path');
const filesystem = require('fs');
const args = require('args');
const prompts = require('prompts');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const yosay = require('yosay');
const ora = require('ora');
const { reset } = require('chalk');

const licenseList = Array.from(require('spdx-license-list/simple'));

args.option(
  'path',
  'The root directory in which to create the Flarum extension',
  process.cwd(),
  p => path.resolve(p)
);

const flags = args.parse(process.argv);
const dir = (args.sub[0] && path.resolve(args.sub[0])) || flags.path;
const store = memFs.create();
const fs = editor.create(store);

const onCancel = () => process.exit();
const initial = true;
let spinner;

console.log(yosay('Welcome to a Flarum extension generator\n\n- ReFlar'));

new Promise((resolve, reject) => {
  spinner = ora('Starting...').start();
  filesystem.readdir(dir, (err, files = []) => {
    spinner.stop();
    resolve((!err || err.code !== 'ENOENT') && files.length !== 0);
  });
})
  .then(
    exists =>
      prompts(
        [
          {
            name: 'verify',
            type: 'confirm',
            message: `Write to ${dir}`,
            initial,
          },
          {
            name: 'overwrite',
            type: prev => prev && exists && 'confirm',
            message: 'Directory not empty. Overwrite?',
          },
        ],
        { onCancel }
      )
  )
  .then(({ verify, overwrite }) => {
    if (!verify || overwrite === false) return process.exit();

    if (overwrite) fs.delete(dir);

    process.stdout.write('\n');

    return prompts(
      [
        {
          name: 'packageName',
          type: 'text',
          message: `Package ${reset.dim('(vendor/extension-name)')}`,
          validate: s =>
            /^([a-zA-Z-]{2,})\/([a-zA-Z-]{2,})$/.test(s.trim()) ||
            'Invalid package name format',
          format: s => s.toLowerCase(),
        },
        {
          name: 'packageDescription',
          type: 'text',
          message: 'Package description',
        },
        {
          name: 'namespace',
          type: 'text',
          message: `Package namespace ${reset.dim('(Vendor\\ExtensionName)')}`,
          validate: s =>
            /^([a-zA-Z]+)\\([a-zA-Z]+)$/.test(s.trim()) ||
            'Invalid namespace format',
          format: str =>
            str &&
            str
              .split('\\')
              .map(s => s[0].toUpperCase() + s.slice(1))
              .join('\\'),
        },
        {
          name: 'authorName',
          type: 'text',
          message: 'Author name',
        },
        {
          name: 'authorEmail',
          type: 'text',
          message: 'Author email',
          validate: s =>
            !s ||
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
              s
            ) ||
            'Invalid email format',
        },
        {
          name: 'license',
          type: 'autocomplete',
          message: 'License',
          choices: licenseList.map(e => ({ title: e })),
        },
        {
          name: 'extensionName',
          type: 'text',
          message: 'Extension name',
          validate: str => !!str.trim() || 'The extension name is required',
          format: str =>
            str
              .split(' ')
              .map(s => (s.length > 3 ? s[0].toUpperCase() + s.slice(1) : s))
              .join(' '),
        },
        {
          name: 'admin',
          type: 'confirm',
          message: 'Admin CSS & JS',
          initial,
        },
        {
          name: 'forum',
          type: 'confirm',
          message: 'Forum CSS & JS',
          initial,
        },
        {
          name: 'useLocale',
          type: 'confirm',
          message: 'Locale',
          initial,
        },
        {
          name: 'useJs',
          type: (prev, values) => (values.admin || values.forum) && 'confirm',
          message: 'Javascript',
          initial,
        },
        {
          name: 'useCss',
          type: (prev, values) => (values.admin || values.forum) && 'confirm',
          message: 'CSS',
          initial,
        },
        {
          name: 'resourcesFolder',
          type: (prev, values) =>
            (values.useLocale || values.useCss) && 'confirm',
          message: 'Move LESS & locale into resources folder?',
          initial,
        },
      ],
      { onCancel }
    );
  })
  .then(data => {
    process.stdout.write('\n');
    spinner = ora('Setting up extension...').start();

    const tpl = Object.assign(data, {
      packageNamespace: data.namespace.replace(/\\/, '\\\\'),
      resourcesFolder: data.resourcesFolder ? '/resources' : '',
    });

    const mv = (from, to) =>
      fs.move(path.resolve(dir, from), path.resolve(dir, to));
    const rename = (from, to) =>
      filesystem.renameSync(path.resolve(dir, from), path.resolve(dir, to));
    const del = f => fs.delete(path.resolve(dir, f));
    const boilerplate = path.resolve(__dirname, '../boilerplate/**');

    fs.copyTpl(boilerplate, dir, tpl);
    mv('gitignore', '.gitignore');
    mv('gitattributes', '.gitattributes');

    if (!tpl.useLocale) del('locale');
    if (!tpl.useJs) del('js');
    if (!tpl.useCss) del('less');
    if (!tpl.admin) {
      del('less/admin.less');
      del('js/src/admin');
      del('js/admin.js');
    }
    if (!tpl.forum) {
      if (tpl.useCss) del('less/app.less');
      if (tpl.useJs) {
        del('js/src/forum');
        del('js/forum.js');
      }
    }
    if (tpl.resourcesFolder) {
      if (tpl.useCss) {
        if (tpl.admin) mv('less/admin.less', 'resources/less/admin.less');
        if (tpl.forum) mv('less/forum.less', 'resources/less/forum.less');
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
  .catch(err => {
    if (spinner) spinner.fail();
    console.error(err);
  });
