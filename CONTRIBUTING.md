Contributing
============

If you have changes you'd like to contribute, please open a pull request! Here's a quick guide:

1. [Fork the repo](https://help.github.com/articles/fork-a-repo) and make your changes.

2. Run the tests. We use [Jasmine](http://jasmine.github.io). The easiest way to run them is to open [the test-runner file](test/runner.html).

3. Add tests for your changes. Refactoring and documentation changes normally don't need any new ones, however if you are adding new functionality or fixing a bug, please include tests!

4. Make the tests pass.

5. Minify the source. We use the Closure Compiler ([here's an online one](http://closure-compiler.appspot.com/home)). Use the "advanced" level.

6. Push to your fork and [submit a pull request](https://help.github.com/articles/using-pull-requests#changing-the-branch-range-and-destination-repository). Bonus points if you include a GIF, especially a [tacky](http://www.picdesi.com/upload/comment/thanku/thank-you-030.gif), [dated](http://www.oilsafe.it/wp-content/uploads/2010/10/under-construction.gif), or just [generally painful](http://i.imgur.com/7K5DjwW.gif) one!


Syntax
------

You can probably get most of the finer points by following the conventions already in the source, but here are some key points:

- Tabs! (equal to 4 spaces width)
- No spaces before or after function/method parentheses (`function(){`, not `function () {`)
- camelCase for methods and variables
- No trailing whitespace on lines. Blank lines should not have any spaces.
- A single blank newline at the end of files (except minified ones)
