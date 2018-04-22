import app from 'flarum/app';

app.initializers.add('<%= packageName %>', () => {
  console.log('Hello, admin!');
});
